//angular module
var app = angular.module('GestorUI', ['treeControl', 'ngResource', 'satellizer', 'ui.router'])
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
})

app
    .controller("SignUpController", SignUpController)
    .controller("LoginController", LoginController)
    .controller("LogoutController", LogoutController);

function SignUpController($auth, $location) {
    var vm = this;
    this.signup = function() {
        $auth.signup({
                email: vm.email,
                password: vm.password
            })
            .then(function(response) {

                // Si se ha registrado correctamente,
                // Podemos redirigirle a otra parte
                $location.path("/");
            })
            .catch(function(response) {
                // Si ha habido errores, llegaremos a esta función
            });
    }
}

function LoginController($auth, $location) {
    var vm = this;
    this.login = function() {
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

function LogoutController($auth, $location) {
    $auth.logout()
        .then(function() {
            $location.path("/")
        });
}