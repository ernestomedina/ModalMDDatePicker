/*!
* @(#)Modal MD Datepicker.js
* @author: Diego Guevara - github.com/diegoguevara
* Created: 2016.04
*/


var mdThemeColors = angular.module('mdThemeColors', ['ngMaterial']).config(['$provide', '$mdThemingProvider', function($provide, $mdThemingProvider) {
  var colorStore = {};
  Object.keys($mdThemingProvider._PALETTES).forEach(
    function(palleteName) {
      var pallete = $mdThemingProvider._PALETTES[palleteName];
      var colors = [];
      colorStore[palleteName] = colors;
      Object.keys(pallete).forEach(function(colorName) {
        if (/#[0-9A-Fa-f]{6}|0-9A-Fa-f]{8}\b/.exec(pallete[colorName])) {
          colors[colorName] = pallete[colorName];
        }
      });
    });

  
  $provide.factory('mdThemeColors', [
    function() {
      var service = {};

      var getColorFactory = function(intent) {
        return function() {
          var colors = $mdThemingProvider._THEMES['default'].colors[intent];
          var name = colors.name

          colorStore[name].default = colorStore[name][colors.hues['default']]
          colorStore[name].hue1 = colorStore[name][colors.hues['hue-1']]
          colorStore[name].hue2 = colorStore[name][colors.hues['hue-2']]
          colorStore[name].hue3 = colorStore[name][colors.hues['hue-3']]
          return colorStore[name];
        }
      }

      
      Object.defineProperty(service, 'primary', {
        get: getColorFactory('primary')
      });

      Object.defineProperty(service, 'accent', {
        get: getColorFactory('accent')
      });

      Object.defineProperty(service, 'warn', {
        get: getColorFactory('warn')
      });

      Object.defineProperty(service, 'background', {
        get: getColorFactory('background')
      });

      return service;
    }
    ]);
}]);

var ModalDatePicker = angular.module('ModalDatePicker', ['ngMaterial', 'mdThemeColors']);
ModalDatePicker.factory('ModalDatePickerCount', function() {
  var instanceCount = 0;

  var _Increment = function() {
    instanceCount++;
  }

  var _GetCount = function() {
    return instanceCount;
  }

  return {
    GetCount: _GetCount,
    Increment: _Increment
  }
});

