![Obtrusive Live Test Logo](https://raw.githubusercontent.com/franzenzenhofer/f19n-obtrusive-livetest/master/src/public/images/icon.png)

# f19n Obtrusive Livetest Chrome Extension

by http://www.fullstackoptimization.com/
developed in cooperation with https://die-antwort.eu/

Chrome App Store: https://chrome.google.com/webstore/detail/f19n-obstrusive-live-test/jbnaibigcohjfefpfocphcjeliohhold?hl=en

### What is it?

It's a sandboxed, extendable testing chrome extension and framework! It runs pre-defined and custom tests on each page that you visit.

![Sample Output](https://raw.githubusercontent.com/franzenzenhofer/f19n-obtrusive-livetest/master/promotion/sample-output-2.png)


### What does it do?

The extension collects the whole lifecycle of a pageload (http-headers, onpageload, onDOMready, ...) in an object, then it executes javascript functions against this object and returns testing feedback.

It has multiple pre-defined rules currently targeting SEO and webperformance best practices.

See  [/src/public/default-rules](/src/public/default-rules) for a list of what currently gets tested.

See [/sample-rules/sample.page-object-25112017.json](https://raw.githubusercontent.com/franzenzenhofer/f19n-obtrusive-livetest/master/sample-rules/sample-page-object-25112017.json) to see what data of the pageload lifecycle gets collected.


### What can it do?

Everything! You can write your own tests! Anything that happens in the browser during the pageload and render lifecycle can be inspected and dissected!

Additional it can call third party REST-APIs from within these rules. Even ignoring CORS headers or normal fetch restrictions. 

Also you can fetch normale pages and other ressources via fetch, too. I.e.: a rule executed on one page can fetch other URLs of the same domain or from other third party domains.

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

The production ready rules can be found within [/src/public/default-rules](/src/public/default-rules)

Inside [/sample-rules](/sample-rules) are some sample rules plus the documentation how to write your own rules. The rules can then be added to your application on the setting page of the extension.

See [/sample-rules/debug-hello-world.js](/sample-rules/debug-hello-world.js) for a really simple starting point (and [/sample-rules/debug-hello-world-with-comments.js](/sample-rules/debug-hello-world-with-comments.js) for some explaination) 


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
