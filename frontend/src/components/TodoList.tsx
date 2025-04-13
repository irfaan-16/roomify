import React, { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import toast from "react-hot-toast";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error("Please enter a task!", { position: "bottom-right" });
      return;
    }
    const todo: Todo = {
      id: todos.length + 1,
      text: newTodo.trim(),
      completed: false,
    };
    setTodos([...todos, todo]);
    setNewTodo("");
    toast.success("Task added!", { position: "bottom-right" });
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    toast.success("Task Deleted!", { position: "bottom-right" });
  };

  return (
    <div className="bg-white/2 p-4 rounded-xl min-w-96  max-w-full mx-auto  backdrop-blur-lg shadow-lg border border-gray-800 min-h-48">
      <h2 className="text-2xl font-semibold text-white mb-2">Tasks</h2>
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder:text-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
        />
        <button
          type="submit"
          className="p-2 rounded-lg bg-purple-800 text-white hover:bg-purple-700 transition-colors cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="space-y-2 max-h-[100px] overflow-y-auto pr-2">
        {todos
          .sort(function (a, b) {
            return b.id - a.id;
          })
          .map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center gap-2 p-3 rounded-lg border border-gray-800 hover:border-purple-800 bg-gray-800/50 transition-all animate-fade-in"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  todo.completed
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                }`}
              >
                <Check size={16} />
              </button>
              <span
                className={`flex-1 text-gray-200 transition-all ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-400 hover:bg-red-950 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TodoList;
