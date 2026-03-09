import { Readability } from "@mozilla/readability";

/**
 * Get site customization matching current URL
 */
export function getSiteCustomization(globalSettings) {
  const configs = globalSettings.siteCustomizations || [];
  return configs.find((config) => {
    try {
      if (new RegExp(config.urlMatch).test(location.href)) return true;
    } catch (e) {
      // Ignore invalid regex
    }
    return location.href.includes(config.urlMatch);
  });
}

/**
 * Apply custom CSS styles from site customization and legacy localStorage
 */
export function applyCustomStyles(siteCustomization) {
  // 1. Check for site-specific CSS
  if (siteCustomization && siteCustomization.css) {
    const styleElement = document.createElement("style");
    // Auto-prefix all selectors with #PNLReaderArticle
    styleElement.textContent = prefixCssSelectors(
      siteCustomization.css,
      "#PNLReaderArticle",
    );
    document.head.appendChild(styleElement);
  }

  // 2. Check for global custom styles (legacy or override)
  const globalCustomStyles = localStorage.getItem("PNLReader-custom-styles");
  if (globalCustomStyles) {
    const styleElement = document.createElement("style");
    styleElement.textContent = globalCustomStyles;
    document.head.appendChild(styleElement);
  }
}

/**
 * Prefix all CSS selectors with a given prefix.
 * Handles @media queries but skips @keyframes.
 */
function prefixCssSelectors(css, prefix) {
  return css.replace(/([^{}]+)\{/g, (match, selectors) => {
    const trimmed = selectors.trim();
    // Skip @rules (media, keyframes, supports, etc.)
    if (trimmed.startsWith("@")) {
      return match;
    }
    // Skip if already prefixed
    if (trimmed.includes(prefix)) {
      return match;
    }
    // Prefix each selector in comma-separated list
    const prefixed = trimmed
      .split(",")
      .map((s) => `${prefix} ${s.trim()}`)
      .join(", ");
    return prefixed + " {";
  });
}

/**
 * Remove unwanted elements from a container based on selectors
 */
function removeUnwantedElements(element, selectors) {
  if (!selectors || !Array.isArray(selectors)) return;
  selectors.forEach((selector) => {
    try {
      const unwanted = element.querySelectorAll(selector);
      unwanted.forEach((el) => el.remove());
    } catch (e) {
      console.warn("Invalid selector:", selector, e);
    }
  });
}

/**
 * Extract HTML content from an element, including shadow DOM
 */
function extractElementContent(el) {
  // If element has a shadow root, extract content from it
  if (el.shadowRoot) {
    // ShadowRoot doesn't have innerHTML, so we need to serialize children
    const temp = document.createElement("div");
    Array.from(el.shadowRoot.childNodes).forEach((child) => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        // Skip style, script, link elements
        if (["STYLE", "SCRIPT", "LINK"].includes(child.tagName)) return;
        temp.appendChild(child.cloneNode(true));
      } else if (child.nodeType === Node.TEXT_NODE) {
        temp.appendChild(child.cloneNode(true));
      }
    });
    // Also check for slotted content
    const slots = el.shadowRoot.querySelectorAll("slot");
    slots.forEach((slot) => {
      const assigned = slot.assignedNodes({ flatten: true });
      assigned.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          temp.appendChild(node.cloneNode(true));
        } else if (
          node.nodeType === Node.TEXT_NODE &&
          node.textContent.trim()
        ) {
          temp.appendChild(node.cloneNode(true));
        }
      });
    });
    return temp.innerHTML;
  }
  // Use outerHTML for media elements that need to preserve the tag itself
  const outerHTMLTags = [
    "IMG",
    "VIDEO",
    "AUDIO",
    "PICTURE",
    "SOURCE",
    "IFRAME",
    "CANVAS",
    "SVG",
    "EMBED",
    "OBJECT",
  ];
  if (outerHTMLTags.includes(el.tagName)) {
    return el.outerHTML;
  }
  // Default to innerHTML for container elements
  return el.innerHTML;
}

/**
 * Query elements including those with shadow DOM on the live document
 */
function querySelectorAllWithShadow(selector) {
  // First try normal query on live document (not clone, since shadow DOM isn't cloned)
  const elements = document.querySelectorAll(selector);
  return Array.from(elements);
}

/**
 * Extract article content using site customization, legacy selector, or Readability
 */
export function getArticleContent(documentClone, siteCustomization) {
  // 1. Try finding content using formatted config
  if (siteCustomization?.article) {
    const articleConfig = siteCustomization.article;
    // If content selector is provided, try to find it
    if (articleConfig.content) {
      // Support array of selectors - combine content from all matches
      const selectors = Array.isArray(articleConfig.content)
        ? articleConfig.content
        : [articleConfig.content];

      const contentParts = [];
      selectors.forEach((selector) => {
        try {
          // Query live document to access shadow DOM
          const elements = querySelectorAllWithShadow(selector);
          elements.forEach((el) => {
            // Extract content (handles shadow DOM)
            let html = extractElementContent(el);
            // Create a temp container to apply excludes and clean styles
            const temp = document.createElement("div");
            temp.innerHTML = html;
            if (articleConfig.excludes) {
              removeUnwantedElements(temp, articleConfig.excludes);
            }
            // Remove inline styles from extracted content
            temp.querySelectorAll("[style]").forEach((styled) => {
              styled.removeAttribute("style");
            });
            // Remove any style tags that came with the content
            temp.querySelectorAll("style").forEach((s) => s.remove());
            contentParts.push(temp.innerHTML);
          });
        } catch (e) {
          console.warn("Invalid content selector:", selector, e);
        }
      });

      if (contentParts.length > 0) {
        const title = articleConfig.title
          ? document.querySelector(articleConfig.title)?.textContent ||
            documentClone.querySelector(articleConfig.title)?.textContent ||
            documentClone.title
          : documentClone.title;

        // Extract byline (author)
        let byline = null;
        if (articleConfig.byline) {
          byline =
            document.querySelector(articleConfig.byline)?.textContent ||
            documentClone.querySelector(articleConfig.byline)?.textContent;
        }

        // Extract published time
        let publishedTime = null;
        if (articleConfig.publishedTime) {
          const timeEl = document.querySelector(articleConfig.publishedTime);
          if (timeEl) {
            // Try datetime attribute first, then title, then textContent
            publishedTime =
              timeEl.getAttribute("datetime") ||
              timeEl.getAttribute("title") ||
              timeEl.textContent;
          }
        }

        const content = contentParts.join("\n");
        // Calculate text length (excluding HTML tags)
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const textLength = tempDiv.textContent.length;

        return {
          content,
          title,
          byline,
          publishedTime,
          length: textLength,
          siteName: location.hostname,
        };
      }
    }

    // If no content selector provided, or selector failed, but we have exclude rules:
    // Apply excludes to body before passing to Readability
    if (articleConfig.excludes) {
      removeUnwantedElements(documentClone.body, articleConfig.excludes);
    }
  }

  // 2. Legacy fallback
  const customArticleContentSelector = localStorage.getItem(
    "PNLReader-article-content-selector",
  );
  if (customArticleContentSelector) {
    const customArticle = documentClone.querySelector(
      customArticleContentSelector,
    );
    if (customArticle) {
      return {
        content: customArticle.innerHTML,
        title: documentClone.title,
      };
    }
  }

  // 3. Readability fallback
  return new Readability(documentClone).parse();
}
