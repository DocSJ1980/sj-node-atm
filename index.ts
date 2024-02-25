// ATM
// This somewhat complex TypeScript/Node.js project is a console-based application. When the system starts the user is prompted with a user id and user pin. After entering the details successfully, the ATM functionalities are unlocked. All the user data is generated randomly.

// Create a GitHub repository for the project and submit its URL in the project submission form.

import chalk from "chalk";
import inquirer from "inquirer";
import { exit } from "process";

// User class to represent a user's account
class User {
  id: number;
  pin: number;
  balance: number;
  loggedIn: boolean = false;

  constructor(id: number, pin: number, balance: number) {
    this.id = id;
    this.pin = pin;
    this.balance = balance;
  }
}

// Generate a random user
function generateRandomUser() {
  const id = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

  const pin = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  const balance = Math.floor(Math.random() * 10000);

  return new User(id, pin, balance);
}

// ATM class to represent ATM functionalities
class ATM {
  user: User | null = null;

  // Login
  async login() {
    const { id, pin } = await inquirer.prompt([
      {
        name: "id",
        message: "Enter user id:",
      },
      {
        name: "pin",
        message: "Enter PIN:",
        type: "password",
      },
    ]);
    if (
      this.user &&
      this.user.id === parseInt(id) &&
      this.user.pin === parseInt(pin)
    ) {
      this.user.loggedIn = true;
      console.log("Login successful!");
    } else {
      console.log("Invalid user id or pin!");
      exit();
    }
  }

  // Check Balance
  checkBalance() {
    if (!this.user?.loggedIn) {
      console.log("Please login first!");
      return;
    }

    console.log(`Your balance is ${this.user.balance}`);
  }

  // Deposit
  async deposit() {
    // implementation
    if (!this.user?.loggedIn) {
      console.log("Please login first!");
      return;
    }

    const { amount } = await inquirer.prompt([
      {
        name: "amount",
        message: "Enter amount to deposit:",
      },
    ]);

    this.user.balance += parseInt(amount);
    console.log(`Your new balance is ${this.user.balance}`);
  }

  // Withdraw
  async withdraw() {
    // implementation
    if (!this.user?.loggedIn) {
      console.log("Please login first!");
      return;
    }
    const { amount } = await inquirer.prompt([
      {
        name: "amount",
        message: "Enter amount to withdraw:",
      },
    ]);
    if (amount > this.user.balance) {
      console.log("Insufficient balance!");
      return;
    }
    this.user.balance -= parseInt(amount);
    console.log(`Your new balance is ${this.user.balance}`);
  }

  // Logout
  logout() {
    this.user = null;
    console.log("Logged out!");
  }
}

// Main driver code
const atm = new ATM();

// Display menu and handle input

async function mainMenu() {
  if (!atm.user) {
    const user = generateRandomUser();
    atm.user = user;
    console.log(
      chalk.greenBright("Welcome your randomly auto-generated details are:")
    );
    console.log(chalk.bgCyanBright(chalk.blue(`user id: ${user.id}`)));
    console.log(chalk.bgCyanBright(chalk.blue(`pin: ${user.pin}`)));
    console.log(
      chalk.greenBright(
        `Login to continue and start using SJ's free ATM service!`
      )
    );
  }
  const { option } = await inquirer.prompt({
    type: "list",
    name: "option",
    message: "Select an option:",
    choices: ["Login", "Check Balance", "Deposit", "Withdraw", "Logout"],
  });
  if (option === "Login") {
    await atm.login();
    mainMenu();
  } else if (option === "Check Balance") {
    atm.checkBalance();
    checkContinue();
  } else if (option === "Deposit") {
    await atm.deposit();
    checkContinue();
  } else if (option === "Withdraw") {
    await atm.withdraw();
    checkContinue();
  } else if (option === "Logout") {
    atm.logout();
    exit();
  } else {
    console.log("Invalid option!");
    mainMenu();
  }
}

mainMenu();

async function checkContinue() {
  // Prompt the user to continue
  await inquirer
    .prompt([
      {
        type: "confirm",
        name: "continue",
        message: "Do you want to continue?",
        default: true,
      },
    ])
    .then((answers) => {
      if (answers.continue) {
        mainMenu();
      } else {
        exit();
      }
    });
}
