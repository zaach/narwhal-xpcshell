/**
 * Bootstrap file for the XPCShell engine.
 */
(function(rawGlobal, evalGlobal) {

    rawGlobal.Cc = Components.classes;
    rawGlobal.Ci = Components.interfaces;
    rawGlobal.Cu = Components.utils;
    rawGlobal.Cr = Components.results;
    rawGlobal.CC = Components.Constructor;
    const Env = Cc["@mozilla.org/process/environment;1"].getService(Ci.nsIEnvironment);

    var moduleScopingEnabled = false;
    var NARWHAL_PATH = Env.exists("NARWHAL_PATH") ? Env.get("NARWHAL_PATH") : null,
        NARWHAL_HOME = Env.exists("NARWHAL_HOME") ? Env.get("NARWHAL_HOME") : null,
        NARWHAL_ENGINE_HOME = Env.exists("NARWHAL_ENGINE_HOME") ? Env.get("NARWHAL_ENGINE_HOME") : null,
        debug =  Env.exists("NARWHAL_DEBUG") ? Env.get("NARWHAL_DEBUG") : false,
        verbose = Env.exists("NARWHAL_VERBOSE") ? Env.get("NARWHAL_VERBOSE") : false;

    var global = Components.utils.Sandbox(rawGlobal);
    global.__proto__ = rawGlobal;

    //function print (message) {
        //dump(message + '\n')
    //}

    function getFileUri(file) {
        return Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService)
            .getProtocolHandler('file').QueryInterface(Ci.nsIFileProtocolHandler)
            .getURLSpecFromFile(file);
    }

    function getFile(path) {
        var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
        file.initWithPath(path);
        for (var i=1; i < arguments.length; i++) file.append(arguments[i])
        return file;
    }

    function read(path) {
        const MODE_RDONLY = 0x01;
        const PERMS_FILE = 0644;
        var result = [];
        try {
            var fis = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
            fis.init(getFile(path), MODE_RDONLY, PERMS_FILE, false);
            var lis = fis.QueryInterface(Ci.nsILineInputStream);
            var line = { value: null };
            var haveMore;
            do {
                haveMore = lis.readLine(line)
                result.push(line.value);
            } while (haveMore)
        } catch(e) {
            print('Error:' + e.message);
            print('Stack:' + e.stack);
        } finally {
            fis.close();
        }
        return result.join('\n');
    }

    function isFile(path) {
        try {
            var file = getFile(path);
            return (file.exists() && file.isFile());
        } catch (e) {
            return false;
        }
    }

    function evaluateInSandbox(code, path, lineNo) {
        lineNo = lineNo || 0;
        path = path || "anonymus";
        var scope;
        if (moduleScopingEnabled) {
            scope = Cu.Sandbox(Cc["@mozilla.org/systemprincipal;1"].createInstance(Ci.nsIPrincipal));
            scope.__proto__ = global;
        } else {
            scope = global;
        }
        var source = "(function(require,exports,module,system,print){" + code +"/**/\n})";
        return Cu.evalInSandbox(source, scope, "1.8", path, lineNo);
    }
    // not in use
    function evaluateInGlobal(code, path, lineNo) {
        lineNo = lineNo || 0;
        path = path || "anonymus";
        return Cu.evalInSandbox(code, global, "1.8", path, lineNo);
    }

    function evGlobal(code){
      code = "with(global){"+code+"}";
      return evalGlobal(global, code);
    }

    var path = getFile(NARWHAL_HOME, 'narwhal.js').path;
    var narwhal = Cu.evalInSandbox(read(path), global, "1.8", path, 0);
    narwhal({
        global: global,
        evalGlobal: evGlobal,
        evaluate: evaluateInSandbox,
        engine: 'xpcshell',
        engines: ['xpcshell', 'xulrunner', 'default'],
        os: Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime).OS,
        debug: debug,
        verbose: verbose,
        print: print,
        fs: {
            read: read,
            isFile: isFile
        },
        prefix: NARWHAL_HOME,
        prefixes: [NARWHAL_HOME],
        path: NARWHAL_PATH
    });

})(this, function (global) {
    // no lexical arguments so they do not mask
    // variables by the same name in global scope.
    return eval(arguments[1]);
});
