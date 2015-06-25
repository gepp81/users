var express = require('express');
var router = express.Router();
var fs = require('fs'),
    path = require('path')

/* GET users listing. */
router.get('/', function(req, res, next) {

    console.log("entrando ...");

    function isUnixHiddenPath(path) {
        return (/(^|.\/)\.+[^\/\.]/g).test(path);
    };

    function dirTree(filename) {
        var stats = fs.lstatSync(filename),
            info = {
                path: filename,
                name: path.basename(filename)
            };

        if (stats.isDirectory()) {
            info.type = "folder";
            info.children = fs.readdirSync(filename).map(function(child) {
                return dirTree(filename + '/' + child);
            });
        } else {
            // Assuming it's a file. In real life it could be a symlink or
            // something else!
            info.type = "file";
        }

        return info;
    }

   
   
        var util = require('util');
        console.log(util.inspect(dirTree('/home/guillermo/vaciar'), false, null));
//          console.log(util.inspect(dirTree('/home/guillermo/vaciar''), false, null));
    });

module.exports = router;