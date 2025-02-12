const chalk = require("chalk");

// Wait 2 seconds (2000ms), then clear the screen and print the message
setTimeout(() => {
    console.clear();  // Clears the console
    console.log(`${chalk.yellowBright("KittyRec is ready! Please start RecRoom now.")}`);
}, 5);  // 2000ms = 2 seconds
