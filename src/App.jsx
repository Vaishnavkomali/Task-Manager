import { useState } from 'react';
import Navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ProgressBar } from 'react-bootstrap';

function App() {
  const [Todo, setTodo] = useState("");  // Task input
  const [Todos, setTodos] = useState([]); // Array of tasks

  const HandleEdit = (index) => {
    const updatedTodos = Todos.map((todo, idx) => {
      if (idx === index) {
        return { ...todo, editing: !todo.editing }; // Toggle editing mode
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const HandleDelete = (index) => {
    const newTodos = Todos.filter((_, idx) => idx !== index);
    setTodos(newTodos);
  };

  const HandleAdd = () => {
    if (Todo.trim()) {
      setTodos([...Todos, { Todo, isCompleted: false, editing: false }]);
      setTodo(""); // Reset the input field
    }
  };

  const HandleChange = (e) => {
    setTodo(e.target.value);
  };

  const handleToggleComplete = (index) => {
    const newTodos = Todos.map((item, idx) => {
      if (idx === index) {
        return { ...item, isCompleted: !item.isCompleted };
      }
      return item;
    });
    setTodos(newTodos);
  };

  const handleEditSave = (index, newTodoText) => {
    const updatedTodos = [...Todos];
    updatedTodos[index] = { ...updatedTodos[index], Todo: newTodoText, editing: false };
    setTodos(updatedTodos);
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
          <button onClick={HandleAdd} className="bg-slate-600 rounded-xl p-1 mx-1 hover:bg-slate-300 m-1 text-black">Add</button>
        </div>
        
        <h2 className="text-lg font-bold">Your Tasks</h2>
        <ProgressBar now={getCompletionPercentage()} label={`${Math.round(getCompletionPercentage())}%`} />
        <div className="YourTask">
          {Todos.map((item, index) => (
            <div key={index} className="flex justify-start items-center my-2">
              <input type="checkbox" checked={item.isCompleted} onChange={() => handleToggleComplete(index)} className="mr-2" />
              {item.editing ? (
                <input
                  type="text"
                  value={item.Todo}
                  onChange={(e) => {
                    const updatedTodos = [...Todos];
                    updatedTodos[index] = { ...item, Todo: e.target.value };
                    setTodos(updatedTodos);
                  }}
                  onBlur={() => handleEditSave(index, item.Todo)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleEditSave(index, item.Todo);
                    }
                  }}
                  className="form-control"
                  autoFocus
                />
              ) : (
                <div className={item.isCompleted ? "line-through" : ""}>{item.Todo}</div>
              )}
              <div className="button ml-auto">
                <button
                  onClick={() => HandleEdit(index)}
                  className="bg-slate-600 rounded-xl p-1 mx-1 hover:bg-slate-300 m-1"
                >
                  {item.editing ? "Save" : "Edit"}
                </button>
                <button
                  onClick={() => HandleDelete(index)}
                  className="bg-slate-600 rounded-xl p-1 mx-1 hover:bg-slate-300 m-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
