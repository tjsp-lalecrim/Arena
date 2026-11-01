// One explicit packaging override. No gameplay, saves or plugin-registry changes.
exports.apply=function(file,bytes,technical){
 if(file!=='data/ArenaDebugHub.json')return bytes;
 const config=JSON.parse(bytes.toString('utf8'));
 if(config.schemaVersion!==1||typeof config.enabled!=='boolean')throw Error('Invalid debug hub configuration');
 return Buffer.from(JSON.stringify({...config,enabled:technical===true},null,2)+'\n');
};
