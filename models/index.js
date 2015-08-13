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
        name: String
    });
    models.Acronym = db.define("acronym", {
        id: 'integer',
        name: String
    });
    models.Archaeologist = db.define("archaeologist", {
        id: 'integer',
        name: String
    });
    models.Completeness = db.define("completeness", {
        id: 'integer',
        name: String
    });
    models.Age = db.define("age", {
        id: 'integer',
        name: String
    });
    models.Sex = db.define("sex", {
        id: 'integer',
        name: String
    });
    models.Preservation = db.define("preservation", {
        id: 'integer',
        name: String
    });
    models.Entity = db.define("entity", {
        id: 'integer',
        name: String
    });
    models.Burial = db.define("burial", {
        id: 'integer',
        name: String
    });
    models.Sepulture = db.define("sepulture", {
        id: 'integer',
        name: String
    });
    models.Position = db.define("position", {
        id: 'integer',
        name: String
    });
    models.Rest = db.define("rest", {
        id: 'integer',
        name: String
    });
    models.Shape = db.define("shape", {
        id: 'integer',
        name: String
    });
    models.Location = db.define("location", {
        id: 'integer',
        name: String
    });
    models.Country = db.define("country", {
        id: 'integer',
        name: String
    });
    models.Site = db.define("site", {
        id: 'integer',
        name: String
    });

    // Sincronize db ONLY FOR FIRST
    /*db.drop(function() {
        // dropped all tables from defined models (Person and Pet)

        db.sync(function() {
            // created tables for Person model
        });
    });*/
};