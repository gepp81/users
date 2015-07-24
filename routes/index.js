var express = require('express');
var router = express.Router();
var fs = require('fs');
var pathFunctions = require('path');
var readDir = require('readdir');
var getMime = require('mime-types');
var settings = require('../config/settings.js');
var auth = require('../config/auth.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendFile(pathFunctions.join(__dirname, '..', 'public', 'views', '/index.html'));
});

function isUnixHiddenPath(path) {
    return (/(^|.\/)\.+[^\/\.]/g).test(path);
};

function dirTree(filename) {
    if (!isUnixHiddenPath(filename)) {
        var pathTruncated = filename.replace(settings.bibliography.path, '');
        var stats = fs.lstatSync(filename),
            info = {
                path: pathTruncated,
                name: pathFunctions.basename(filename)
            };
        if (stats.isDirectory()) {
            info.type = "folder";
            info.children = new Array();
            var files = readDir.readSync(filename, ['*.java', '*.xml', '*.docx', '*.PDF', '*.DOC', '*.DOCX', '*/'],
                readDir.INCLUDE_DIRECTORIES + readDir.CASE_SORT);
            
            files.forEach(function(entry) {
                if (!isUnixHiddenPath(entry)) {
                    var child = dirTree(filename + entry);
                    info.children.push(child);
                    info.children.sort(function(one, second) {
                        return ((second.type == one.type) ? 0 : ((second.type > one.type) ? 1 : -1));
                    });
                }
            });
            
        } else {
            // Assuming it's a file. In real life it could be a symlink or
            // something else!
            var size = parseInt(stats.size / 1000000);
            info.size = size < 1 ? "< 1MB" :  size + "MB";
            info.type = "file";
            info.mime = getMime.lookup(info.path);
        }
        return info;
    }
}

router.get('/auth/signup', auth.userSignup);
router.post('/auth/login', auth.userLogin);
router.post('/auth/logout', auth.userLogout);

//router.get('/getBibliography', auth.ensureAuthenticated, function(req, res, next) {
router.get('/getBibliography', function(req, res, next) {
    __parentDir = pathFunctions.dirname(module.parent.filename);
    //var root = path.join(__parentDir, 'bibliografia');
    var root = pathFunctions.join(settings.bibliography.path);
    var json = dirTree(root);
    res.json(json);

});

module.exports = router;