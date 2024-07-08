const chalk = require("chalk");

module.exports = {
    name: "err",
    execute(err) {
        console.log(chalk.red(`An Error has occured while Connecting to the Database:\n${err}`));
    },
};