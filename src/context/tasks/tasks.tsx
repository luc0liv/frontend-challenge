import React, { ReactNode, createContext, useContext, useState } from "react";
import useTasks from "../../hooks/useTasks";
import { TaskItem } from "../../types/task";
import { saveToLocalStorage } from "../../helpers/localStorage";
import { toast } from "react-toastify";
import { EFilters } from "../../types/filters";

interface TasksContextProps {
  tasks: TaskItem[];
  tasksFiltered: TaskItem[];
  saveTask: (task: string) => void;
  deleteTask: (index: number) => void;
  defineTaskStatus: (index: number) => void;
  filterTasksByStatus: (status: EFilters) => void;
  filter: EFilters;
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
  const [filter, setFilter] = useState(EFilters.NONE);
  const [tasksFiltered, setTasksFiltered] = useState<TaskItem[]>([]);

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
    setTasks((prevList) => {
      const updatedList = prevList.filter((t) => t.id !== index);
      saveToLocalStorage("taskList", updatedList);
      if (!updatedList.length) {
        localStorage.clear();
      }
      return updatedList;
    });
    
    if (filter !== EFilters.NONE) {
      setTasksFiltered((prevList) => prevList.filter((t) => t.id !== index));
    }
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

    if (filter !== EFilters.NONE) {
      setTasksFiltered((prevList) => prevList.filter((t) => t.id !== index));
    }
  };

  const filterTasksByStatus = (status: EFilters) => {
    const isSameFilter = status === filter;
    const filteredByStatus: TaskItem[] = tasks.filter(
      (task: { isDone: boolean }) =>
        status === EFilters.DONE ? task.isDone : !task.isDone
    );

    setFilter(isSameFilter ? EFilters.NONE : status);
    setTasksFiltered(filteredByStatus);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        saveTask,
        deleteTask,
        defineTaskStatus,
        filterTasksByStatus,
        filter,
        tasksFiltered,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
