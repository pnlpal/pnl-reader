# PNL Reader

PNL Reader is a simple browser extension designed to make reading more enjoyable and relaxing. Whether you're reading articles, novels, or any other web content, PNL Reader enhances your experience with its user-friendly features.

## Download
Chrome: [PNL Reader on Chrome Web Store](https://chromewebstore.google.com/detail/pnl-reader/amdebfiljmlhfkenbhhpckmmpkonpdfh)  
Firefox: [PNL Reader on Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pnl-reader/)  
Edge: [PNL Reader on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pnl-reader/gdpndpkknkgkmoikgpldekejoabkplmd)
## Features

1. **Dictionary Integration**: Compatible with Dictionariez, allowing you to instantly look up any word on web pages by simply clicking on it.
2. **Privacy First**: PNL Reader respects your privacy by only using the **ActiveTab** permission to create reader mode on the webpage you clicked on, without requiring any additional host permissions.
3. **Multiple themes**: Includes dark and light modes to suit your reading preference and reduce eye strain.
4. **Font Options**: Choose from dozens of fonts.
5. **Customizable**: Set global preferences or customize settings per website.
6. **Navigation Shortcuts**: Easily navigate to the previous or next page on popular web novel websites such as Scribble and RoyalRoad with convenient keyboard shortcuts.
7. **Mobile Friendly**: Install [Kiwi] or [Flow] to use PNL Reader on cellphone.

## Getting Started

To see PNL Reader in action, check out our [introduction video](https://www.youtube.com/watch?v=0O605kMAnHI).

[![PNL Reader Introduction](https://img.youtube.com/vi/0O605kMAnHI/0.jpg)](https://www.youtube.com/watch?v=0O605kMAnHI)


## Build

1. use `yarn` or `npm install` to install requirements.
2. `npm start` to start a webpack dev-server, add the `build/` directory in your browser's extension page to load the extension.
3. To build for Firefox, please use the environment variable `BROWSER=Firefox`. So `BROWSER=Firefox npm start` will build a development version of this add-on for Firefox.
4. `npm run build` to build the release version. The dest path is `build/`. And `BROWSER=Firefox npm run build` to build the Firefox release version.  
5. `./pack.sh` to pack the extension to zip file. For Firefox, use `BROWSER=Firefox ./pack.sh`.


## Feedback and Support

We'd love to hear your thoughts and suggestions! If you encounter any issues or have any feedback, please reach out to us at [Programming N' Language Community](https://pnlpal.dev/category/3/feedback).


## License

PNL Reader is licensed under the MIT License. Feel free to use, modify, and distribute it as per the terms of the license.

Happy Reading!

[kiwi]: https://kiwibrowser.com/
[flow]: https://play.google.com/store/apps/details?id=org.flow.browser
