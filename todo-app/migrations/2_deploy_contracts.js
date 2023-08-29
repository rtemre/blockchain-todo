// const TodoList = require("./TodoList.sol");

// // import TodoList from "./TodoList.sol";
// const deploy = (deployer) => {
//   deployer.deploy(TodoList);
// };
// export default deploy;
var TodoList = artifacts.require("./TodoList.sol");

module.exports = function (deployer) {
  deployer.deploy(TodoList);
};
