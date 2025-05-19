// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
//

import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // States for todos, inputs, and filtering
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, incomplete

  // Ref to focus on the input field when the component mounts
  const inputRef = useRef();

  // useEffect to load todos from localStorage when component mounts
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    setTodos(storedTodos);
  }, []);

  // useEffect to save todos to localStorage when the todos list changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Handle adding a new todo
  const handleAddTodo = () => {
    if (!newTodo.trim()) return; // Don't add empty todos
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Handle editing a todo
  const handleEditTodo = (id) => {
    setEditTodoId(id);
    const todoToEdit = todos.find((todo) => todo.id === id);
    setEditText(todoToEdit.text);
    setNewTodo(""); // Clear newTodo field when editing
  };

  // Handle updating a todo
  const handleUpdateTodo = () => {
    if (!editText.trim()) return; // Don't update with empty text
    setTodos(
      todos.map((todo) =>
        todo.id === editTodoId ? { ...todo, text: editText } : todo
      )
    );
    setEditTodoId(null);
    setEditText("");
  };

  // Handle toggling completion of a todo (mark as complete/incomplete)
  const toggleCompletion = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Filter todos based on the selected filter (all, completed, incomplete)
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true; // Show all todos if filter is "all"
  });

  // Focus on the input field when the component mounts or when editing
  useEffect(() => {
    inputRef.current?.focus();
  }, [editTodoId]);

  return (
    <div className="App">
      <h1>Todo List</h1>

      <div className="todo-form">
        <input
          ref={inputRef}
          type="text"
          value={editTodoId ? editText : newTodo}
          onChange={(e) => (editTodoId ? setEditText(e.target.value) : setNewTodo(e.target.value))}
          placeholder="Enter a todo"
        />
        <button onClick={editTodoId ? handleUpdateTodo : handleAddTodo}>
          {editTodoId ? "Update Todo" : "Add Todo"}
        </button>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("incomplete")}>Incomplete</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <span
              onClick={() => toggleCompletion(todo.id)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
                color: todo.completed ? "gray" : "black",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => handleEditTodo(todo.id)}>Edit</button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

