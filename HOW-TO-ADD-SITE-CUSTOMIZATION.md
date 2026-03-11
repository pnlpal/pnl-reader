# How to Add Site Customization

Site customization lets you tell PNL Reader exactly how to extract content from any website. When the default reader mode doesn't work well on a site, you can create your own configuration.

## Getting Started

1. Open PNL Reader extension menu
2. Click **Site Customization** in the settings dropdown
3. Fill in the form and click **Save Customization**

## Configuration Schema

Here's what each field does:

### Required Fields

#### `name`

A friendly name for your customization. This helps you identify it later.

```
Example: "Reddit Posts and Comments"
```

#### `urlMatch`

A URL pattern to match. Can be a simple string or a regular expression.

**Simple string (easiest):**

```
"https://example.com/articles/"
```

This matches any URL that contains `https://example.com/articles/`.

**Regular expression (more powerful):**

```
"https://www.reddit.com/r/\\w+/comments/\\w+/.*"
```

This matches any Reddit post URL using regex patterns.

**Regex tips (optional):**

- Use `\\d+` to match numbers
- Use `[^/]+` to match any characters except `/`
- Use `.*` to match anything
- Escape special characters like `.` with `\\.`

---

### Article Settings (Optional)

These fields tell PNL Reader where to find the article content.

#### `article.content`

CSS selector(s) for the main content. This is the most important field.

```
Single selector: "#chapter-content"
Multiple selectors: [".post-body", ".comments"]
```

When you use multiple selectors, content from all matching elements is combined in order.

#### `article.title`

CSS selector for the article title.

```
Example: "h1.post-title"
```

#### `article.byline`

CSS selector for author information.

```
Example: "a[href*='/user/']"
```

#### `article.publishedTime`

CSS selector for the publish date/time.

```
Example: "time[datetime]"
```

#### `article.excludes`

CSS selectors for elements to remove from the content. Useful for hiding ads, share buttons, or other clutter.

```
Example: [".ads", ".share-buttons", ".sidebar"]
```

---

### Navigation Settings (Optional)

Enable previous/next page navigation for multi-page articles.

#### `navigation.previous`

CSS selector for the "previous page" link.

```
Example: "a.prev-chapter"
```

#### `navigation.next`

CSS selector for the "next page" link.

```
Example: "a.next-chapter"
```

---

### Custom CSS (Optional)

#### `css`

Add custom styles for the extracted content. These styles are applied in reader mode.

```css
/* Style comments */
.comment {
  border-left: 2px dashed var(--pico-muted-border-color);
  padding-left: 1em;
  margin: 1em 0;
}

/* Highlight author names */
.author {
  font-weight: bold;
  color: var(--pico-primary);
}
```

**Available CSS variables:**

- `--pico-primary` - Primary accent color
- `--pico-muted-color` - Muted text color
- `--pico-muted-border-color` - Muted border color
- `--pico-background-color` - Background color
- `--pnl-reader-line-height` - Current line height setting

---

## Examples

### Simple Example: NovelFull

```json
{
  "name": "NovelFull Chapters",
  "urlMatch": "https://novelfull.com/[^/]+/[^/]+\\.html$",
  "article": {
    "content": "#chapter-content",
    "title": "a.chapter-title",
    "excludes": ["div"]
  }
}
```

### Complex Example: Reddit

For a more advanced example with custom CSS styling, see [Site Customization - Reddit Posts and Comments](https://pnl.dev/topic/1077/site-customization-reddit-posts-and-comments).

---

## How to Find the Right Selectors

1. Open the website you want to customize
2. Right-click on the content you want to extract
3. Click **Inspect** to open Developer Tools
4. Look at the HTML structure and find unique selectors

**Tips:**

- Use IDs when available (`#main-content`)
- Use class names (`.article-body`)
- Use attribute selectors (`[data-type="post"]`)
- Combine selectors for specificity (`article .content p`)

---

## Share Your Customization

Made a great customization? Share it with the community!

1. Fill in your configuration in the Site Customization page
2. Click **Share at pnl.dev**
3. Review and submit your post

Your configuration will be available at [Reader Trove](https://pnl.dev/category/8/reader-trove) for others to use.

**Formatting tips:**

When sharing, your configuration is wrapped in a JSON code block. If you have custom CSS, it's better to put it in a separate CSS code block rather than inline in the JSON. This makes it easier to read and edit:

````markdown
### Configuration

```json
{
  "name": "My Site",
  "urlMatch": "https://example.com/",
  "article": {
    "content": ".article-body"
  }
}
```

### Custom CSS

```css
.comment {
  border-left: 2px solid #ccc;
  padding-left: 1em;
}
```
````

The **Share at pnl.dev** button does this automatically for you.

---

## Need Help?

Creating customizations can be tricky. Don't hesitate to:

- **Ask questions** at [pnl.dev/category/3/feedback](https://pnl.dev/category/3/feedback)
- **Browse existing configurations** at [Reader Trove](https://pnl.dev/category/8/reader-trove)
- **Report issues** if something doesn't work as expected

The community is here to help. Every question helps improve PNL Reader for everyone.

Happy reading! 📖
