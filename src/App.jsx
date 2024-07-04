import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar } from 'react-bootstrap';
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0);
  const [Todo, setTodo] = useState("");  // Task input
  const [Todos, setTodos] = useState([]); // Array of tasks
  const [editing, setEditing] = useState(null); // Track which task is being edited
  const [editText, setEditText] = useState(""); // Track the edited text

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:3000/api/tasks');
    setTodos(response.data);
  };

  const HandleEdit = async (index) => {
    const updatedTask = { ...Todos[index], name: editText };
    await axios.put(`http://localhost:3000/api/tasks/${Todos[index]._id}`, updatedTask);
    setEditing(null);
    setEditText("");
    fetchTasks();
  };

  const HandleDelete = async (index) => {
    await axios.delete(`http://localhost:3000/api/tasks/${Todos[index]._id}`);
    fetchTasks();
  };

  const HandleAdd = async () => {
    if (Todo.trim()) {
      await axios.post('http://localhost:3000/api/tasks', { name: Todo, isCompleted: false });
      setTodo(""); // Reset the input field
      fetchTasks();
    }
  };

  const HandleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleToggleComplete = async (index) => {
    const updatedTask = { ...Todos[index], isCompleted: !Todos[index].isCompleted };
    await axios.put(`http://localhost:3000/api/tasks/${Todos[index]._id}`, updatedTask);
    fetchTasks();
  };

  const getCompletionPercentage = () => {
    if (Todos.length === 0) return 0;
    const completedTasks = Todos.filter(todo => todo.isCompleted).length;
    return (completedTasks / Todos.length) * 100;
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-5 rounded-xl p-5 bg-slate-300 min-h-[80vh]">
        <div className="addtodo">
          <h2 className="text-lg font-bold">Add Task</h2>
          <input onChange={HandleChange} value={Todo} type="text" className="w-1/2" />
          <button onClick={HandleAdd} className="bg-slate-600 font-bold rounded-xl p-1 mx-1 hover:bg-slate-300 m-1 text-black">Add</button>
        </div>
        
        <h2 className="text-lg font-bold">Your Tasks</h2>
        <ProgressBar now={getCompletionPercentage()} label={`${Math.round(getCompletionPercentage())}%`} />
        <div className="YourTask">
          {Todos.map((item, index) => (
            <div key={index} className="flex justify-start items-center my-2">
              <input type="checkbox" checked={item.isCompleted} onChange={() => handleToggleComplete(index)} className="mr-2" />
              {editing === index ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-1/2"
                />
              ) : (
                <div className={item.isCompleted ? "line-through" : ""}>{item.name}</div>
              )}
              <div className="button ml-auto">
                {editing === index ? (
                  <button onClick={() => HandleEdit(index)} className="bg-slate-600 font-bold rounded-xl p-1 mx-1 hover:bg-slate-300 m-1">Save</button>
                ) : (
                  <button onClick={() => {
                    setEditing(index);
                    setEditText(item.name);
                  }} className="bg-slate-600 font-bold rounded-xl p-1 mx-1 hover:bg-slate-300 m-1">Edit</button>
                )}
                <button onClick={() => HandleDelete(index)} className="bg-slate-600 font-bold rounded-xl p-1 mx-1 hover:bg-slate-300 m-1">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
