(function($) {

  module('jquery.ABWizard');

  test('widget public interface', function() {
    expect(5);
    var widget = $("#abwizard").ABWizard();

    strictEqual($.isFunction(widget.first), true, 'first method exists');
    strictEqual($.isFunction(widget.last), true, 'last method exist');
    strictEqual($.isFunction(widget.next), true, 'next method exist');
    strictEqual($.isFunction(widget.previous), true, 'previous method exist');
    strictEqual($.isFunction(widget.goto), true, 'goto method exist');
  });

  test('widget dom initialization', function() {
    expect(10);
    $("#abwizard").ABWizard();
    var steps = $("#abwizard").find('.step');

    // only step one should be showed
    strictEqual($(steps[0]).is(':visible'), true, 'step 1 is visible');
    strictEqual($(steps[1]).is(':visible'), false, 'step 2 is not visible');
    strictEqual($(steps[2]).is(':visible'), false, 'step 3 is not visible');
    strictEqual($(steps[3]).is(':visible'), false, 'step 4 is not visible');
    strictEqual($(steps[4]).is(':visible'), false, 'step 5 is not visible');

    // only nav indicator for step one should be active
    strictEqual($("#abwizard-navigation").find(".one").hasClass("active"), true, 'nav one is active');
    strictEqual($("#abwizard-navigation").find(".two").hasClass("active"), false, 'nav two is not active');
    strictEqual($("#abwizard-navigation").find(".three").hasClass("active"), false, false, 'nav three is not active');
    strictEqual($("#abwizard-navigation").find(".four").hasClass("active"), false, false, 'nav four is not active');
    strictEqual($("#abwizard-navigation").find(".five").hasClass("active"), false, false, 'nav five is not active');
  });

  test('goto api call', function() {
    expect(5);
    var widget = $("#abwizard").ABWizard();
    var steps = $("#abwizard").find('.step');

    // initial state
    strictEqual($(steps[0]).is(':visible'), true, 'after load step 1 is visible');
    strictEqual($(steps[1]).is(':visible'), false, 'after load step 2 is not visible');

    // after call goto
    widget.goto('three');
    strictEqual($(steps[0]).is(':visible'), false, 'on goto step three step 1 is not visible');
    strictEqual($(steps[2]).is(':visible'), true, 'on goto step three step 3 is visible');

    // if goto inexistent step, do nothing
    widget.goto('inexistent');
    strictEqual($(steps[2]).is(':visible'), true, 'on goto inexistent step step three is visible');
  });

  test('next api call', function() {
    expect(6);
    var widget = $("#abwizard").ABWizard();
    var steps = $("#abwizard").find('.step');

    // initial state
    strictEqual($(steps[0]).is(':visible'), true, 'step 1 is visible');
    strictEqual($(steps[1]).is(':visible'), false, 'step 2 is not visible');

    // call next normally
    widget.next();

    // after call next
    strictEqual($(steps[0]).is(':visible'), false, 'step 1 is not visible');
    strictEqual($(steps[1]).is(':visible'), true, 'step 2 is visible');

    // call next on last element
    widget.goto("five");
    strictEqual($(steps[4]).is(':visible'), true, 'step 5 is visible');
    widget.next();
    strictEqual($(steps[4]).is(':visible'), true, 'step 5 is still visible');
  });

  test('previous api call', function() {
    expect(6);
    var widget = $("#abwizard").ABWizard();
    var steps = $("#abwizard").find('.step');

    // initial state
    widget.goto("five");
    strictEqual($(steps[4]).is(':visible'), true, 'step 5 is visible');
    strictEqual($(steps[3]).is(':visible'), false, 'step 5 is not visible');

    // call previous normally
    widget.previous();

    // after call previous
    strictEqual($(steps[4]).is(':visible'), false, 'step 5 is not visible');
    strictEqual($(steps[3]).is(':visible'), true, 'step 4 is visible');

    // call previous on first strp
    widget.goto("one");
    strictEqual($(steps[0]).is(':visible'), true, 'step 1 is visible');
    widget.previous();
    strictEqual($(steps[0]).is(':visible'), true, 'step 1 is still visible');
  });

  test('first and last api call', function() {
    expect(6);
    var widget = $("#abwizard").ABWizard();
    var steps = $("#abwizard").find('.step');

    // initial state
    widget.goto("three");
    strictEqual($(steps[2]).is(':visible'), true, 'step 3 is visible');
    strictEqual($(steps[0]).is(':visible'), false, 'step 1 is not visible');

    // goto first
    widget.first();

    // after call first
    strictEqual($(steps[2]).is(':visible'), false, 'step 3 is not visible');
    strictEqual($(steps[0]).is(':visible'), true, 'step 1 is visible');

    // goto last
    widget.last();

    // after call last
    strictEqual($(steps[4]).is(':visible'), true, 'step 5 is visible');
    strictEqual($(steps[0]).is(':visible'), false, 'step 1 is not visible');
  });

  test('step navigation active class', function() {
    expect(6);
    var widget = $("#abwizard").ABWizard();
    var nav = $("#abwizard-navigation");

    function isActive(className) {
      return nav.find("." + className).hasClass("active");
    }

    // initially we're on step 1
    strictEqual(isActive("one"), true, 'nav at initialization');

    // move to step 2
    widget.goto("two");
    strictEqual(isActive("two"), true, 'update nav on goto call');

    // move next
    widget.next();
    strictEqual(isActive("three"), true, 'update nav on next call');

    // move next
    widget.previous();
    strictEqual(isActive("two"), true, 'update nav on previous call');

    // move last
    widget.last();
    strictEqual(isActive("five"), true, 'update nav on last call');

    // move last
    widget.first();
    strictEqual(isActive("one"), true, 'update nav on first call');
  });

}(jQuery));
