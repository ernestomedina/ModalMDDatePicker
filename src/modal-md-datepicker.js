/*!
* @(#)Modal MD Datepicker.js
* @author Diego Guevara - github.com/diegoguevara
* Created 2016.04
* Updated 2016.05
* version 1.0.7
*/


var mdThemeColors = angular.module('mdThemeColors', ['ngMaterial']).config(['$provide', '$mdThemingProvider', function ($provide, $mdThemingProvider) {
  var colorStore = {};
  Object.keys($mdThemingProvider._PALETTES).forEach(
    function (palleteName) {
      var pallete = $mdThemingProvider._PALETTES[palleteName];
      var colors = [];
      colorStore[palleteName] = colors;
      Object.keys(pallete).forEach(function (colorName) {
        if (/#[0-9A-Fa-f]{6}|0-9A-Fa-f]{8}\b/.exec(pallete[colorName])) {
          colors[colorName] = pallete[colorName];
        }
      });
    });


  $provide.factory('mdThemeColors', [
    function () {
      var service = {};

      var getColorFactory = function (intent) {
        return function () {
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
ModalDatePicker.factory('ModalDatePickerCount', function () {
  var instanceCount = 0;

  var _Increment = function () {
    instanceCount++;
  }

  var _GetCount = function () {
    return instanceCount;
  }

  return {
    GetCount: _GetCount,
    Increment: _Increment
  }
});

ModalDatePicker.directive('modalMdDatepicker', function ($timeout, $filter, $mdDialog, $compile, mdThemeColors, $mdMedia, ModalDatePickerCount) {
  return {
    restrict: 'E',
    replace: false,
    require: 'ngModel',
    scope: {
      ngModel: '=',
      ngDisabled: '=',
      placeholder: '@',
      orientation: '@',
      dateFormat: '@',
      minDate: '@',
      maxDate: '@'
    },
    template: '<input type="text" ng-attr-id="modal-md-dp-directive-{{serial}}" ng-model="SelectedDateText" ng-click="showModalDatePicker($event, SelectedDate)" />',
    link: function ($scope, $element, $attr, $ctrl) {
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




        var styleText = '.modal-md-dp-input{\
          border : 0 !important;\
          width: 4.3rem !important;\
          font-weight: 700 !important;\
          font-size: 14px !important;\
        }\
        .modal-md-dp-select-month{\
          position: relative !important;\
          cursor: pointer !important;\
          font-weight: 700 !important;\
          font-size: 14px !important;\
        }\
        .modal-md-dp-select-month select {\
          position: absolute !important;\
          top: 0px !important;\
          left: 0px !important;\
          bottom: 0px !important;\
          right: 0px !important;\
          opacity: 0 !important;\
          width: 100% !important;\
        }\
        .modal-md-dp-month-year-separator{\
          margin-left : 5px !important;\
        }\
        div.weekdayheader {\
          font-weight: 500 !important;\
          text-align: left !important;\
          height: 1.6rem !important;\
          box-sizing: border-box !important;\
        }\
        div.weekdaylabel {\
          height: 1.6rem !important;\
          float: left !important;\
          padding: 0 0 !important;\
          border-radius: 3rem !important;\
          font-size: 11px !important;\
          box-sizing: border-box !important;\
          text-align: center !important;\
          color: #a0a0a0 ;\
          width: 2.77rem !important;\
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
          color: {{mdThemeColors.primary[\'500\']}} ;\
        }\
        .modal-md-dp-daybtn.disabled {\
          color: #eee !important;\
        }\
        .modal-md-dp-daybtn {\
          float: left ;\
          line-height: 2rem ;\
          min-width: 0 ;\
          border-radius: 2rem ;\
          font-weight: 700 ;\
          min-height: inherit ;\
          overflow: visible ;\
          width: 2.5rem ;\
          height: 2.5rem ;\
          margin: 0 0.15rem 0 0.1rem ;\
          font-size: 0.75rem ;\
        }\
        .modal-md-dp-daybtn.firstday {\
          margin-left: 16.6rem ;\
        }\
        .modal-md-dp-modal{\
          max-width:320px !important;\
        }\
        div.masterdatepicker {\
          height: 392px;\
        }\
        div.monthpanel {\
          position: relative;\
          font-size: 1rem;\
          margin-top: -0.1rem;\
          box-sizing: border-box;\
          top: 7px;\
          height: 16.2rem;\
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

      $scope.$watch('ngModel', function (newValue) {
        $scope.SelectedDate = $scope.ngModel;
      }, true);

      $scope.$watch('SelectedDate', function (newValue) {
        if (newValue != null) {
          //$scope.SelectedDateText = $filter('date')(newValue, 'M/d/yyyy');
          if( !$attr.dateFormat ){
            $attr.dateFormat = 'M/d/yyyy';
          }
          $scope.SelectedDateText = $filter('date')(newValue, $attr.dateFormat);
        } else {
          $scope.SelectedDateText = null;
        }
      }, true);

      $scope.showModalDatePicker = function ($event, startval) {
        $event.preventDefault();
        if ($scope.ngDisabled) return;

        var dlgCtrl = function ($scope, $mdDialog, dlgOrientation, serial) {
          if (startval == null) startval = new Date();
          $scope.DialogSelectedDate = startval;
          $scope.originalOrientation = dlgOrientation;
          $scope.serial = serial;
          $scope.minDate = $attr.minDate;
          $scope.maxDate = $attr.maxDate;
          
          $scope.NowClick = function ($event) {
            $event.preventDefault();

            $timeout(function () {
              $scope.DialogSelectedDate = new Date();
            });
          };

          $scope.CancelClick = function ($event) {
            $event.preventDefault();

            $mdDialog.cancel();
          };

          $scope.SaveClick = function ($event) {
            $event.preventDefault();

            $mdDialog.hide($scope.DialogSelectedDate);
          };
        };

        var dlgOpts = {
          template: '<md-dialog class="modal-md-dp-modal" ng-attr-id="mddpdlg-{{serial}}">\
      <div class="popupDialogContent" style="overflow:hidden">\
      <modal-md-datepicker-calendar ng-model="DialogSelectedDate" submitclick="SaveClick" cancelclick="CancelClick" min-date="{{minDate}}" max-date="{{maxDate}}"></modal-md-datepicker-calendar>\
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

        $mdDialog.show(dlgOpts).then(function (answer) {
          $scope.ngModel = answer;
        });
      }
    }
  }
});

ModalDatePicker.directive('modalMdDatepickerCalendar', ['$timeout', '$compile', 'mdThemeColors', '$mdMedia', function ($timeout, $compile, mdThemeColors, $mdMedia) {
  return {
    restrict: 'E',
    replace: false,
    require: 'ngModel',
    transclude: true,
    scope: {
      ngModel: '=',
      orientation: '@',
      submitclick: '&',
      cancelclick: '&',
      minDate : '@',
      maxDate : '@'
    },
    link: function ($scope, $element, $attr, $ctrl) {
      $scope.serial = Math.floor(Math.random() * 10000000000000000);

      $scope.CalculateMonth = function () {
        var tempday = new Date($scope.selYear, $scope.selMonth, 1);
        var fday = tempday.getDay();
        var ldaynum = new Date($scope.selYear, $scope.selMonth + 1, 0).getDate();
        
        $scope.selFirstDayOfMonth = fday;
        $scope.selLastDateOfMonth = ldaynum;

        var selbtn = document.querySelector('.jmddp-' + $scope.serial + ' [Day="' + $scope.selDay + '"]');
        var btn = angular.element(selbtn);
        if (!btn.hasClass('md-button')) btn = btn.parent();

        btn.addClass('selected');
        btn.addClass('disabled');
        

        if ($scope.selButton != null && $scope.selButton[0] != btn[0]) {
          $scope.selButton.removeClass('selected');
        }
        $scope.selButton = btn;
        
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
      $scope.selDate = new Date($scope.ngModel);
      $scope.selMonth = $scope.selDate.getMonth();
      $scope.selDay = $scope.selDate.getDate();
      $scope.selYear = $scope.selDate.getFullYear();
      $scope.selButton = null;

      $scope.CalculateMonth();
      
      $scope.Months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      $scope.ShortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      $scope.DayClick = function ($event, day) {
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

        $timeout(function () {
          $scope.submitclick()($event, $scope.selDate);
        });

      };
      
      $scope.dayIsDisabled = function( day ){
        
        var sdate = new Date($scope.selYear, $scope.selMonth, day);
        
        
        if( $attr.minDate ){
          $attr.minDate = $attr.minDate.replace(/['"]+/g, '')
          var min_date = new Date($attr.minDate);          
          if( sdate < min_date ){
            return true;
          }
        }
        
        
        if( $attr.maxDate ){
          $attr.maxDate = $attr.maxDate.replace(/['"]+/g, '')
          var max_date = new Date($attr.maxDate);
          if( sdate > max_date ){
            return true;
          }
        }
        
        return false
      }

      $scope.NowClick = function ($event) {
        $event.preventDefault();

        $scope.selDate = new Date();
        $scope.selYear = $scope.selDate.getFullYear();
        $scope.selMonth = $scope.selDate.getMonth();
        $scope.selDay = $scope.selDate.getDate();

        $scope.CalculateMonth($scope.selMonth);
      };

      $scope.OKClick = function ($event) {
        $scope.submitclick()($event, $scope.selDate);
      };

      $scope.CancelClick = function ($event) {
        $scope.cancelclick()($event);
      };

      $scope.$watch('ngModel', function (newValue) {
        if (newValue == null) return;
        $scope.selDate = new Date(newValue);
        $scope.selYear = $scope.selDate.getFullYear();
        $scope.selMonth = $scope.selDate.getMonth();
        $scope.selDay = $scope.selDate.getDate();

        $timeout(function () {
          $scope.CalculateMonth($scope.selMonth);
        });
      });

      $scope.$watch('selMonth', function (newValue) {
        $scope.selDate = new Date($scope.selYear, $scope.selMonth, $scope.selDay);
        $scope.CalculateMonth($scope.selMonth);
      });

      $scope.$watch('selYear', function (newValue) {
        $scope.selDate = new Date($scope.selYear, $scope.selMonth, $scope.selDay);

        $scope.CalculateMonth($scope.selMonth);
      });

      
      $scope.$watch(function () {
        return $mdMedia('(max-width: 655px)');
      }, function (isSmall) {
      
        $scope.firstLead = ($scope.currentOrientation == 'landscape' ? 2.9 : 2.75);
        $scope.firstEdge = ($scope.currentOrientation == 'landscape' ? 0.45 : 0.1);
      });

      $scope.BackMonth = function ($event) {
        $event.preventDefault();
        

        var newm = $scope.selMonth - 1;
        var newy = $scope.selYear;

        if (newm < 0) {
          newm += 12;
          newy--;
        }
        
        if( $attr.minDate ){
          $attr.minDate = $attr.minDate.replace(/['"]+/g, '')
          var min_date = new Date($attr.minDate);
          
          min_date = new Date(min_date.getFullYear(), min_date.getMonth(), 1)
          var nuewd = new Date( newy, newm );
          if( nuewd < min_date ){
            return false;
          }
        }
        
        $scope.selMonth = newm;
        $scope.selYear = newy;

        $scope.CalculateMonth($scope.selMonth);
      };

      $scope.ForwardMonth = function ($event) {
        $event.preventDefault();

        var newm = $scope.selMonth + 1;
        var newy = $scope.selYear;

        if (newm >= 12) {
          newm %= 12;
          newy++;
        }
        if( $attr.maxDate ){
          $attr.maxDate = $attr.maxDate.replace(/['"]+/g, '')
          var max_date = new Date($attr.maxDate);
          
          max_date = new Date(max_date.getFullYear(), max_date.getMonth(), 1)
          var nuewd = new Date( newy, newm );
          if( nuewd > max_date ){
            return false;
          }
        }
        
        $scope.selMonth = newm;
        $scope.selYear = newy;

        $scope.CalculateMonth($scope.selMonth);
      };
      // 
      // <div class="datelabel">{{selDate | amDateFormat:\'ddd, MMM d\'}}</div>\
      var _BuildCalendar = function () {
        var caltext = '\
        <div layout="column" class="masterdatepicker jmddp-'+ $scope.serial + '" >\
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
        <md-button class="modal-md-dp-daybtn firstday" ng-click="DayClick($event,1)" ng-style="{\'margin-left\': (selFirstDayOfMonth * firstLead + firstEdge) + \'rem\'}" Day="1" ng-disabled="dayIsDisabled(1)">1</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,2)" Day="2" ng-disabled="dayIsDisabled(2)">2</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,3)" Day="3" ng-disabled="dayIsDisabled(3)">3</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,4)" Day="4" ng-disabled="dayIsDisabled(4)">4</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,5)" Day="5" ng-disabled="dayIsDisabled(5)">5</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,6)" Day="6" ng-disabled="dayIsDisabled(6)">6</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,7)" Day="7" ng-disabled="dayIsDisabled(7)">7</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,8)" Day="8" ng-disabled="dayIsDisabled(8)">8</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,9)" Day="9" ng-disabled="dayIsDisabled(9)">9</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,10)" Day="10" ng-disabled="dayIsDisabled(10)">10</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,11)" Day="11" ng-disabled="dayIsDisabled(11)">11</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,12)" Day="12" ng-disabled="dayIsDisabled(12)">12</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,13)" Day="13" ng-disabled="dayIsDisabled(13)">13</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,14)" Day="14" ng-disabled="dayIsDisabled(14)">14</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,15)" Day="15" ng-disabled="dayIsDisabled(15)">15</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,16)" Day="16" ng-disabled="dayIsDisabled(16)">16</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,17)" Day="17" ng-disabled="dayIsDisabled(17)">17</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,18)" Day="18" ng-disabled="dayIsDisabled(18)">18</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,19)" Day="19" ng-disabled="dayIsDisabled(19)">19</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,20)" Day="20" ng-disabled="dayIsDisabled(20)">20</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,21)" Day="21" ng-disabled="dayIsDisabled(21)">21</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,22)" Day="22" ng-disabled="dayIsDisabled(22)">22</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,23)" Day="23" ng-disabled="dayIsDisabled(23)">23</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,24)" Day="24" ng-disabled="dayIsDisabled(24)">24</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,25)" Day="25" ng-disabled="dayIsDisabled(25)">25</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,26)" Day="26" ng-disabled="dayIsDisabled(26)">26</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,27)" Day="27" ng-disabled="dayIsDisabled(27)">27</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,28)" Day="28" ng-disabled="dayIsDisabled(28)">28</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,29)" ng-show="selLastDateOfMonth >= 29" Day="29" ng-disabled="dayIsDisabled(29)">29</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,30)" ng-show="selLastDateOfMonth >= 30" Day="30" ng-disabled="dayIsDisabled(30)">30</md-button>\
        <md-button class="modal-md-dp-daybtn" ng-click="DayClick($event,31)" ng-show="selLastDateOfMonth >= 31" Day="31" ng-disabled="dayIsDisabled(31)">31</md-button>\
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

