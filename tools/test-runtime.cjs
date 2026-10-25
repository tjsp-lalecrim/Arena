const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const source = fs.readFileSync('js/plugins/Arena_Runtime.js', 'utf8');
function run(parameters) {
    const context = { PluginManager: { parameters: () => parameters }, ImageCache: {}, SceneManager: {} };
    vm.runInNewContext(source, context);
    return [context.ImageCache.limit, context.SceneManager._screenWidth, context.SceneManager._screenHeight,
        context.SceneManager._boxWidth, context.SceneManager._boxHeight];
}
assert.deepEqual(run({}), [20000000, 816, 624, 816, 624]);
assert.deepEqual(run({ CacheMegapixels: '32', Width: '960', Height: '540' }), [32000000, 960, 540, 960, 540]);
assert.deepEqual(run({ CacheMegapixels: 'Infinity', Width: 'NaN', Height: '-1' }), [20000000, 816, 624, 816, 624]);
assert.deepEqual(run({ CacheMegapixels: '0', Width: '900.5', Height: '99999' }), [20000000, 816, 624, 816, 624]);
console.log('Arena_Runtime: defaults, alternate project configuration and invalid inputs passed.');
