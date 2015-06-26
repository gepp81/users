var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var readDir = require('readdir');
var getMime = require('mime-types')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.get('/bibliografia', function(req, res, next) {
    res.render('index', {
        title: 'Bibliografia'
    });
});

router.post('/download', function(req, res, next) {
    console.log(req.body);
    __parentDir = path.dirname(module.parent.filename);
    var file = path.join(__parentDir, 'bibliografia', req.body.filename);
    res.download(file);
});

function isUnixHiddenPath(path) {
    return (/(^|.\/)\.+[^\/\.]/g).test(path);
};

function dirTree(filename) {
    if (!isUnixHiddenPath(filename)) {
        var stats = fs.lstatSync(filename),
            info = {
                path: filename,
                name: path.basename(filename)
            };

        if (stats.isDirectory()) {
            info.type = "folder";
            info.children = new Array();
            //var files = fs.readdirSync(filename);
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
            info.type = "file";
            info.mime = getMime.lookup(info.path);
        }
        return info;
    }
}

router.get('/getBooks', function(req, res, next) {
    __parentDir = path.dirname(module.parent.filename);
    //var root = path.join(__parentDir, 'bibliografia');
    var root = path.join('/home/guillermo/Documents/prueba/gestor/bibliografia/');
    var json = dirTree(root);
    res.json(json);

});



module.exports = router;