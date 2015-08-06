// auth.js
var orm = require('orm');
var models = require('../models/index.js');
var jwt = require('jwt-simple');
var moment = require('moment');
var settings = require("./settings.js");

function createToken(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(14, "days").unix(),
    };
    return jwt.encode(payload, settings.tokenAuth.name);
};

exports.userSignup = function(req, res) {
    console.log("Esto es signup");
    var user = {
        username: "gpidote",
        firstName: "Guillermo",
        dni: 28541772,
        lastName: "Pi Dote",
        email: "gpidote@gestor.com",
        password: "gpi123",
        admin: true
    };

    req.models.User.create(user, function(err, items) {
        console.log(err);
        return res
            .status(200)
            .send({
                token: createToken(user)
            });
    });
};

exports.userLogin = function(req, res) {
    console.log(req.body);
    if (req.body !== undefined && req.body.password !== undefined && req.body.user !== undefined) {
        req.models.User.find({ 
            username: req.body.user.toLowerCase(),
            password: req.body.password
        }, function(err, users) {
            var user = users[0];
            if (user !== undefined && user.password === req.body.password) {
                return res
                    .status(200)
                    .send({
                        token: createToken(user),
                        roles: user
                    });
            } else {
                return res.status(500).send({
                    error: "Cant Connect"
                });
            }
        });
    } else {
        return res.status(500).send({
            error: "Cant Connect"
        });
    }
};

exports.userLogout = function(req, res) {
    return res
        .status(200)
        .send({});
};

exports.ensureAuthenticated = function(req, res, next) {  
  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({message: "Tu petición no tiene cabecera de autorización"});
  }

  var token = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(token, settings.tokenAuth.name);

  if(payload.exp <= moment().unix()) {
     return res
         .status(401)
        .send({message: "El token ha expirado"});
  }

  req.user = payload.sub;
  next();
}