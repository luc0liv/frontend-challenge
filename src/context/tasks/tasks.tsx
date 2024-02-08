import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import useTasks from "../../hooks/useTasks";
import { TaskItem } from "../../types/task";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../helpers/localStorage";

interface TasksContextProps {
  tasks: TaskItem[];
  saveTask: (task: string) => void;
  deleteTask: (index: number) => void;
}

const TasksContext = createContext<TasksContextProps | null>(null);

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }

  return context;
}

type TaskProps = {
  children: ReactNode;
};

export function TasksProvider({ children }: TaskProps) {
  const { tasks, setTasks } = useTasks();

  const saveTask = (task: string) => {
    if (task === "") {
      return;
    }

    const newTask: TaskItem = {
      id: tasks[tasks.length - 1].id + 1, // preciso corrigir o id
      task: task,
      isDone: false,
    };

    const newTaskList = [...tasks, newTask];
    setTasks(newTaskList);
    saveToLocalStorage("taskList", newTaskList);
  };

  const deleteTask = (index: number) => {
    // if (isFiltered) {
    //   setTaskListFiltered((prevList) => prevList.filter((t) => t.id !== index));
    // }

    setTasks((prevList) => {
      const updatedList = prevList.filter((t) => t.id !== index);
      saveToLocalStorage("taskList", updatedList);
      if (!updatedList.length) {
        localStorage.clear();
      }
      return updatedList;
    });
  };

  return (
    <TasksContext.Provider value={{ tasks, saveTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
}
