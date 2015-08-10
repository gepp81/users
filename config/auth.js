// auth.js
var orm = require('orm');
var models = require('../models/index.js');
var jwt = require('jwt-simple');
var moment = require('moment');
var settings = require("./settings.js");
var crypto = require('crypto');

/**
 * SignUp
 */
function validateSignUpRequest(req) {
    req.assert('email', 'Requerido').notEmpty();
    req.assert('email', 'Debe ser una dirección de correo valida.').isEmail();
    req.assert('password', 'De 5 a 15 Caracteres.').len(5, 15);
    req.assert('passwordRepeat', 'De 5 a 15 Caracteres.').len(5, 15);
    req.assert('user', 'De 5 a 15 Caracteres.').len(5, 15);

    var mappedErrors = req.validationErrors(true);
    if (req.body.password !== undefined && req.body.passwordRepeat !== undefined) {
        if (req.body.password != req.body.passwordRepeat) {
            if (mappedErrors.password.msg) {
                mappedErrors.password.msg = "Las claves no coinciden.";
            }
        }
    }
    return mappedErrors;
}

function validateUserExists(req, users) {
    var mappedErrors = {
        hasErrors: false
    };
    for (var i in users) {
        var user = users[i];
        if (user !== undefined) {
            if (user.username && user.username == req.body.user) {
                mappedErrors.user = {
                    userExists: {
                        msg: "El usuario ya está en uso."
                    }
                };
                mappedErrors.hasErrors = true;
            }
            if (user.email && user.email == req.body.email) {
                mappedErrors.email = {
                    emailExists: {
                        msg: "El email ya está en uso."
                    }
                };
                mappedErrors.hasErrors = true;
            }
        }
    }
    return mappedErrors;
}

function createUserDB(req, res) {
    var shasum = crypto.createHash('sha1');
    shasum.update(req.body.password);
    var user = {
        username: req.body.user,
        email: req.body.email,
        password: shasum.digest('hex'),
        admin: false,
        lastName: req.body.lastName,
        firstName: req.body.firstName
    }
    req.models.User.create(user, function(err, items) {
        if (err) {
            return res.status(500).send({
                error: "Cant Connect"
            });
        }
        return res
            .status(200)
            .send({
                token: createToken(user)
            });
    });
}

function createUserData(req, res) {
    req.models.User.find({
        or: [{
            username: req.body.user
        }, {
            email: req.body.email
        }]
    }, function(err, users) {
        var mappedErrors = validateUserExists(req, users);
        if (mappedErrors.hasErrors) {
            return res.status(500).send(mappedErrors);
        } else {
            createUserDB(req, res);
        }
    });
}

exports.userSignup = function(req, res) {
    var mappedErrors = validateSignUpRequest(req);
    if (mappedErrors) {
        res.status(500).send(mappedErrors)
    } else {
        createUserData(req, res);
    }
};

/**
 * SingIn
 */

function createToken(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1, "days").unix(),
    };
    return jwt.encode(payload, settings.tokenAuth.name);
};

exports.userLogin = function(req, res) {
    req.assert('user', "El usuario no puede estar vacio.").notEmpty();
    req.assert('password', "La contraseña no puede estar vacia.").notEmpty();
    var mappedErrors = req.validationErrors(true);
    if (mappedErrors) {
        return res.status(500).send(mappedErrors);
    }

    var shasum = crypto.createHash('sha1');
    shasum.update(req.body.password);
    var password = shasum.digest('hex');

    req.models.User.find({
        username: req.body.user,
        password: password
    }, function(err, users) {
        var user = users[0];
        if (user !== undefined && user.password === password) {
            return res
                .status(200)
                .send({
                    token: createToken(user)
                });
        } else {
            return res.status(500).send({
                error: "Cant Connect"
            });
        }
    });

};

exports.userLogout = function(req, res) {
    return res
        .status(200)
        .send({});
};

exports.ensureAuthenticated = function(req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(403)
            .send({
                message: "Tu petición no tiene cabecera de autorización"
            });
    }

    var token = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(token, settings.tokenAuth.name);

    if (payload.exp <= moment().unix()) {
        return res
            .status(401)
            .send({
                message: "El token ha expirado"
            });
    }

    req.user = payload.sub;
    next();
}