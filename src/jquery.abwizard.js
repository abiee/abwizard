/*
 * jquery.abwizard
 * https://github.com/abiee/abwizard
 *
 * Copyright (c) 2013 Abiee Alejandro Echamea Márquez
 * Licensed under the MIT license.
 */

(function($) {

  $.fn.ABWizard = function(options) {

    // default options
    var defaults = {
      stepNavigation: "#abwizard-navigation",
      stepOnLoad: undefined,
      beforeAjaxLoad: undefined,
      afterAjaxLoad: undefined,
      onAjaxError: undefined,
      beforeShowStep: undefined,
      onShowStep: undefined,
      onHideStep: undefined
    };
    options = $.extend(defaults, options);

    function showStep(step, widget) {
      var stepToShow = $("#" + step);
      var stepToHide = $("#" + widget.currentStep);
      var result;

      if(stepToShow.length === 0) {
        return; // if step does not exist, ignore
      }

      if($.isFunction(options.beforeShowStep)) {
        result = options.beforeShowStep(this, stepToShow, stepToHide);
        if(result === false) {
            return;
        }
      }

      if(stepToShow.hasClass("step-ajax") && (stepToShow.data("reload") || !stepToShow.data("loaded"))) {
        if($.isFunction(options.beforeAjaxLoad)) {
          options.beforeAjaxLoad(this, stepToShow);
        }
        stepToShow.load(stepToShow.data("href"), function(response, status) {
          if(status === "error") {
            if($.isFunction(options.onAjaxError)) {
              options.onAjaxError(this, stepToShow);
            }
          } else {
            widget._setup_buttons(stepToShow);
            stepToShow.data("loaded", "true");
            if($.isFunction(options.afterAjaxLoad)) {
              options.afterAjaxLoad(this, stepToShow);
            }
          }
        });
      }

      if($.isFunction(options.onHideStep)) {
        result = options.onHideStep(this, stepToShow);
        if(result === false) {
          return;
        }
      }
      stepToHide.hide();
      stepToShow.show();
      widget.currentStep = step;

      if(typeof widget.stepNavigation !== 'undefined') {
        widget.stepNavigation.find("." + stepToHide.attr("id")).removeClass("active");
        widget.stepNavigation.find("." + stepToShow.attr("id")).addClass("active");
      }

      if($.isFunction(options.onShowStep)) {
        options.onShowStep(this, stepToShow);
      }
    }

    function setup_navigation(element, widget) {
      if(typeof element !== 'undefined') {
        element.find("a.step-link").bind("click", function(event) {
          event.preventDefault();
          var step = $(event.currentTarget).attr("href").replace(/#/g, '');
          showStep(step, widget);
        });
      }
      return element;
    }

    var widget = {
      _init: function(container, options) {
        this.container = $(container);
        this.container.find(".step").hide();
        this.stepNavigation = setup_navigation($(options.stepNavigation), this);
        this._setup_buttons();
        this.currentStep = "";
        this.goto(options.stepOnLoad);
      },
      _setup_buttons: function(element) {
        var self = this;
        var containerElement = this.container;
        if(typeof element !== 'undefined') {
          containerElement = element;
        }

        var buttons = containerElement.find(".wizard-action-button");
        $.each(buttons, function(index, button) {
          $(button).bind("click", function(event) {
            var stepToGo = $(event.currentTarget).data("step");
            if(typeof stepToGo === 'undefined') {
              self.first();
            } else {
              self.goto(stepToGo);
            }
          });
        });
        

        buttons = containerElement.find(".wizard-next-button");
        $.each(buttons, function(index, button) {
          $(button).bind("click", function() {
            self.next();
          });
        });

        buttons = containerElement.find(".wizard-previous-button");
        $.each(buttons, function(index, button) {
          $(button).bind("click", function() {
            self.previous();
          });
        });
      },
      first: function() {
        var firstStep = this.container.find(".step:first");
        showStep(firstStep.attr("id"), this);
      },
      last: function() {
        var lastStep = this.container.find(".step:last");
        showStep(lastStep.attr("id"), this);
      },
      next: function() {
        var nextStep = this.container.find("#" + this.currentStep).next();
        if(nextStep.hasClass("step")) {
          showStep(nextStep.attr("id"), this);
        }
      },
      previous: function() {
        var prevStep = this.container.find("#" + this.currentStep).prev();
        if(prevStep.hasClass("step")) {
          showStep(prevStep.attr("id"), this);
        }
      },
      goto: function(step) {
        if(typeof step === 'undefined') {
          this.first();
        } else {
          if(this.currentStep === step) {
            return;
          }
          showStep(step, this);
        }
      }
    };

    widget._init(this, options);
    return widget;
  };

}(jQuery));
