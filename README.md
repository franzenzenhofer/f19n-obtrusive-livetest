<svg width="100" height="100" viewBox="0 0 100 100"><circle fill="#1783E5" cx="50" cy="50" r="48"/><path fill="#E6E6E6" d="M74.5 83.2H38.2V20.4h36.3c2.7 0 4.8 2.1 4.8 4.8v53.1c0 2.7-2.2 4.9-4.8 4.9z"/><path fill="#B3B3B3" d="M40.2 26.4h35.5v4H40.2zM40.2 31.1h21.1v4H40.2zM40.2 40.8h35.5v4H40.2zM40.2 45.5h21.1v4H40.2zM40.2 54.6h35.5v4H40.2zM40.2 59.4h21.1v4H40.2zM40.2 68.9h35.5v4H40.2zM40.2 73.6h21.1v4H40.2z"/><path fill="#FFF" d="M42.2 79.9H27.6c-2.7 0-4.8-2.1-4.8-4.8V22c0-2.7 2.1-4.8 4.8-4.8h14.7v62.7z"/><path fill="#F05228" d="M32.7 22c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4S35.7 22 32.7 22zm3 6.9l-1.4 1.4-1.6-1.6-1.6 1.6-1.4-1.4 1.6-1.6-1.6-1.6 1.4-1.4 1.6 1.6 1.6-1.6 1.4 1.4-1.6 1.6 1.6 1.6z"/><path fill="#1783E5" d="M32.7 50.4c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7s-.3.7-.7.7c-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.7h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1zM32.7 64.6c-3 0-5.4 2.4-5.4 5.4s2.4 5.4 5.4 5.4c3 0 5.4-2.4 5.4-5.4s-2.4-5.4-5.4-5.4zm0 2.3c.4 0 .7.3.7.7 0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7.1-.4.4-.7.7-.7zm1.2 5.8h-2.4v-1h.5v-2h-.5v-1h1.8v3h.5l.1 1z"/><path fill="#FAC917" d="M37.3 44.9l-4.5-7.7c-.3-.6-1.2-.5-1.5 0l-4.5 7.6c-.3.6.2 1.2.8 1.2h9c.7 0 1.1-.6.7-1.1zM32.7 40l-.1 4h-1l-.1-4h1.2zm-.1 5.3c-.1.1-.3.2-.5.2s-.4-.1-.5-.2c-.1-.1-.2-.3-.2-.4 0-.2.1-.3.2-.4.1-.1.3-.2.5-.2s.4.1.5.2c.1.1.2.3.2.4 0 .1-.1.2-.2.4z"/><path fill="#666" d="M38.2 83.2v-3.3h4z"/></svg>

# f19n Obtrusive Livetest Chrome Extension

by http://www.fullstackoptimization.com/
developed in cooperation with https://die-antwort.eu/

## Development

### Install all dependencies

```shell
npm install
```

### Run the build process

run the build process once (for this you need grunt-cli installed `npm install -g grunt-cli`)

```shell
grunt
```

or if you want to automatically reload the extension after every change. Its required if you make changes inside RuleContext.js or other core scripts. **Its not required if you just work on custom rules.**

first install https://github.com/prasmussen/chrome-cli

```shell
brew install chrome-cli
```
then:

```shell
grunt --reload-extension
```

Open [chrome://extensions/](chrome://extensions/) and point the installation of an unpacked extension to the ./build folder

## Rules

Inside [/sample-rules](/sample-rules) are some sample rules plus the documentation how to write your own rules.

## License

 * All rules within the /sample-rules/ directory are MIT licensed.
 * All rules within the /public/default-rules/ directory are MIT licensed.
 * See details within the directory.

All other code within this repository - if not defined otherwise - is currently available under a

**Contribution License**.

You are welcome to

 * review the code
 * install the application in your browser
 * submit issues, pull requests, any other feedback
 * compile and use this extension in development mode on your computer with the goal of learning about the codebase or delivering feedback
 * use code for educational purposes for yourself or within your organization

Currently don't

 * remove this license
 * remove branding or links from/to www.fullstackoptimization.com
 * create a free or commercial product based upon the code of this repository
 * submit a product based on this code to any app store
 * install this extension in developer mode on multiple computers within your company

 These restrictions do not apply to the /sample-rules/  and the /public/default-rules/  code.

 This license might change in the future. I must just figure out what the best long term license for this product will be.

Rightsholder: Franz Enzenhofer fe at f19n dot com
