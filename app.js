// handles budget data
// budget controller
var budgetController = (function() {
  // Some Code ...
})();

// UI controller
var UIController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn"
  };
  // Some code...
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // will be inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      };
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// bridge between uiController and budgetController
// global app controller
var controller = (function(budgetCtrl, UICtrl) {
  // some code...
  var DOM = UICtrl.getDOMStrings();
  var ctrlAddItem = function() {
    // get field input data
    var input = UICtrl.getInput();

    console.log(input);

    // add item to the budget controller
    // add item to the UI
    // calculate the budget
    // display the budget on the UI
  };

  document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
//
