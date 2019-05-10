// handles budget data
// budget controller
var budgetController = (function() {
  // Some Code ...
})();

// UI controller
var UIController = (function() {
  // Some code...
})();

// bridge between uiController and budgetController
// global app controller
var controller = (function(budgetCtrl, UICtrl) {
  // some code...

  var ctrlAddItem = function() {
    // get field input data
    // add item to the budget controller
    // add item to the UI
    // calculate the budget
    // display the budget on the UI
    console.log("lolo");
  };

  document.querySelector(".add__btn").addEventListener("click", ctrlAddItem);
  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
//
