import React, { ChangeEvent, useEffect, useState } from "react";
import { ModalStyle } from "./style";
import Input from "../Input/Input";
import { InputTypes, InputValues } from "../../types/input";
import Button from "../Button/Button";
import { AddTaskWrapper, addTheme } from "../Button/style";

import { BsPlusCircleFill } from "react-icons/bs";
import { TaskItem } from "../../types/task";
import List from "../List/List";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../helpers/localStorage";

export default function Modal() {
  const [inputValues, setInputValues] = useState<InputValues>({
    task: "",
    search: "",
  });

  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [taskListFiltered, setTaskListFiltered] = useState<TaskItem[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  useEffect(() => {
    const storedTasks = getFromLocalStorage("taskList");

    if (storedTasks) {
      try {
        const tasks = JSON.parse(storedTasks);
        if (Array.isArray(tasks)) {
          setTaskList(tasks);
          setLastId(tasks[tasks.length - 1].id);
        } else {
          console.error("O valor armazenado não é um array válido.");
        }
      } catch (error) {
        console.error("Erro ao fazer o parse do JSON:", error);
      }
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    setInputValues((value) =>
      target.validity.valid ? { ...value, [target.name]: target.value } : value
    );
  };


  const saveTask = () => {
    const storageTaskList = getFromLocalStorage("taskList");
    if (inputValues.task === "") {
      return;
    }

    const item = { 
      id: lastId + 1,
      task: inputValues.task,
      isDone: false 
    };

    if (storageTaskList) {
      const storedList = JSON.parse(storageTaskList);
      const newList = [...storedList, item];
      setTaskList(newList);
      setLastId(item.id);
      saveToLocalStorage("taskList", newList);
    } else {
      const newList = [...taskList, item];
      setTaskList(newList);
      setLastId(item.id);
      saveToLocalStorage("taskList", newList);
    }
    setInputValues({ task: "" });
  };

  const onDelete = (index: number) => {
    const newTaskList = [...taskList];
    newTaskList.splice(index, 1);
    setTaskList(newTaskList);
    saveToLocalStorage("taskList", newTaskList);
  };

  const setTaskStatus = (index: number) => {
    const updatedTaskList = taskList.map((task) =>
      task.id === index ? { ...task, isDone: true } : task
    );

    saveToLocalStorage("taskList", updatedTaskList);
    setTaskList(updatedTaskList);
  };

  const filterTasksByStatus = (status: boolean) => {
    const filteredByStatus = taskList.filter((task) => task.isDone === status);
    setTaskListFiltered(filteredByStatus);
    isFiltered ? setIsFiltered(false) : setIsFiltered(true);
  }

  return (
    <ModalStyle>
      <button onClick={() => filterTasksByStatus(true)}>DONE</button>
      <button onClick={() => filterTasksByStatus(false)}>PENDING</button>
      <Input
        kind={InputTypes.SEARCH}
        value={inputValues.search}
        onChange={handleChange}
      />
      <AddTaskWrapper>
        <Input
          kind={InputTypes.TASK}
          value={inputValues.task}
          onChange={handleChange}
        />
        <Button theme={addTheme} onButtonClick={saveTask}>
          <BsPlusCircleFill size={23} />
        </Button>
      </AddTaskWrapper>

      <List
        tasks={isFiltered ? taskListFiltered : taskList}
        onChange={handleChange}
        onDelete={(index) => onDelete(index)}
        setStatus={(index) => setTaskStatus(index)}
      />
    </ModalStyle>
  );
}
