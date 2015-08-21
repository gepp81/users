var express = require('express');
var router = express.Router();
var fs = require('fs');
var pathFunctions = require('path');
var readDir = require('readdir');
var getMime = require('mime-types');
var settings = require('../config/settings.js');
var auth = require('../config/auth.js');
var async = require('async');

/* home page. */
router.get('/', function(req, res, next) {
    res.sendFile(pathFunctions.join(__dirname, '..', 'public', 'views', '/index.html'));
});

/**
 * Login, SignUp and logout
 */

router.post('/auth/signup', auth.userSignup);
router.post('/auth/login', auth.userLogin);
router.post('/auth/logout', auth.userLogout);

router.post('/test', function(req, res, next) {

    async.parallel({
            one: function(callback) {
                req.models.User.one({
                    username: req.body.user
                }, function(err, user) {
                    if (err) {
                        callback(err);
                    }
                    if (user !== undefined) {
                        callback(null, true);
                    } else {
                        callback(null, false);
                    }
                });
            },
            two: function(callback) {
                req.models.User.one({
                    username: req.body.user
                }, function(err, user) {
                    if (err) {
                        callback(err);
                    }
                    if (user !== undefined) {
                        callback(null, false);
                    } else {
                        callback(null, true);
                    }
                });
            }
        },
        function(err, results) {
            console.log(results.one);
            console.log(results.two);
            res.status(500).send({})
        });
});

/**
 * Tree
 */
function isUnixHiddenPath(path) {
    return (/(^|.\/)\.+[^\/\.]/g).test(path);
};

function dirTree(filename, root) {
    if (!isUnixHiddenPath(filename)) {
        var pathTruncated = filename.replace(root, '');
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
                    var child = dirTree(filename + entry, root);
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
            info.size = size < 1 ? "< 1MB" : size + "MB";
            info.type = "file";
            info.mime = getMime.lookup(info.path);
        }
        return info;
    }
}

router.get('/getBibliography', auth.ensureAuthenticated, auth.ensurePermissions(['DEPENDENCY_READ']), function(req, res, next) {
    //router.get('/getBibliography', function(req, res, next) {
    try {
        var root = pathFunctions.resolve(settings.bibliography.path);
        root = root + settings.bibliography.slash;
        var json = dirTree(root, root);
        res.status(200).json(json);
    } catch (err) {
        res.status(500).send({
            error: 'Cant process the requestt'
        });
    }
});

function updateDependency(req, res) {
    req.models[req.params.model].get(req.params.id, function(err, itemDB) {
        itemDB.name = req.params.name;
        itemDB.save(function(err) {
            if (err) {
                res.status(500).send({
                    error: 'Error to update the value.'
                });
            } else {
                res.status(200).send({});
            }
        });
    });
};

function createDependency(req, res) {
    var item = {
        name: req.params.name
    };
    req.models[req.params.model].create(item, function(err, itemNew) {
        if (err) {
            console.error(err);
            res.status(500).send({
                error: 'Error to create the value.'
            });
        }
        if (item.id) {
            res.status(200).send({});
        }
    });
};

router.put('/dependency/:model/:id/:name', auth.ensureAuthenticated, auth.ensurePermissions(['DEPENDENCY_WRITE']),
    function(req, res, next) {
        if (req.params.model && req.params.id && req.params.name) {
            updateDependency(req, res);
        } else {
            res.status(500).send({
                error: 'Dont set the model.'
            });
        }
    });

router.post('/dependency/:model/:name', auth.ensureAuthenticated, auth.ensurePermissions(['DEPENDENCY_WRITE']),
    function(req, res, next) {
        if (req.params.model && req.params.name) {
            createDependency(req, res);
        } else {
            res.status(500).send({
                error: 'Dont set the model.'
            });
        }
    });

router.get('/getDependencies/:model/:page', auth.ensureAuthenticated, auth.ensurePermissions(['DEPENDENCY_READ']),
    function(req, res, next) {
        if (req.params.model) {
            async.parallel({
                    dependencies: function(callback) {
                        var LIMIT = 10;
                        var ORDER = 'name';
                        var page = 1;
                        if (req.params.page) {
                            page = req.params.page;
                        }
                        page = (page - 1) * LIMIT;
                        req.models[req.params.model].find().order(ORDER).limit(LIMIT).offset(page).run(function(err, dependencies) {
                            if (err) {
                                callback(err);
                            }
                            callback(null, dependencies);
                        });
                    },
                    total: function(callback) {
                        req.models[req.params.model].count(function(err, totalItems) {
                            if (err) {
                                callback(err);
                            }
                            callback(null, totalItems);
                        });
                    }
                },
                function(err, results) {
                    if (err) {
                        res.status(500).send({
                            error: 'Cant get items.'
                        });
                    } else {
                        res.status(200).send(results);
                    }
                });
        } else {
            res.status(500).send({
                error: 'Dont set the model.'
            });
        }
    });

module.exports = router;
