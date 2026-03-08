import "./styles.less";
import utils from "utils";

// Make body visible as we have hidden the unstyled page during loading.
document.body.style.setProperty("visibility", "visible", "important");

// DOM elements
const form = document.getElementById("customization-form");
const nameInput = document.getElementById("name-input");
const matchInput = document.getElementById("match-input");
const articleContentInput = document.getElementById("article-content-input");
const articleTitleInput = document.getElementById("article-title-input");
const articleBylineInput = document.getElementById("article-byline-input");
const articlePublishedTimeInput = document.getElementById(
  "article-published-time-input",
);
const articleExcludesInput = document.getElementById("article-excludes-input");
const navPreviousInput = document.getElementById("nav-previous-input");
const navNextInput = document.getElementById("nav-next-input");
const cssInput = document.getElementById("css-input");
const saveBtn = document.getElementById("save-btn");
const clearBtn = document.getElementById("clear-btn");
const editingNameInput = document.getElementById("editing-index");
const saveStatus = document.getElementById("save-status");
const customizationsList = document.getElementById("customizations-list");

(async () => {
  // Load site customizations
  let siteCustomizations = await utils.send("get site customizations");

  // Display status message
  function showStatus(message, isError = false) {
    saveStatus.textContent = message;
    saveStatus.className = isError ? "error" : "success";
    saveStatus.style.display = "block";
    setTimeout(() => (saveStatus.style.display = "none"), 5000);
  }

  // Parse comma-separated values into array
  function parseCommaSeparated(value) {
    if (!value || !value.trim()) return null;
    const items = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return items.length > 0 ? items : null;
  }

  // Format array to comma-separated string
  function formatToCommaSeparated(arr) {
    if (!arr) return "";
    if (Array.isArray(arr)) return arr.join(", ");
    return arr;
  }

  // Build customization object from form
  function buildCustomizationFromForm() {
    const customization = {};

    // Required fields
    const name = nameInput.value.trim();
    if (!name) {
      showStatus("Name is required", true);
      return null;
    }
    customization.name = name;

    const match = matchInput.value.trim();
    if (!match) {
      showStatus("Match pattern is required", true);
      return null;
    }
    customization.match = match;

    // Article object (optional)
    const articleContent = parseCommaSeparated(articleContentInput.value);
    const articleTitle = articleTitleInput.value.trim();
    const articleByline = articleBylineInput.value.trim();
    const articlePublishedTime = articlePublishedTimeInput.value.trim();
    const articleExcludes = parseCommaSeparated(articleExcludesInput.value);

    if (
      articleContent ||
      articleTitle ||
      articleByline ||
      articlePublishedTime ||
      articleExcludes
    ) {
      customization.article = {};
      if (articleContent) {
        customization.article.content =
          articleContent.length === 1 ? articleContent[0] : articleContent;
      }
      if (articleTitle) customization.article.title = articleTitle;
      if (articleByline) customization.article.byline = articleByline;
      if (articlePublishedTime)
        customization.article.publishedTime = articlePublishedTime;
      if (articleExcludes) customization.article.excludes = articleExcludes;
    }

    // Navigation object (optional)
    const navPrevious = navPreviousInput.value.trim();
    const navNext = navNextInput.value.trim();
    if (navPrevious || navNext) {
      customization.navigation = {};
      if (navPrevious) customization.navigation.previous = navPrevious;
      if (navNext) customization.navigation.next = navNext;
    }

    const css = cssInput.value.trim();
    if (css) customization.css = css;

    return customization;
  }

  // Populate form with customization data
  function populateForm(customization) {
    nameInput.value = customization.name || "";
    matchInput.value = customization.match || "";
    articleContentInput.value = formatToCommaSeparated(
      customization.article?.content,
    );
    articleTitleInput.value = customization.article?.title || "";
    articleBylineInput.value = customization.article?.byline || "";
    articlePublishedTimeInput.value =
      customization.article?.publishedTime || "";
    articleExcludesInput.value = formatToCommaSeparated(
      customization.article?.excludes,
    );
    navPreviousInput.value = customization.navigation?.previous || "";
    navNextInput.value = customization.navigation?.next || "";
    cssInput.value = customization.css || "";
  }

  // Clear the form
  function clearForm() {
    form.reset();
    editingNameInput.value = "";
    saveBtn.textContent = "Save Customization";
  }

  // Save customization
  async function saveCustomization(e) {
    e.preventDefault();

    const customization = buildCustomizationFromForm();
    if (!customization) return;

    try {
      siteCustomizations = await utils.send("add site customization", {
        customization,
      });

      showStatus("Saved! Consider sharing your customization at pnl.dev 🎨");
      renderCustomizationsList();
    } catch (error) {
      showStatus("Failed to save. Please try again.", true);
      console.error("Save error:", error);
    }
  }

  // Edit customization
  function editCustomization(name) {
    const customization = siteCustomizations.find((c) => c.name === name);
    if (!customization) return;

    populateForm(customization);
    editingNameInput.value = name;
    saveBtn.textContent = "Update Customization";

    // Scroll to form
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Delete customization
  async function deleteCustomization(name) {
    const customization = siteCustomizations.find((c) => c.name === name);
    if (!customization) return;

    const displayName = customization.name || customization.match;

    if (!confirm(`Delete "${displayName}"?`)) return;

    try {
      siteCustomizations = await utils.send("remove site customization", {
        name,
      });

      showStatus("Customization deleted!");
      renderCustomizationsList();

      // Clear form if we were editing this one
      if (editingNameInput.value === name) {
        clearForm();
      }
    } catch (error) {
      showStatus("Failed to delete. Please try again.", true);
      console.error("Delete error:", error);
    }
  }

  // Render the customizations list
  function renderCustomizationsList() {
    if (!siteCustomizations || siteCustomizations.length === 0) {
      customizationsList.innerHTML = `
        <p class="empty-message">No custom site configurations yet. Create one above!</p>
      `;
      return;
    }

    customizationsList.innerHTML = "";

    siteCustomizations.forEach((customization) => {
      const item = document.createElement("div");
      item.className = "customization-item";

      const info = document.createElement("div");
      info.className = "customization-info";

      const name = document.createElement("span");
      name.className = "customization-name";
      name.textContent = customization.name || "(Unnamed)";

      const match = document.createElement("code");
      match.className = "customization-match";
      match.textContent = customization.match;

      info.appendChild(name);
      info.appendChild(match);

      const actions = document.createElement("div");
      actions.className = "customization-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "secondary outline";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () =>
        editCustomization(customization.name),
      );

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "secondary outline danger";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () =>
        deleteCustomization(customization.name),
      );

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      item.appendChild(info);
      item.appendChild(actions);
      customizationsList.appendChild(item);
    });
  }

  // Event listeners
  form.addEventListener("submit", saveCustomization);
  clearBtn.addEventListener("click", clearForm);

  // Initial render
  renderCustomizationsList();
})();
