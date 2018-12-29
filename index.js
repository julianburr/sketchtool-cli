const fs = require('fs-extra');
const execSync = require('child_process').execSync;
const invariant = require('invariant');

const BINARY_PATH =
  '/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool';

const ALLOWED_LIST_TYPES = [
  'artboards',
  'formats',
  'layers',
  'pages',
  'slices'
];

/**
 * Escapes e.g. path strings to be passed into exec function
 * @param  {string} string
 * @return {string}
 */
function escape (string) {
  return string
    .replace(/ /g, '\\ ')
    .replace(/\n/g, '')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Execute any kind of terminal command synchronously
 * @param  {string} command
 * @return {string}
 */
function exec (command) {
  return execSync(command).toString();
}
/**
 * Check if binary exists at given path
 * @return {Boolean}
 */
function check () {
  return !!fs.existsSync(BINARY_PATH);
}

/**
 * Execute sketchtool binary command
 * @param  {string} command
 * @return {string}
 */
function sketchtoolExec (command) {
  return exec(`${BINARY_PATH} ${command}`);
}

/*----------------------------------------
 | The following functions are just abstractions
 | of sketchtool's commands!
 *---------------------------------------*/

/**
 * Receive the currently installed Sketch version
 * @return {string} [description]
 */
function version () {
  return sketchtoolExec('--version');
}

/**
 * Receive plugin folder path from current Sketch installation
 * @return {string}
 */
function pluginFolder () {
  const path = sketchtoolExec('show plugins');
  invariant(path, 'Plugin folder not found!');
  invariant(fs.existsSync(path), `Plugin folder does not exist at ${path}!`);
  return path;
}

/**
 * Run given plugin command of given plugin name
 * @param  {string} pluginName
 * @param  {string} identifier
 * @param  {Object} options
 */
function runPluginWithIdentifier (pluginName, identifier, options = {}) {
  const pluginFolderPath = options.dir || pluginFolder();

  // Append `.sketchplugin` if not passed in with the plugin name
  if (!pluginName.endsWith('.sketchplugin')) {
    pluginName += '.sketchplugin';
  }
  const pluginPath = `${pluginFolderPath}/${pluginName}`;

  // Check if the plugin actually exists before running anything!
  const exists = fs.existsSync(pluginPath);
  invariant(
    exists,
    `Plugin '${pluginPath}' not found! Cannot run plugin command!`
  );

  let args = '';

  if (options.context) {
    args += `--context='${JSON.stringify(options.context)}' `;
  }

  sketchtoolExec(`run ${escape(pluginPath)} ${identifier} ${args}`);
}

/**
 * Dump sketch file as json
 * @param  {string} filePath
 * @return {Object}
 */
function dump (filePath) {
  return JSON.parse(sketchtoolExec(`dump ${escape(filePath)}`));
}

/**
 * List specific element type from given file
 * @param  {string} type
 * @param  {string} filePath
 * @return {Object}
 */
function list (type, filePath) {
  invariant(
    ALLOWED_LIST_TYPES.includes(type),
    `Type '${type}' is not supported by sketchtool`
  );
  return JSON.parse(sketchtoolExec(`list ${type} ${escape(filePath)}`));
}

module.exports = {
  check: check,
  version: version,
  pluginFolder: pluginFolder,
  dump: dump,
  list: list,
  run: sketchtoolExec,
  runPluginWithIdentifier: runPluginWithIdentifier
};
