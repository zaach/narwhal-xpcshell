
var IO = require("./io").IO;

exports.stdin  = {
    readLine: global.readline
};
exports.stdout = (function() {
    var buffer = [];
    return {
        write: function(text) {
            buffer.push(text.toString());
            return this;
        },
        flush: function() {
            global.dump(buffer.join(""));
            buffer = [];
        }
    };
})();
exports.stderr = exports.stdout; /*TODO*/

exports.args = global.arguments || [];

exports.env = environment || [];

exports.fs = require('./file');

// default logger
var Logger = require("logger").Logger;
exports.log = new Logger(exports.stdout);

