import React, { ReactNode, createContext, useContext, useState } from "react";
import useTasks from "../../hooks/useTasks";
import { TaskItem } from "../../types/task";
import { saveToLocalStorage } from "../../helpers/localStorage";
import { toast } from "react-toastify";

interface TasksContextProps {
  tasks: TaskItem[];
  saveTask: (task: string) => void;
  deleteTask: (index: number) => void;
  defineTaskStatus: (index: number) => void;
}

const TasksContext = createContext<TasksContextProps | null>(null);

export function useTasksContext() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasksContext must be used within a TasksProvider");
  }

  return context;
}

type TaskProps = {
  children: ReactNode;
};

export function TasksProvider({ children }: TaskProps) {
  const { tasks, setTasks } = useTasks();
  const [lastId, setLastId] = useState(0);

  const saveTask = (task: string) => {
    if (task === "") {
      return;
    }

    const newTask: TaskItem = {
      id: lastId + 1,
      task: task,
      isDone: false,
    };

    const newTaskList = [...tasks, newTask];
    setTasks(newTaskList);
    setLastId(newTask.id);
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

  const defineTaskStatus = (index: number) => {
    setTasks((prevList) => {
      const updatedList = prevList.map((task) =>
        task.id === index ? { ...task, isDone: true } : task
      );
      const allIsDone = updatedList.every((t) => t.isDone === true);
      if (allIsDone) {
        toast("All done!");
      }
      saveToLocalStorage("taskList", updatedList);
      return updatedList;
    });
  };

  return (
    <TasksContext.Provider
      value={{ tasks, saveTask, deleteTask, defineTaskStatus }}
    >
      {children}
    </TasksContext.Provider>
  );
}
