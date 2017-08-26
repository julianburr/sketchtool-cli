# sketchtool-cli

Simple cli wrapped around Sketch.app's [`sketchtool`](https://www.sketchapp.com/tool/) binary.

Will **always** use the binary installed with Sketch, so whenever Sketch updates, it takes the updated version of `sketchtool` as well.

## Usage

```bin
yarn add sketchtool-cli
```

```js
const sketchtool = require('sketchtool-cli');

// Check if sketchtool binary is available
sketchtool.check();

// Get current version (string)
sketchtool.version();  // = sketchtool --version

// Get path to sketch plugin folder
sketchtool.pluginFolder();  // = sketchtool show plugins

// Execute any command
sketchtool.run('dump ~/myFile.sketch');

// Abstractions for most commonly used commands
sketchtool.dump('~/myFile.sketch');  // = sketchtool dump ~/myFile.sketch
sketchtool.list('pages', '~/myFile.sketch');  // = sketchtool list pages ~/myFile.sketch
```