ModalDatePicker.directive('modalMdDatepicker', function($timeout, $filter, $mdDialog, $compile, mdThemeColors, $mdMedia, ModalDatePickerCount) {
  return {
    restrict: 'E',
    replace: false,
    require: 'ngModel',
    scope: {
      ngModel: '=',
      ngDisabled: '=',
      placeholder: '@',
      orientation: '@'
    },
    template: '<md-input-container md-no-float>\
    <label ng-attr-for="modal-md-dp-directive-{{serial}}">{{placeholder}}</label>\
    <input type="text" ng-attr-id="modal-md-dp-directive-{{serial}}" ng-model="SelectedDateText" ng-click="showModalDatePicker($event, SelectedDate)" />\
    </md-input-container>',
    link: function($scope, $element, $attr, $ctrl) {
      function formatter(value) {
        if (value) {
          return value;
        }
      }

      function parser(value) {
        if (value && angular.isDate(value)) return value;
        else return undefined;
      }

      if (ModalDatePickerCount.GetCount() === 0) {
        var head = angular.element(document.querySelector('HEAD'));

        var style = angular.element('<style></style>');




        var styleText ='.modal-md-dp-input{\
          border : 0 !important;\
          width: 4.3rem;\
          font-weight: 700;\
          font-size: 14px;\
        }\
        .modal-md-dp-select-month{\
          position: relative;\
          cursor: pointer;\
          font-weight: 700;\
          font-size: 14px;\
        }\
        .modal-md-dp-select-month select {\
          position: absolute;\
          top: 0px;\
          left: 0px;\
          bottom: 0px;\
          right: 0px;\
          opacity: 0;\
          width: 100%;\
        }\
        .modal-md-dp-month-year-separator{\
          margin-left : 5px !important;\
        }\
        div.weekdayheader {\
          font-weight: 500;\
          text-align: left;\
          height: 1.6rem;\
          box-sizing: border-box;\
        }\
        div.weekdaylabel {\
          height: 1.6rem;\
          float: left;\
          padding: 0 0;\
          border-radius: 3rem;\
          font-size: 11px;\
          box-sizing: border-box;\
          text-align: center;\
          color: #a0a0a0;\
          width: 2.77rem;\
        }\
        .modal-md-dp-daybtn\
        .md-button.modal-md-dp-daybtn:hover {\
          background-color : {{mdThemeColors.primary[\'400\']}} !important;\
          color: #fff !important;\
        }\
        .md-button.modal-md-dp-daybtn.selected {\
          background-color : {{mdThemeColors.primary[\'500\']}} !important;\
          color: #fff !important;\
        }\
        .modal-md-dp-daybtn.today {\
          color: {{mdThemeColors.primary[\'500\']}};\
        }\
        .modal-md-dp-daybtn {\
          float: left;\
          line-height: 2rem;\
          min-width: 0;\
          border-radius: 2rem;\
          font-weight: 700;\
          min-height: inherit;\
          overflow: visible;\
          width: 2.5rem;\
          height: 2.5rem;\
          margin: 0 0.15rem 0 0.1rem;\
          font-size: 0.75rem;\
        }\
        .modal-md-dp-daybtn.firstday {\
          margin-left: 16.6rem;\
        }\
        .modal-md-dp-modal{\
          max-width:320px !important;\
        }\
        ';



        style.text(styleText);


        head.append(style);

        $compile(head.contents())($scope);
      } // end if (ModalDatePickerCount.GetCount() === 0)


      ModalDatePickerCount.Increment();

      $ctrl.$formatters.push(formatter);
      $ctrl.$parsers.push(parser);

      $scope.SelectedDate = $scope.ngModel;
      $scope.serial = Math.floor(Math.random() * 10000000000000000);

      $scope.mdThemeColors = mdThemeColors;

      $scope.$watch('ngModel', function(newValue) {
        $scope.SelectedDate = $scope.ngModel;
      }, true);

      $scope.$watch('SelectedDate', function(newValue) {
        if (newValue != null) {
          $scope.SelectedDateText = $filter('date')(newValue, 'M/d/yyyy');
        } else {
          $scope.SelectedDateText = null;
        }
      }, true);

      $scope.showModalDatePicker = function($event, startval) {
        $event.preventDefault();
        if ($scope.ngDisabled) return;

        var dlgCtrl = function($scope, $mdDialog, dlgOrientation, serial) {
          if (startval == null) startval = new Date();
          $scope.DialogSelectedDate = startval;
          $scope.originalOrientation = dlgOrientation;
          $scope.serial = serial;
          $scope.currentOrientation = 'portrait';
          $scope.originalOrientation = 'portrait';
          $scope.orientation = 'portrait';

          $scope.$watch(function() {
            return $mdMedia('(max-width: 655px)');
          }, function (isSmall) {
            if (isSmall) {
              // In small profile, will be portrait no matter what was originally specified
              $scope.currentOrientation = 'portrait';
            } else {
              $scope.currentOrientation = $scope.originalOrientation;
            }
          });

          $scope.NowClick = function($event) {
            $event.preventDefault();

            $timeout(function() {
              $scope.DialogSelectedDate = new Date();
            });
          };

          $scope.CancelClick = function($event) {
            $event.preventDefault();

            $mdDialog.cancel();
          };

          $scope.SaveClick = function($event) {
            $event.preventDefault();

            $mdDialog.hide($scope.DialogSelectedDate);
          };
      };

    var dlgOpts = {
      template: '<md-dialog class="modal-md-dp-modal" ng-attr-id="mddpdlg-{{serial}}">\
      <div class="popupDialogContent" style="overflow:hidden">\
      <modal-md-datepicker-calendar ng-model="DialogSelectedDate" submitclick="SaveClick" cancelclick="CancelClick"></modal-md-datepicker-calendar>\
      </div>\
      </md-dialog>',
      controller: dlgCtrl,
      targetEvent: $event,
      locals: {
        dlgOrientation: $scope.orientation,
        serial: $scope.serial
      },
      onComplete: function () {
        document.getElementById('mddpdlg-' + $scope.serial).focus();
      }
    };

    $mdDialog.show(dlgOpts).then(function(answer) {
      $scope.ngModel = answer;
    });
  }
}
}
});

