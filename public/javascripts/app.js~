var app = angular.module('GestorUI', ['treeControl', 'ngResource', 'satellizer', 'ui.router', 'ui.bootstrap', 'ngStorage'])
    .config(function($authProvider, $urlRouterProvider, $stateProvider) {
        // Parametros de configuración
        var urlAuth = "http://localhost:3000/auth/";
        $authProvider.loginUrl = urlAuth + "login";
        $authProvider.signupUrl = urlAuth + "signup";
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
                templateUrl: "views/dependencies/list.html",
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

app.factory("Dependencies", function($resource) {
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

app.factory("Dependency", function($resource) {
    return $resource("/dependency/:model/:id/:name", {}, {
        post: {
            method: 'POST',
            params: {
                model: "@model",
                name: "@name"
            }
        },
        put: {
            method: 'PUT',
            params: {
                model: "@model",
                id: "@id",
                name: "@name"
            }
        }
    });
});

app
    .controller("AuthController", AuthController)
    .controller("BibliographyController", BibliographyController)
    .controller("SignUpController", SignUpController)
    .controller("LoginController", LoginController)
    .controller("LogoutController", LogoutController)
    .controller("DependencyController", DependencyController)
    .controller("ModalSaveController", ModalSaveController);