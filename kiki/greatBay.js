var mysql = require("mysql");
const inquirer = require("inquirer");
const password = require("./password.js");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: password,
  database: "great_bayDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();
});

const postQ = [
  {
    name: "item",
    type: "input",
    message: "What is the item you would like to sell?",
  },
  {
    name: "conditional",
    type: "list",
    message: "What is the item's condition?",
    choices: ["New", "Used", "Refurblished"],
  },
  {
    name: "category",
    type: "type",
    message: "What is the item's category?",
  },
  {
    name: "startingBid",
    type: "input",
    message: "What would you like your starting bid to be?",
  },
];

function start() {
  inquirer
    .prompt({
      type: "list",
      message: "Would you like POST or BID?",
      name: "choice",
      choices: ["POST AN ITEM", "BID ON AN ITEM", "EXIT"],
    })
    .then(function (answer) {
      console.log(answer);
      switch (answer.choice) {
        case "POST AN ITEM":
          postItem();
          break;

        case "BID ON AN ITEM":
          bidItem();
          break;

        default:
          exit();
          break;
      }
    });
}

function postItem() {
  inquirer.prompt(postQ).then(function (response) {
    console.log(response);
    connection.query(
      "INSERT INTO post SET ?",
      {
        item: response.item,
        conditional: response.conditional,
        category: response.category,
        startingBid: response.startingBid,
      },
      function (err, res) {
        if (err) throw err;
        console.log("Thank you for your POST!\n");
        start();
      }
    );
  });
}

function bidItem() {
  connection.query("SELECT * FROM post", function (err, res) {
    if (err) throw err;
    console.table(res); //need
    inquirer
      .prompt({
        type: "type",
        message: "Choose an id from a list.",
        name: "postId",
      })
      .then(function (res) {
        connection.query(
          "SELECT * FROM post WHERE id=?",
          [res.postId],
          function (err, res) {
            if (err) throw err;
            console.table(res); //need
            var item = res;
            bid(item);
          }
        );
      });
  });
}

function bid(item) {
  inquirer
    .prompt({
      type: "type",
      message: "How much would you like to bid?",
      name: "bid",
    })
    .then(function (resbid) {
      if (resbid.bid >= item[0].startingBid) {
        connection.query(
          "DELETE FROM post WHERE ?",
          {
            id: item[0].id,
          },
          function (err, res) {
            if (err) throw err;
            console.log("Bid placed successfully!\n");
            start();
          }
        );
      } else {
        console.log("Your bid was too low.");
        inquirer
          .prompt({
            type: "list",
            message: "Would you like to try again?",
            name: "tryBid",
            choices: ["YES", "NO"],
          })
          .then(function (res) {
            if (res.tryBid === "YES") {
              bid(item);
            } else {
              start();
            }
          });
      }
    });
}

function exit() {
  console.log("(｡◕‿◕｡)-*-*-Thank you for using Great Bay!! -*-*-(｡◕‿◕｡) \n");
  connection.end();
}