ModalDatePicker.directive('modalMdDatepickerCalendar', ['$timeout', '$compile', 'mdThemeColors', '$mdMedia', function($timeout, $compile, mdThemeColors, $mdMedia) {
  return {
    restrict: 'E',
    replace: false,
    require: 'ngModel',
    transclude: true,
    scope: {
      ngModel: '=',
      orientation: '@',
      submitclick: '&',
      cancelclick: '&'
    },
    link: function($scope, $element, $attr, $ctrl) {
      $scope.serial = Math.floor(Math.random() * 10000000000000000);

      $scope.CalculateMonth = function() {
        var tempday = new Date($scope.selYear, $scope.selMonth, 1);
        var fday = tempday.getDay();
        var ldaynum = new Date($scope.selYear, $scope.selMonth + 1, 0).getDate();
        
        $scope.selFirstDayOfMonth = fday;
        $scope.selLastDateOfMonth = ldaynum;
        
        var selbtn = document.querySelector('.jmddp-' + $scope.serial + ' [Day="' + $scope.selDay + '"]');
        var btn = angular.element(selbtn);
        if (!btn.hasClass('md-button')) btn = btn.parent();

        btn.addClass('selected');
        
        if ($scope.selButton != null && $scope.selButton[0] != btn[0]) {
          $scope.selButton.removeClass('selected');
        }
        $scope.selButton = btn;

    // If the currently selected month and year match today's month and year, ensure that the matching day button has the 'today' class; otherwise, remove it.
    var todaybtn = angular.element(document.querySelector('.jmddp-' + $scope.serial + ' [Day="' + $scope.todaysDate + '"]'));
    if ($scope.todaysMonth == $scope.selMonth && $scope.todaysYear == $scope.selYear) {
      todaybtn.addClass('today');
    } else {
      todaybtn.removeClass('today');
    }
  };

  $scope.mdThemeColors = mdThemeColors;
  $scope.Today = new Date();
  $scope.todaysDate = $scope.Today.getDate();
  $scope.todaysMonth = $scope.Today.getMonth();
  $scope.todaysYear = $scope.Today.getFullYear();

  if ($scope.ngModel == null) $scope.ngModel = $scope.Today;
  $scope.selDate = $scope.ngModel;
  $scope.selMonth = $scope.selDate.getMonth();
  $scope.selDay = $scope.selDate.getDate();
  $scope.selYear = $scope.selDate.getFullYear();
  $scope.selButton = null;

  $scope.CalculateMonth();

  if ($scope.orientation == null) $scope.orientation = 'portrait';

  $scope.Months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  $scope.ShortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];


  $scope.DayClick = function($event, day) {
    $event.preventDefault();

    var btn = angular.element($event.srcElement);
    if (!btn.hasClass('md-button')) btn = btn.parent();

    btn.addClass('selected');

    if ($scope.selButton != null) {
      $scope.selButton.removeClass('selected');
    }
    $scope.selButton = btn;

    $scope.selDate = new Date($scope.selYear, $scope.selMonth, day);
    $scope.selYear = $scope.selDate.getFullYear();
    $scope.selMonth = $scope.selDate.getMonth();
    $scope.selDay = $scope.selDate.getDate();

    $scope.ngModel = $scope.selDate;

    $timeout(function() {
      $scope.submitclick()($event, $scope.selDate);
    });

  };

  $scope.NowClick = function($event) {
    $event.preventDefault();

    $scope.selDate = new Date();
    $scope.selYear = $scope.selDate.getFullYear();
    $scope.selMonth = $scope.selDate.getMonth();
    $scope.selDay = $scope.selDate.getDate();

    $scope.CalculateMonth($scope.selMonth);
  };

  $scope.OKClick = function($event) {
    $scope.submitclick()($event, $scope.selDate);
  };

  $scope.CancelClick = function($event) {
    $scope.cancelclick()($event);
  };

  $scope.$watch('ngModel', function(newValue) {
    if (newValue == null) return;
    $scope.selDate = newValue;
    $scope.selYear = $scope.selDate.getFullYear();
    $scope.selMonth = $scope.selDate.getMonth();
    $scope.selDay = $scope.selDate.getDate();

    $timeout(function() {
      $scope.CalculateMonth($scope.selMonth);
    });
  });

  $scope.$watch('selMonth', function(newValue) {
    $scope.selDate = new Date($scope.selYear, $scope.selMonth, $scope.selDay);
    $scope.CalculateMonth($scope.selMonth);
  });

  $scope.$watch('selYear', function(newValue) {
    $scope.selDate = new Date($scope.selYear, $scope.selMonth, $scope.selDay);

    $scope.CalculateMonth($scope.selMonth);
  });

  $scope.currentOrientation = ($mdMedia('(max-width: 655px)') ? 'portrait' : $scope.orientation);
  $scope.firstLead = ($scope.currentOrientation == 'landscape' ? 2.9 : 2.75);
  $scope.firstEdge = ($scope.currentOrientation == 'landscape' ? 0.45 : 0.1);

  $scope.$watch(function() {
    return $mdMedia('(max-width: 655px)');
  }, function (isSmall) {
    if (isSmall) {
        // In small profile, will be portrait no matter what was originally specified
        $scope.currentOrientation = 'portrait';
      } else {
        $scope.currentOrientation = $scope.orientation;
      }
      $scope.firstLead = ($scope.currentOrientation == 'landscape' ? 2.9 : 2.75);
      $scope.firstEdge = ($scope.currentOrientation == 'landscape' ? 0.45 : 0.1);
    });

  $scope.BackMonth = function($event) {
    $event.preventDefault();

    var newm = $scope.selMonth - 1;
    var newy = $scope.selYear;

    if (newm < 0) {
      newm += 12;
      newy--;
    }

    $scope.selMonth = newm;
    $scope.selYear = newy;

    $scope.CalculateMonth($scope.selMonth);
  };

  $scope.ForwardMonth = function($event) {
    $event.preventDefault();

    var newm = $scope.selMonth + 1;
    var newy = $scope.selYear;

    if (newm >= 12) {
      newm %= 12;
      newy++;
    }

    $scope.selMonth = newm;
    $scope.selYear = newy;

    $scope.CalculateMonth($scope.selMonth);
  };
      // 
      // <div class="datelabel">{{selDate | amDateFormat:\'ddd, MMM d\'}}</div>\
      var _BuildCalendar = function() {
        var caltext = '\
        <div layout="column" class="jmddp-'+ $scope.serial + '" >\
        <md-toolbar>\
        <div class="md-toolbar-tools1 md-padding" layout="column" >\
        <div class="md-subhead">{{selYear}}</div>\
        <div class="md-headline">{{selDate | date:\'EEE, MMM d\'}}</div>\
        </div>\
        </md-toolbar>\
        <div layout="row" layout-align="center center">\
        <md-button class="md-icon-button" ng-click="BackMonth($event)" aria-label="Back 1 Month"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></md-button>\
        <div flex layout="row" layout-align="center center">\
        <div class="modal-md-dp-month-year-separator" flex="45" layout="row" layout-align="end center">\
        <span class="modal-md-dp-select-month">{{Months[selMonth]}}\
        <select ng-model="selMonth" ng-options="(idx*1) as month for (idx, month) in Months"></select>\
        </span>\
        </div>\
        <div flex="5"></div>\
        <div flex="45">\
        <input type="number" ng-model="selYear" class=" modal-md-dp-input" />\
        </div>\
        </div>\
        <md-button class="md-icon-button right" ng-click="ForwardMonth($event)" aria-label="Forward 1 Month"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></md-button>\
        </div>\
        \
        <div>\
        <div class="weekdayheader">\
        <div class="weekdaylabel">D</div>\
        <div class="weekdaylabel">L</div>\
        <div class="weekdaylabel">M</div>\
        <div class="weekdaylabel">M</div>\
        <div class="weekdaylabel">J</div>\
        <div class="weekdaylabel">V</div>\
        <div class="weekdaylabel">S</div>\
        </div>\
        </div>\
        \
        <div class="monthpanel">\
        <md-button class="modal-md-dp-daybtn firstday" ng-click="DayClick($event,1)" ng-style="{\'margin-left\': (selFirstDayOfMonth * firstLead + firstEdge) + \'rem\'}" Day="1">1</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,2)" Day="2">2</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,3)" Day="3">3</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,4)" Day="4">4</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,5)" Day="5">5</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,6)" Day="6">6</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,7)" Day="7">7</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,8)" Day="8">8</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,9)" Day="9">9</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,10)" Day="10">10</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,11)" Day="11">11</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,12)" Day="12">12</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,13)" Day="13">13</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,14)" Day="14">14</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,15)" Day="15">15</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,16)" Day="16">16</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,17)" Day="17">17</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,18)" Day="18">18</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,19)" Day="19">19</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,20)" Day="20">20</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,21)" Day="21">21</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,22)" Day="22">22</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,23)" Day="23">23</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,24)" Day="24">24</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,25)" Day="25">25</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,26)" Day="26">26</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,27)" Day="27">27</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,28)" Day="28">28</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,29)" ng-show="selLastDateOfMonth >= 29" Day="29">29</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,30)" ng-show="selLastDateOfMonth >= 30" Day="30">30</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,31)" ng-show="selLastDateOfMonth >= 31" Day="31">31</md-button>\
        </div>\
        </div>\
        ';


        var newbody = angular.element(caltext);

        $compile(newbody)($scope);

        $element.empty().append(newbody);
      };

      _BuildCalendar();
    }
  };
}]);
