// handles budget data
var budgetController = (function() {
  var x = 23;
  var add = function(a) {
    return x + a;
  };

  var minus = function(a) {
    return 10 - a;
  };

  return {
    publicTest: function(b) {
      return add(b);
    }
  };
})();

var UIController = (function() {
  // Some code...
})();

// bridge between uiController and budgetController
var controller = (function(budgetCtrl, UICtrl) {
  var z = budgetCtrl.publicTest(3);
  return {
    another: function() {
      console.log(`ayo, ${z}`);
    }
  };
})(budgetController, UIController);
