# PNL Reader: read quietly or read aloud, it's your choice.
![PNL Reader Promo](screenshots/PNL%20Reader%20Marquee%20Promo.png)

This browser extension transforms any article, web novel, or PDF into a distraction-free, customizable reading experience. Instantly switch between silent reading and natural-sounding text-to-speech, enjoy beautiful themes with paper-feel background, and take advantage of seamless dictionary integration. Whether you want to relax with a story, power through research, or listen on the go, PNL Reader adapts to your reading style.

## Download
Chrome: [PNL Reader on Chrome Web Store](https://chromewebstore.google.com/detail/pnl-reader/amdebfiljmlhfkenbhhpckmmpkonpdfh)  
Firefox: [PNL Reader on Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pnl-reader/)  
Edge: [PNL Reader on Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/pnl-reader/gdpndpkknkgkmoikgpldekejoabkplmd)

## Features

1. **Read Quietly or Read Aloud**: Instantly switch between silent reading and natural-sounding text-to-speech. Select any text or let PNL Reader read the whole page aloud—perfect for learning, multitasking, or relaxing your eyes.
2. **Automatic Page Turning**: Enjoy continuous reading with auto-advance to the next page, especially handy on web novel sites like Royalroad and Scribblehub.
3. **Multiple Themes**: Choose from a variety of beautiful themes (including dark, light, Solarized, Dracula, and more). Enjoy a paper-like background for a comfortable reading experience.
4. **PDF Support**: Open and read PDFs from sites like arXiv, Springer, and more, with seamless integration into the reader mode.
5. **Dictionary Integration**: Compatible with [Dictionariez], allowing you to instantly look up any word on web pages or PDFs by simply clicking on it.
6. **Font Options**: Choose from dozens of fonts, including handwriting and screen-friendly sans-serif options.
7. **Customizable**: Set global preferences or customize settings per website.
8. **Navigation Shortcuts**: Easily navigate to the previous or next page on popular web novel websites such as Scribblehub and RoyalRoad with convenient keyboard shortcuts.
9. **Visual Reading Indicators**: See clear visual cues when "read whole page" mode is active.
10. **Privacy First**: PNL Reader respects your privacy by only using the **ActiveTab** permission to create reader mode on the webpage you clicked on, without requiring any additional host permissions.
11. **Mobile Friendly**: Install [Kiwi] or [Flow] to use [Dictionariez] on your cellphone.


## Getting Started

To see PNL Reader in action, check out our [introduction video](https://www.youtube.com/watch?v=9c7MgPAEqW4).

[![PNL Reader Introduction](https://img.youtube.com/vi/9c7MgPAEqW4/0.jpg)](https://www.youtube.com/watch?v=9c7MgPAEqW4)

## Build

1. **Install dependencies:**  
    Use `yarn` or `npm install` to install all required packages.

2. **Start development server:**  
    Run `npm start` to launch the webpack dev-server.  
    - By default, this builds for Chrome.  
    - To build for Firefox or Edge, set the `BROWSER` environment variable:  
      - Firefox: `BROWSER=Firefox npm start`  
      - Edge: `BROWSER=Edge npm start`  
    - Load the `build/` directory as an unpacked extension in your browser's extension page.

3. **Build release version:**  
    Run `npm run build` to create a production build in the `build/` directory.  
    - For Firefox: `BROWSER=Firefox npm run build`  
    - For Edge: `BROWSER=Edge npm run build`

4. **Package the extension:**  
    Use `./pack.sh` to package the extension into a zip file.  
    - For Firefox: `BROWSER=Firefox ./pack.sh`  
    - For Edge: `BROWSER=Edge ./pack.sh`

## Feedback and Support

We'd love to hear your thoughts and suggestions! If you encounter any issues or have any feedback, please reach out to us at [Programming N' Language Community](https://pnl.dev/category/3/feedback).

## License

PNL Reader is licensed under the MIT License. Feel free to use, modify, and distribute it as per the terms of the license.

Happy Reading!

[kiwi]: https://kiwibrowser.com/
[flow]: https://play.google.com/store/apps/details?id=org.flow.browser
[Dictionariez]: https://github.com/pnlpal/dictionariez#dictionariez