/*jshint browsers:true, forin: true, laxbreak: true */
/*global test: true, start: true, stop: true, module: true, ok: true, equal: true, BrowserID:true */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
(function() {
  "use strict";

  var controller,
      el = $("body"),
      bid = BrowserID,
      testHelpers = bid.TestHelpers,
      register = testHelpers.register,
      controller;

  function createController(options) {
    controller = bid.Modules.SetPassword.create();
    controller.start(options);
  }

  module("controllers/set_password", {
    setup: function() {
      testHelpers.setup();
      createController();
    },

    teardown: function() {
      controller.destroy();
      testHelpers.teardown();
    }
  });


  test("create with no options - show template, user must verify email", function() {
    ok($("#set_password").length, "set_password template added");
    equal($("#verify_user").length, 1, "correct button shown");
  });

  test("create with password_reset option - show template, show reset password button", function() {
    controller.destroy();
    createController({ password_reset: true });
    ok($("#set_password").length, "set_password template added");
    equal($("#password_reset").length, 1, "correct button shown");
  });

  asyncTest("submit with good password/vpassword - password_set message raised", function() {
    $("#password").val("password");
    $("#vpassword").val("password");

    var password;
    register("password_set", function(msg, info) {
      password = info.password;
    });

    controller.submit(function() {
      equal(password, "password", "password_set message raised with correct password");
      start();
    });
  });

  asyncTest("cancel - cancel_state message raised", function() {
    register("cancel_state", function(msg, info) {
      ok(true, "state cancelled");
      start();
    });

    $("#cancel").click();
  });
}());
