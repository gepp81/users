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