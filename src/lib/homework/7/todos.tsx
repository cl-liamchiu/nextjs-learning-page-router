import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  addTodo,
  completeTodo,
  setFilter,
  selectFilteredTodos,
} from "@/store/todos-slice";
import styles from "./todos.module.scss";

export default function TodosPage() {
  const [newTodo, setNewTodo] = useState("");
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectFilteredTodos);

  return (
    <div className={styles.todoAppContainer}>
      <h1 className={styles.title}>Todo App</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Add a new todo..."
          className={styles.todoInput}
          onChange={(e) => setNewTodo(e.target.value)}
          value={newTodo}
        />
        <button
          className={styles.addButton}
          onClick={() => {
            if (newTodo) {
              dispatch(
                addTodo({ id: Date.now(), title: newTodo, completed: false })
              );
              setNewTodo("");
            }
          }}
        >
          Add
        </button>
        <select
          className={styles.filterSelect}
          onChange={(e) => {
            dispatch(setFilter(e.target.value));
          }}
        >
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="active">Active</option>
        </select>
      </div>
      <ul className={styles.todoList}>
        {items.map((t) => (
          <li key={t.id} className={styles.todoItem}>
            <span className={styles.todoText}>{t.title}</span>
            <div className={styles.actions}>
              <button
                className={
                  t.completed ? styles.completeButton : styles.unDoneButton
                }
                onClick={() => {
                  dispatch(completeTodo(t.id));
                }}
              >
                v
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
