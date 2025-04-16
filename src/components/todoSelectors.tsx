import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./todo-app"; // sesuaikan path kalau beda file

export const selectTodos = (state: RootState) => state.todos;

export const makeFilteredTodos = () =>
  createSelector(
    [selectTodos, (_: RootState, filter: string) => filter],
    (todos, filter) => {
      switch (filter) {
        case "active":
          return todos.filter((t) => !t.completed);
        case "completed":
          return todos.filter((t) => t.completed);
        default:
          return todos;
      }
    }
  );
