const sketchtool = require('../index');
const path = require('path');

const testFile = path.resolve(__dirname, './test.sketch');

describe('SketchTool CLI', () => {
  
  it('check', () => {
    // NOTE: you need Sketch installed to have this test pass!
    expect(sketchtool.check()).toBe(true);
  });

  it('version', () => {
    expect(sketchtool.version()).toBeDefined();
  });

  it('pluginFolder', () => {
    const pluginFolder = sketchtool.pluginFolder();
    const expectedFolder = process.env.HOME +
      '/Library/Application Support/com.bohemiancoding.sketch3/Plugins';
    expect(path.resolve(pluginFolder)).toBe(path.resolve(expectedFolder));
  });

  it('runPluginWithIdentifier', () => {
    expect(typeof sketchtool.runPluginWithIdentifier).toBe('function');
  });

  it('dump', () => {
    const dump = sketchtool.dump(testFile);
    expect(dump).toBeDefined();
    expect(typeof dump).toBe('object');
  });

  it('list', () => {
    const layers = sketchtool.list('layers', testFile);
    expect(layers.pages.length).toBe(1);
    expect(layers.pages[0].name).toBe('Page 1');

    const pageLayers = layers.pages[0].layers;
    expect(pageLayers.length).toBe(1);
    expect(pageLayers[0].name).toBe('Rectangle');
  });

});