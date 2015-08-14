var app = angular.module('GestorUI', ['treeControl', 'ngResource', 'satellizer', 'ui.router', 'ui.bootstrap', 'ngStorage'])
    .config(function($authProvider, $urlRouterProvider, $stateProvider) {
        // Parametros de configuración
        $authProvider.loginUrl = "http://localhost:3000/auth/login";
        $authProvider.signupUrl = "http://localhost:3000/auth/signup";
        $authProvider.tokenName = "token";
        $authProvider.tokenPrefix = "GestorUI";

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state("home", {
                url: "/home"
            })
            .state("error", {
                url: "/error",
                templateUrl: "views/error.html"
            })
            .state("login", {
                url: "/login",
                templateUrl: "views/login.html",
                controller: "LoginController",
                controllerAs: "login"
            })
            .state("signup", {
                url: "/signup",
                templateUrl: "views/signup.html",
                controller: "SignUpController",
                controllerAs: "signup"
            })
            .state("logout", {
                url: "/logout",
                templateUrl: null,
                controller: "LogoutController"
            })
            .state("bibliografia", {
                url: "/bibliografia",
                templateUrl: "views/bibliography.html"
            })
            .state("dependencies", {
                url: "/dependencies",
                templateUrl: "views/dependencies.html",
                controller: "DependencyController"
            });
    });

app.directive('equals', function() {
    return {
        restrict: 'A', // only activate on element attribute
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, elem, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // watch own value and re-validate on change
            scope.$watch(attrs.ngModel, function() {
                validate();
            });

            // observe the other value and re-validate on change
            attrs.$observe('equals', function(val) {
                validate();
            });

            var validate = function() {
                // values
                var val1 = ngModel.$viewValue;
                var val2 = attrs.equals;

                // set validity
                ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
            };
        }
    }
});

app.factory("Book", function($resource) {
    return $resource("/getBibliography");
});

app.factory("Dependency", function($resource) {
    return $resource("/getDependencies/:model/:page", {}, {
        get: {
            method: 'GET',
            params: {
                model: "@model",
                page: "@page"
            }
        }
    });
});

app.controller("bibliographyController", function($scope, Book) {
    Book.get(function(data) {
        $scope.roleList = data;
    });
});

app.controller("AuthController", function($auth, $location, $scope, $localStorage) {
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };

    $scope.hasPermission = function(permission) {
        if ($localStorage.admin) {
            return true;
        } else {
            if ($localStorage.permissions) {
                if ($localStorage.permissions.indexOf(permission) == -1) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }
});

app
    .controller("SignUpController", SignUpController)
    .controller("LoginController", LoginController)
    .controller("LogoutController", LogoutController)
    .controller("DependencyController", DependencyController);

function SignUpController($localStorage, $scope, $auth, $location) {
    var vm = this;
    this.signup = function(valid) {
        if (valid) {
            $auth.signup({
                    user: vm.user,
                    password: vm.password,
                    passwordRepeat: vm.passwordRepeat,
                    email: vm.email,
                    firstName: vm.firstName,
                    lastName: vm.lastName
                })
                .then(function(response) {
                    $localStorage.permissions = response.data.permissions;
                    $localStorage.admin = response.data.admin;
                    $location.path("/home");
                })
                .catch(function(data) {
                    $scope.errors = data.data;
                });
        }
    }
}

function LoginController($localStorage, $auth, $location) {
    var vm = this;
    this.login = function(valid) {
        if (valid) {
            $auth.login({
                    user: vm.user,
                    password: vm.password
                })
                .then(function(response) {
                    $localStorage.permissions = response.data.permissions;
                    $localStorage.admin = response.data.admin;
                    $location.path("/home")
                })
                .catch(function(response) {});
        }
    }
}

function LogoutController($auth, $location, $localStorage) {
    $auth.logout()
        .then(function() {
            $location.path("/")
        });
    $localStorage.$reset();
}

function DependencyController($scope, $timeout, Dependency) {
    $scope.dependencies = [{
        name: "Acronym",
        alias: "Acrónimo"
    }, {
        name: "Conservation",
        alias: "Conservación"
    }, {
        name: "Dating",
        alias: "Datación"
    }, {
        name: "Age",
        alias: "Edad"
    }, {
        name: "Incoming",
        alias: "Ingreso"
    }, {
        name: "Integrity",
        alias: "Integridad"
    }, {
        name: "Location",
        alias: "Locación"
    }, {
        name: "OtherRest",
        alias: "Otros Restos"
    }, {
        name: "Preservation",
        alias: "Preservación"
    }, {
        name: "Accuracy",
        alias: "Precisión"
    }, {
        name: "State",
        alias: "Provincias"
    }, {
        name: "Sepulture",
        alias: "Sepultura"
    }, {
        name: "Sex",
        alias: "Sexo"
    }, {
        name: "Site",
        alias: "Sitio"
    }];

    var addAlert = function(msg, type) {
        if ($scope.selectedDependency) {
            msg = msg + ' ' + $scope.selectedDependency.alias + '.';
        }
        var alert = {
            type: type,
            msg: msg
        };
        $scope.alerts.push(alert);
        alert.close = function() {
            $scope.alerts.splice($scope.alerts.indexOf(this), 1);
        };

        $timeout(function() {
            $scope.alerts.splice($scope.alerts.indexOf(alert), 1);
        }, 3000);
    }

    var failGetDependencies = function(msg) {
        $scope.dependenciesList = false;
        $scope.currentPage = 1;
        addAlert(msg, 'danger');
    }

    var getDependencies = function(page) {
        $scope.cantSearch = true;
        if ($scope.selectedDependency === undefined) {
            addAlert('Seleccione una dependencia.', 'info');
        } else {
            Dependency.get({
                model: $scope.selectedDependency.name,
                page: page
            }, function(data) {
                if (data.dependencies.length == 0) {
                    failGetDependencies("No se han encontrado valores para");
                } else {
                    $scope.dependenciesList = data.dependencies;
                    $scope.totalItems = data.total;
                }
            }, function(error) {
                failGetDependencies("Error al buscar valores para");
            });
        }
    };

    $scope.dependenciesList = false;
    $scope.cantSearch = true;
    $scope.alerts = [];
    addAlert('Seleccione una dependencia.', 'info');

    $scope.getPaginationInfo = function() {
        var page = $scope.currentPage ? $scope.currentPage : 1;
        var min = (page - 1) * 10 + 1;
        var max = (min + 9) < $scope.totalItems ? (min + 9) : $scope.totalItems ;
        return "Items " + min.toString() + " al " + max + " . Total de items " + $scope.totalItems + ".";
    }

    $scope.searchDependency = function() {
        $scope.currentPage = 1;
        getDependencies($scope.currentPage);
    }

    $scope.pageChanged = function() {
        getDependencies($scope.currentPage);
    }
    
    $scope.searchTypeChanged = function() {
        $scope.cantSearch = false;
    }    
    
 /**   $scope.$on("$destroy", function(){
       console.log("");
    });**/
}