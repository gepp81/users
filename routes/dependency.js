var async = require('async');

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

exports.createDependency = function(req, res, next) {
    if (req.params.model && req.params.name) {
        createDependency(req, res);
    } else {
        res.status(500).send({
            error: 'Dont set the model.'
        });
    }
};

exports.updateDependency = function(req, res, next) {
    if (req.params.model && req.params.id && req.params.name) {
        updateDependency(req, res);
    } else {
        res.status(500).send({
            error: 'Dont set the model.'
        });
    }
};

exports.getDependencies = function(req, res, next) {
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
};