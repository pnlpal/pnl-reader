import redditCss from "./siteStyles/reddit.css?raw";

export default [
  {
    match: "https://www.wattpad.com/\\d+.*",
    articleSelector: ".page pre",
    excludes: [".component-wrapper"],
    navigation: {
      next: "#story-part-navigation a",
    },
  },
  {
    match: "https://novelfull.com/[^/]+/[^/]+\\.html$",
    articleSelector: "#chapter-content",
    titleSelector: "a.chapter-title",
    excludes: ["div", "h3"],
  },
  {
    match: "https://www.reddit.com/r/\\w+/comments/\\w+/.*",
    articleSelector: [
      'shreddit-post [slot="text-body"]',
      'shreddit-post [slot="post-media-container"] img',
      "shreddit-comment-tree shreddit-comment",
    ],
    titleSelector: 'shreddit-post [slot="title"]',
    excludes: [
      "shreddit-post-overflow-menu",
      "faceplate-dropdown-menu",
      "award-button",
      "shreddit-post-share-button",
      "shreddit-async-loader",
      "shreddit-comment-action-row",
    ],
    css: redditCss,
  },
];
