// handles budget data
// budget controller
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    // add new expense/Income
    // ID = last ID+1

    addItem: function(type, des, val) {
      var newItem, ID;
      // ID = 0;

      // craete new id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // create new item based on inc or exp type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }
      // push it to our data structure
      data.allItems[type].push(newItem);

      // return the new item/element
      return newItem;
    },
    deleteItem: function(type, id) {
      var ids, index;
      //  id = 3
      var ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      // calculate total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate the budget = income - expenses
      if (data.totals.inc >= 0) {
        data.budget = data.totals.inc - data.totals.exp;
        // calculate percenrage of income that we spent
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testig: function() {
      console.log(data);
    }
  };
})();

/////////////////////////////////// UI controller
var UIController = (function() {
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercentageLabel: ".item__percentage"
  };

  var formatNumbers = function(num, type) {
    // + / - before number
    // exactly 2 decimal places
    // comma sepperated values(1000s)

    // eg. 234567.9087 => +23,456,7.91

    var numSplit, int, dec;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3);
    }
    dec = numSplit[1];

    return `${type === "exp" ? (sign = "-") : (sign = "+")} $${int}.${dec}`;
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMStrings.inputType).value, // will be inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value) // coverts to float/decimal
      };
    },
    addListItem: function(obj, type) {
      var html, newHtml, element;
      // create HTML string with placeholder text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html = `<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      }

      // Replace the placeholder text with actual data (data recived from obj)
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumbers(obj.value, type));

      // Insert HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorId) {
      // removes from UI
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el); // removes chled weird sytax
    },

    clearFields: function() {
      var fields, fieldsArray;

      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ", " + DOMStrings.inputValue
      );

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArray[0].focus();
    },
    displayBudget: function(obj) {
      var type;
      obj.budget >= 0 ? (type = "inc") : (type = "exp");

      document.querySelector(
        DOMStrings.budgetLabel
      ).textContent = formatNumbers(obj.budget, type);
      document.querySelector(
        DOMStrings.incomeLabel
      ).textContent = formatNumbers(obj.totalInc, "inc");
      document.querySelector(
        DOMStrings.expensesLabel
      ).textContent = formatNumbers(obj.totalExp, "exp");

      if (obj.budget > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = `${
          obj.percentage
        }%`;
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "--";
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(
        DOMStrings.expensesPercentageLabel
      );

      var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index) {
        // do stuff
        if (percentages[index] > 0) {
          current.textContent = `${percentages[index]}%`;
        } else {
          current.textContent = "--";
        }
      });
    },

    getDOMStrings: function() {
      return DOMStrings;
    }
  };
})();

// bridge between uiController and budgetController

//////////////////////////////// GLOBAL app controller
var controller = (function(budgetCtrl, UICtrl) {
  // some code...
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    // calculate the budget
    budgetController.calculateBudget();

    // Return the budget
    var budget = budgetController.getBudget();

    // display the budget on the UI
    UICtrl.displayBudget(budget); //////////////////////////////////////////////////
  };

  var updatePercentages = function() {
    // calc percenrtages
    budgetCtrl.calculatePercentages();

    // read them from budget controller
    var percentages = budgetCtrl.getPercentages(); ///////////////////////

    // updatv UI with new percentages
    UICtrl.displayPercentages(percentages);
  };

  var ctrlAddItem = function() {
    var input, mewItem;

    // get field input data
    input = UICtrl.getInput();

    if (input.description != "" && !isNaN(input.value) && input.value > 0) {
      // add item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // add item to the UI
      UICtrl.addListItem(newItem, input.type);

      // clear fields
      UICtrl.clearFields();

      // calc and update budget
      updateBudget();

      // update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // inc-0
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // delete item from data structure
      budgetCtrl.deleteItem(type, ID);

      // delete item fro UI
      UICtrl.deleteListItem(itemID);

      // update and show new budget
      updateBudget();

      // update percentages
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log("APP has started");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
      console.log("eventLiteners have been setup");
    }
  };
})(budgetController, UIController);

controller.init();
