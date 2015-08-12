// auth.js
var orm = require('orm');
var models = require('../models/index.js');
var jwt = require('jwt-simple');
var moment = require('moment');
var settings = require("./settings.js");
var crypto = require('crypto');

/**
 * Crea el Token para la sesión
 */
function createToken(user) {
    var tokenUser = {
        id: user.id,
        permissions: user.permissions,
        admin: user.admin
    };
    var payload = {
        sub: tokenUser,
        iat: moment().unix(),
        exp: moment().add(1, "days").unix(),
    };
    return jwt.encode(payload, settings.tokenAuth.name);
};

/***
 * SignUp 
 **/

/**
 * Valida si los campos para registrarse son correcots.
 */
function validateSignUpRequest(req) {
    req.assert('email', 'Requerido').notEmpty();
    req.assert('email', 'Debe ser una dirección de correo valida.').isEmail();
    req.assert('password', 'De 5 a 15 Caracteres.').len(5, 15);
    req.assert('passwordRepeat', 'De 5 a 15 Caracteres.').len(5, 15);
    req.assert('user', 'De 5 a 25 Caracteres.').len(5, 25);

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

/**
 * Valida si los campos usuario y/o email están en uso.
 */
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

/**
 * Genera el token de la sesion y lo devuelve como respuesta
 */
function getUserToken(res, user) {
    user.getPermissions(function(err, permissions) {
        var list = new Array();
        var permission;
        for (var i in permissions) {
            permission = permissions[i];
            list.push(permission.view);
        }
        return res
            .status(200)
            .send({
                token: createToken(user),
                permissions: list,
                admin: user.admin
            });
    });
}

/**
 * Crea el usuario en la base de datos y asocia sus permisos. 
 * Por ser usuario nuevo solo tendra acceso a los permisos básicos.
 */
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

    req.models.User.create(user, function(err, userFound) {
        if (err) {
            return res.status(500).send({
                error: "Cant Create"
            });
        } else {
            req.models.Permission.get(1, function(err, permission) {
                userFound.addPermissions(permission, function(err) {
                    if (err) {
                        var errorMsg = 'Cant associate permissions to tihs user'
                        return res
                            .status(500)
                            .send({
                                error: errorMsg
                            });
                    }
                    return getUserToken(res, userFound);
                });
            });
        }
    });
};

/**
 * Crea un usuario si cumple con los requerimientos para registrarlo
 */
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

/**
 * Registra un usuario.
 */
exports.userSignup = function(req, res) {
    var mappedErrors = validateSignUpRequest(req);
    if (mappedErrors) {
        res.status(500).send(mappedErrors)
    } else {
        createUserData(req, res);
    }
};

/***
 * SingIn
 **/

/**
 * Inicia el login para un usuario.
 */
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
            return getUserToken(res, user);
        } else {
            return res.status(500).send({
                error: "Cant Get User"
            });
        }
    });
};

/**
 * Accion para el logout del usuario.
 */
exports.userLogout = function(req, res) {
    return res
        .status(200)
        .send({});
};

/**
 * Verifica que el usuario este logueado y que su sesion no este vencida.
 */
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
    } else {
        req.userId = payload.sub.id;
        req.userPermissions = payload.sub.permissions;
        req.userAdmin = payload.sub.admin;
    }
    next();
}

/**
 * Verifica que tenga los permisos necesario para acceder a un request
 */
exports.ensurePermissions = function(permissions) {
    return function(req, res, next) {
        if (req.userAdmin) {
            next();
        } else {
            var permissionsViews = new Array();
            var item;
            for (var i in req.userPermissions) {
                item = req.userPermissions[i].name;
                permissionsViews.push(item);
            }
            for (var i in permissions) {
                item = permissions[i];
                if (permissionsViews.indexOf(item) == -1) {
                    return res
                        .status(401)
                        .send({
                            message: "No tienes los permisos suficientes."
                        });
                }
            }
        }
        next();
    }
}