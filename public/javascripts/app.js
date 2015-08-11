var app = angular.module('GestorUI', ['treeControl', 'ngResource', 'satellizer', 'ui.router', 'ui.bootstrap'])
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

app.controller("bibliographyController", function($scope, Book) {
    Book.get(function(data) {
        $scope.roleList = data;
    });
});

app.controller("AuthController", function($auth, $location, $scope) {
    $scope.isAuthenticated = function() {
        return $auth.isAuthenticated();
    };
});

app
    .controller("SignUpController", SignUpController)
    .controller("LoginController", LoginController)
    .controller("LogoutController", LogoutController);

function SignUpController($scope, $auth, $location) {
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
                    $location.path("/bibliografia");
                })
                .catch(function(data) {
                    $scope.errors = data.data;
                });
        }
    }
}

function LoginController($auth, $location) {
    var vm = this;
    this.login = function(valid) {
        if (valid) {
            $auth.login({
                    user: vm.user,
                    password: vm.password
                })
                .then(function(response) {
                    $location.path("/bibliografia")
                })
                .catch(function(response) {});
        }
    }
}

function LogoutController($auth, $location) {
    $auth.logout()
        .then(function() {
            $location.path("/")
        });
}