import React, { useEffect, useState } from "react";


//Lista de Tareas//
const TaskListFetch = () => {
    const USER_NAME = "wenrei";
    const BASE_URL = "https://playground.4geeks.com/todo";

    const [tasks, setTasks] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            console.log("Voy a buscar TODOS a la API...");

            const response = await fetch(`${BASE_URL}/users/${USER_NAME}`);
            if (!response.ok) throw new Error(`Error en fetch: ${response.status}`);

            const data = await response.json();
            console.log("Data Recibida:", data);

            setTasks(data.todos || []);
        } catch (error) {
            console.error("Error cargando tareas:", error);
            setTasks([]);
        }
    };

    const addTask = async (label) => {
        try {
            console.log("POST -> creando tarea:", label);

            const newTask = { label: label, is_done: false };
            const response = await fetch(`${BASE_URL}/todos/${USER_NAME}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }

            });

            if (!response.ok) throw new Error(`POST error: ${response.status}`);

            const data = await response.json();
            console.log("POST data:", data);
            /* setTasks([...tasks, data]); */

            fetchTasks();
        } catch (error) {
            console.error("Error en POST:", error);
        }
    };

    const deleteTask = async (todoId) => {
        try {
            console.log("DELETE -> borrando tarea id:", todoId);

            const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error(`DELETE error: ${response.status}`);
            console.log("Tarea eliminada correctamente");

            /* const data = await response.json();
            console.log("DELETE data:", data); */

            fetchTasks();
        } catch (error) {
            console.error("Error en DELETE:", error);
        }
    };

    const clearAllTasks = async () =>{
        try{
            console.log("CLEAR ALL -> borrando todas las tareas...");
            for (const task of tasks) {
                const response = await fetch(`${BASE_URL}/todos/${task.id}`, {
                    method: "DELETE"
                });
                if(!response.ok) {
                    throw new Error (`CLEAR ALL error: ${response.status}`);
                }
            }
            console.log("Todas las tareas fueron eliminadas");
            fetchTasks();
        } catch(error) {
            console.error("Error en CLEAR ALL:", error);
        }
    };


    return (
        <div className="task-list">
            <h1 className="title">Task List</h1>

            <div className="todo-card">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="What needs to be done?"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const value = input.trim();
                                if (value === "") return;
                                addTask(value);
                                setInput("");
                            }
                        }}
                    />
                    <button
                        className="add-btn"
                        onClick={() => {
                            const value = input.trim();
                            if (value === "") return;

                            addTask(value);

                            /* setTasks([...tasks, { label: value, is_done: false }]); */
                            setInput("");
                        }}
                    >
                        Add
                    </button>
                </div>

                <ul className="todo-items">
                    {tasks.length === 0 && (
                        <li className="todo-empty">No tasks, add tasks</li>
                    )}

                    {tasks.map((item) => (
                        <li className="todo-item" key={item.id}>
                            <span>{item.label}</span>
                            <button
                                className="delete-btn"
                                onClick={() => deleteTask(item.id)}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>

                {/* <div className="todo-footer">
                    {tasks.length} {tasks.length === 1 ? "item left" : "items left"}
                </div> */}
                <div className="todo-footer">
                    <span>
                        {tasks.length} {tasks.length === 1? "item left" : "items left"}
                    </span>
                    <button className="clear-btn" onClick={clearAllTasks}>
                        Clear all
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskListFetch;