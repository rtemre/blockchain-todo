import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { getContract, readContract } from "@wagmi/core";

import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from "./abi";
import React from "react";

const TaskList = () => {
  const [taskName, setTaskName] = React.useState("");

  const { address } = useAccount();
  const {
    data: readData,
    isError: isReadError,
    isLoading: isReadLoading,
  } = useContractRead({
    address: TODO_LIST_ADDRESS,
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "",
            type: "uint256",
          },
        ],
        name: "tasks",
        outputs: [
          {
            name: "id",
            type: "uint256",
          },
          {
            name: "content",
            type: "string",
          },
          {
            name: "completed",
            type: "bool",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ] as const,
    functionName: "tasks",
    args: [BigInt(2)],
    account: address,
    async onSuccess(data) {
      console.log("taskList data =====>", data);
    },
    onError(err) {
      console.log("error ===>", err);
    },
  });
  console.log("reacd Contract === > ", readData, isReadError, isReadLoading);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: TODO_LIST_ADDRESS,
    abi: [
      {
        constant: false,
        inputs: [
          {
            name: "_content",
            type: "string",
          },
        ],
        name: "createTask",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "createTask",
    args: [taskName],
  });
  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          write?.();
        }}
      >
        <label htmlFor="taskName">Task Name</label>
        <input
          id="taskName"
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Add Task"
          value={taskName}
        />
        <button disabled={!write || isLoading}>
          {isLoading ? "Adding..." : "Add"}
        </button>
        {isSuccess && <div>Successfully Added!</div>}
        {(isPrepareError || isError) && (
          <div>Error: {(prepareError || error)?.message}</div>
        )}
      </form>
      <ul id="taskList" className="list-unstyled">
        {[readData]?.map((task, key) => {
          return (
            <div className="checkbox" key={key}>
              <label>
                <input
                  type="checkbox"
                  name={task && task[0].toString()}
                  defaultChecked={task && task[2]}
                  //   onClick={(event) => {
                  //     props.toggleCompleted(event.target.name);
                  //   }}
                />
                <span className="content">{task && task[1]}</span>
              </label>
            </div>
          );
        })}
      </ul>
    </div>
  );
};
export default TaskList;
