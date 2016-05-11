# f19n Livetest Chrome Extension

## Development

### Install all dependencies

```shell
npm install
```

### Run the build process

run the build process once

```shell
grunt
```

or if you want to automatically reload the extension after every change. Its required if you make changes inside RuleContext.js or other core scripts. **Its not required if you just work on custom rules.**

```shell
grunt --reload-extension
```

Open [chrome://extensions/](chrome://extensions/) and point the installation of an unpacked extension to the ./build folder

## Rules

Inside [/sample-rules](/sample-rules) are some sample rules plus the documentation how to write your own rules.

