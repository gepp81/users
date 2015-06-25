module.exports = function (db, models) {

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
        }
    });

    models.Role = db.define('role', {
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
        }
    });

    models.Role.hasMany("permissions", models.Permission);

    models.User = db.define('user', {
        id: 'serial',
        username: {
            type: 'text',
            required: true,
            unique: true
        },
        firstName: {
            type: 'text',
            required: true
        },
        dni: {
            type: 'text',
            required: true,
            unique: true
        },
        lastName: {
            type: 'text',
            required: true
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
        token: {
            type: 'text',
            required: true
        },
        admin: Boolean
    });

    models.User.hasMany('roles', models.Role);

    // Sincronize db ONLY FOR FIRST
    db.drop(function () {
        // dropped all tables from defined models (Person and Pet)

        db.sync(function () {
            // created tables for Person model
        });
    });
};