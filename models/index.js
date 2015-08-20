module.exports = function(db, models) {

    models.Permission = db.define("permission", {
        id: 'serial',
        name: {
            type: 'text',
            required: true,
            unique: true
        },
        alias: {
            type: 'text',
            required: true,
            unique: true
        },
        view: {
            type: 'text',
            required: true,
            unique: true
        }
    });

    models.User = db.define('user', {
        id: 'serial',
        username: {
            type: 'text',
            required: true,
            unique: true
        },
        firstName: {
            type: 'text'
        },
        lastName: {
            type: 'text'
        },
        email: {
            type: 'text',
            required: true,
            unique: true
        },
        password: {
            type: 'text',
            required: true
        },
        admin: Boolean
    });

    models.User.hasMany("permissions", models.Permission, {}, {
        autoFetch: true
    });

    models.State = db.define("state", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Acronym = db.define("acronym", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Archaeologist = db.define("archaeologist", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Completeness = db.define("completeness", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Age = db.define("age", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Sex = db.define("sex", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Preservation = db.define("preservation", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Entity = db.define("entity", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Burial = db.define("burial", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Sepulture = db.define("sepulture", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Position = db.define("position", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Rest = db.define("rest", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Shape = db.define("shape", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Location = db.define("location", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Country = db.define("country", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });
    models.Site = db.define("site", {
        id: 'integer',
        name: {
            type: 'text',
            unique: true
        }
    });

    // Sincronize db ONLY FOR FIRST
    db.drop(function() {
        // dropped all tables from defined models (Person and Pet)

        db.sync(function() {
            // created tables for Person model
        });
    });
};