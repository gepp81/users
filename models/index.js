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

    // Sincronize db ONLY FOR FIRST
    /*db.drop(function() {
        // dropped all tables from defined models (Person and Pet)

        db.sync(function() {
            // created tables for Person model
        });
    });*/
};