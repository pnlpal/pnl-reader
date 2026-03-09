import redditCss from "./siteStyles/reddit.css?raw";

export default [
  {
    name: "Wattpad Stories",
    urlMatch: "https://www.wattpad.com/\\d+.*",
    article: {
      content: ".page pre",
      excludes: [".component-wrapper"],
    },
    navigation: {
      next: "#story-part-navigation a",
    },
  },
  {
    name: "NovelFull Chapters",
    urlMatch: "https://novelfull.com/[^/]+/[^/]+\\.html$",
    article: {
      content: "#chapter-content",
      title: "a.chapter-title",
      excludes: ["div"],
    },
  },
  {
    name: "Reddit Posts and Comments",
    urlMatch: "https://www.reddit.com/r/\\w+/comments/\\w+/.*",
    article: {
      content: [
        'shreddit-post [slot="text-body"]',
        'shreddit-post [slot="post-media-container"] img#post-image',
        "shreddit-post gallery-carousel img.media-lightbox-img",
        "shreddit-comment-tree > shreddit-comment",
      ],
      title: 'shreddit-post [slot="title"]',
      byline: "shreddit-post a[href*='/user/']",
      publishedTime: "shreddit-post faceplate-timeago time",
      excludes: [
        "shreddit-post-overflow-menu",
        "faceplate-dropdown-menu",
        "award-button",
        "shreddit-post-share-button",
        "shreddit-async-loader",
        "shreddit-comment-action-row",
      ],
    },
    css: redditCss,
  },
];
