insert into user(id, username, firstName, lastName, email, password, admin) value (1, 'sysadmin', 'Administrador', 'Administrador', 'cambiar@cambiame.com', '185b690770ab3ba9cede059ec80060bcaa6cfb36', true);
insert into user(id, username, firstName, lastName, email, password, admin) value (2, 'gpidote', 'Guillermo', 'Pi Dote', 'piqui81@gmail.com', '185b690770ab3ba9cede059ec80060bcaa6cfb36', false);

insert into permission (id, name, alias, view) value (1, 'DEPENDENCY_READ', 'Lectura de Dependencias', 'DEP_READ');
insert into permission (id, name, alias, view) value (2, 'DEPENDENCY_WRITE', 'Escritura de Dependencias', 'DEP_WRITE');
insert into permission (id, name, alias, view) value (3, 'DEPENDENCY_DELETE', 'Eliminación de Dependencias', 'DEP_DELETE');
insert into permission (id, name, alias, view) value (4, 'USER_READ', 'Lectura de Usuarios', 'USR_READ');
insert into permission (id, name, alias, view) value (5, 'USER_WRITE', 'Escritura de Usuarios', 'USR_WRITE');
insert into permission (id, name, alias, view) value (6, 'USER_DELETE', 'Eliminación de Usuarios', 'USR_DELETE');

insert into user_permissions(user_id, permissions_id) value(2,4);
insert into user_permissions(user_id, permissions_id) value(2,1);