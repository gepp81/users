insert into user(id, username, firstName, lastName, email, password, admin) value (1, 'guillermo.pidote', 'Guillermo', 'Pi Dote', 'piqui81@gmail.com', '185b690770ab3ba9cede059ec80060bcaa6cfb36', true);

insert into permission (id, name, alias, view) value (1, 'DEPENDENCY_READ', 'Lectura de Dependencias', 'DEP_READ');
insert into permission (id, name, alias, view) value (2, 'DEPENDENCY_WRITE', 'Escritura de Dependencias', 'DEP_WRITE');
insert into permission (id, name, alias, view) value (3, 'DEPENDENCY_DELETE', 'Eliminación de Dependencias', 'DEP_DELETE');