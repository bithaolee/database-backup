import chalk from "chalk";

const _error = chalk.bold.red;
const _info = chalk.bold.blue;
const _success = chalk.bold.green;
const _warning = chalk.hex("#FFA500");

export const success = (message) => {
  console.log(_success(message));
};

export const error = (message) => {
  console.error(_error(message));
};

export const info = (message) => {
  console.log(_info(message));
};

export const warning = (message) => {
  console.log(_warning(message));
};
