var io = require('io');
 
exports.exit = function (status) {
    quit(status);
};
 
exports.sleep = function (seconds) {
    throw "NYI";
};
 
exports.fork = function () {
    throw "NYI";
};
 
exports.exec = function () {
    throw "NYI";
};
 
exports.dup = function () {
    throw "NYI";
};
 
exports.dup2 = function () {
    throw "NYI";
};
 
exports.setsid = function () {
    throw "NYI";
};
 
exports.getpid = function () {
    throw "NYI";
};
 
 
exports.popen = function (command, options) {
    throw "NYI";
};

exports.system = function (command) {
    var shell = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile)
    shell.initWithPath('/bin/sh');
    var process = Cc['@mozilla.org/process/util;1'].getService(Ci.nsIProcess);
    process.init(shell);

    if (Array.isArray(command)) {
        command = command.map(function (arg) {
            return require("os").enquote(arg);
        }).join(" ");
    }

    process.run(true, ['-c',command], 2);
    return process.exitValue;
};
 
