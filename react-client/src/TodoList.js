import { useState } from "react";

const TodoList = (props) => {
  const [taskName, setTaskName] = useState("");
  const handleChange = (e) => {
    console.log("onchange ===>", e.target.value);
    setTaskName(e.target.value);
  };
  return (
    <div id="content">
      <form
        // action="/"
        onSubmit={(event, value) => {
          event.preventDefault();
          const formData = new FormData(value);

          console.log(
            "onsubmit ==>",
            event.target["newTask"].value,
            event.target,
            event,
            value,
            "formData",
            formData
          );
          props.createTask(event.target["newTask"].value);
        }}
      >
        <input
          id="newTask"
          //   ref={(input) => (task = input)}
          type="text"
          name="taskName"
          value={taskName}
          onChange={handleChange}
          className="form-control"
          placeholder="Add task..."
          required
        />
        <input type="submit" value="Submit" hidden={true} />
      </form>
      <ul id="taskList" className="list-unstyled">
        {props.tasks.map((task, key) => {
          return (
            <div className="checkbox" key={key}>
              <label>
                <input
                  type="checkbox"
                  name={task.id}
                  defaultChecked={task.completed}
                  //   ref={(input) => {
                  //     this.checkbox = input
                  //   }}
                  onClick={(event) => {
                    props.toggleCompleted(event.target.name);
                  }}
                />
                <span className="content">{task.content}</span>
              </label>
            </div>
          );
        })}
      </ul>
      <ul id="completedTaskList" className="list-unstyled"></ul>
    </div>
  );
};

export default TodoList;
