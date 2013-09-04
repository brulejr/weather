var i18n = require("i18next");
var pjson = require('../package.json');

// configure i18n
i18n.init({
	lng: 'en-US',
	fallbackLng: 'en-US',
  debug: false,
	ns: 'messages',
	resGetPath: 'i18n/__lng__/__ns__.json' 
});

var viewMetadata = {
    t: i18n.t,
    appname: pjson.name,
    env: process.env.NODE_ENV || 'DEV',
    license: pjson.license,
    version: pjson.version
};

var rootHandler = function (req, res) {
  req.reply.view('index', viewMetadata);
};

var viewHandler = function (request) {
  request.reply.view('client/' + request.params.view, viewMetadata);
};

module.exports = [
    { method: 'GET', path: '/', config: { handler: rootHandler } },
    { method: 'GET', path: '/view/{view}', config: { handler: viewHandler } },
    { method: 'GET', path: '/{path*}', config: { 
    	  handler: { 
    		  directory: { path: './public', listing: false, index: false} } 
    	}}
];