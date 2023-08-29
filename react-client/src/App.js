// import logo from './logo.svg';
import Web3 from "web3";
import "./App.css";
import { useEffect, useState } from "react";
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./config";
import TodoList from "./TodoList";

const App = () => {
  const [state, setState] = useState({
    // account: "",
    // tasks: [],
    taskCount: 0,
    // loading: true,
  });
  const [connectAcc, setConnectAcc] = useState("");
  const [todoListCont, setTodoListCont] = useState();
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // connetToNetwork()
    loadBlockchainData();
  }, []);

  const connetToNetwork = () => {
    // Check if web3 is available
    let connection;
    if (window.ethereum !== "undefined") {
      // Use the browser injected Ethereum provider
      connection = new Web3(window.ethereum);
      // Request access to the user's MetaMask account
      window.ethereum.enable();
      // Get the user's accounts
      connection.eth.getAccounts().then(function (accounts) {
        // Show the first account
        setState({
          ...state,
          account: "Connected with MetaMask account: " + accounts[0],
        });
        // document.getElementById('log').innerHTML =
        //     'Connected with MetaMask account: ' + accounts[0];
      });
    } else {
      // If web3 is not available, give instructions to install MetaMask
      // document.getElementById('log').innerHTML =
      //     'Please install MetaMask to connect with the Ethereum network';
    }
  };

  const loadBlockchainData = async () => {
    let web3;
    if (window.ethereum !== "undefined") {
      // Use the browser injected Ethereum provider
      web3 = new Web3(window.ethereum);
      // Request access to the user's MetaMask account
      const acc = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("account ===> ", acc);
      console.log("connection ===>", new Web3(), window.ethereum, web3);

      // Get the user's accounts
      await web3.eth.getAccounts().then(function (accounts) {
        console.log("accounts  ====> ", accounts);
        // Show the first account
        setConnectAcc(acc[0]);
        // document.getElementById('log').innerHTML =
        //     'Connected with MetaMask account: ' + accounts[0];
      });
    }
    // const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
    // const accounts = await web3.eth.getAccounts();
    // setState({ ...state, account: accounts[0] });
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS);
    console.log("list contract ===>", todoList, "state ==>", todoListCont);
    // setState({ ...state, todoList });
    const taskCount = await todoList.methods.taskCount().call();
    // setState({ ...state, taskCount });
    console.log("taskCount =========> ", taskCount);
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call();
      if (task !== undefined) {
        taskList.push(task);
        // setState({
        //   ...state,
        //   tasks: [...state.tasks, task],
        // });
      }
    }
    setTodoListCont(todoList);
    console.log("taskList ===>", taskList);
    setTaskList(taskList);

    setLoading(false);
    // setState({ ...state, loading: false });
    console.log("state =>>>>>>", state);
  };

  const createTask = (content) => {
    console.log("createTask  ===>", content, todoListCont?.methods);
    setLoading(true);

    todoListCont.methods
      .createTask(content)
      .send({ from: connectAcc })
      .once("receipt", (receipt) => {
        setLoading(false);
      });
  };

  const toggleCompleted = (taskId) => {
    setLoading(true);
    todoListCont.methods
      .toggleCompleted(taskId)
      .send({ from: connectAcc })
      .once("receipt", (receipt) => {
        setLoading(false);
      });
  };
  //   console.log("render state ====>", state, todoListCont.methods);
  return (
    <div>
      <div className="container">
        <h1>Ethereum Dapp!</h1>
        <p>Your account: {connectAcc}</p>
      </div>
      <nav className="navbar navbar-dark bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/free-download"
          target="_blank"
          rel="noreferrer"
        >
          Dapp University | Todo List
        </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small>
              <a className="nav-link" href="https://example.com/">
                <span id="account"></span>
              </a>
            </small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex justify-content-center">
            {loading ? (
              <div id="loader" className="text-center">
                <p className="text-center">Loading...</p>
              </div>
            ) : (
              <TodoList
                tasks={taskList}
                createTask={createTask}
                toggleCompleted={toggleCompleted}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
