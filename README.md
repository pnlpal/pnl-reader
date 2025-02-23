# Browser Extension Boilerplate

This is a super easy and efficient boilerplate project for creating awesome browser extensions. It honors simplicity while adding a touch of fun and creativity. It provides a basic structure and setup to help you get started on your extension adventure. Let your imagination run wild and create something truly amazing!


## Features

- Cross-browser compatibility with Chrome and Firefox
- Webpack 5 and hot-reload support
- Content script injection
- Pure vanilla JavaScript
- Manifest v3 support
- Offscreen support
- Handy tools for message passing and storage setting
- Testing framework with Mocha

## Getting Started

1. Clone this repository.
2. Install the required dependencies by running `yarn`.
3. Customize the extension by modifying the files in the `src` directory.
4. Build the extension by running `yarn build`.
5. Load the extension in your browser by following the instructions specific to your browser.

## Directory Structure

```
├── src
│   ├── background
│   ├── content
│   ├── offscreen
│   ├── options
│   ├── images
│   └── manifest.json
├── build
├── utils
├── webpack.config.js
├── package.json
└── README.md
```

## Handy yarn commands

- `yarn start`: Starts a local development server for the project.
- `yarn test`: Runs the project's test suite in a local server environment.
- `yarn build`: Compiles the project and pack it to zip for distribution.


## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## Thanks 

I would like to express my sincere gratitude to the creators of the [chrome-extension-boilerplate-react](https://github.com/lxieyang/chrome-extension-boilerplate-react) project. I have learned a lot from it and this boilerplate is largely based on that project. I highly recommend checking out it too if you are interested in creating browser extensions with React. Once again, thank you to the creators for their hard work and dedication in creating such a valuable resource for the developer community.

I would like to express my gratitude to [@octohedron](https://github.com/octohedron) for their contribution in fixing the HMR. They submitted a pull request [here](https://github.com/lxieyang/chrome-extension-boilerplate-react/pull/110). It's unfortunate that the chrome-extension-boilerplate-react project hasn't merged this valuable pull request yet. This is one of the reasons why I decided to create my own boilerplate. Thank you once again for your contribution.



## License

This project is licensed under the [MIT License](LICENSE).
