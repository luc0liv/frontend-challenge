import React from "react";
import { ChangeEvent, useEffect, useState } from "react";
import { ModalStyle } from "./style";
import Input from "../Input/Input";
import { InputTypes, InputValues } from "../../types/input";
import Button from "../Button/Button";
import {
  AddTaskWrapper,
  addTheme,
  doneSelectTheme,
  doneTheme,
} from "../Button/style";

import { BsPlusCircleFill } from "react-icons/bs";
import { TaskItem } from "../../types/task";
import List from "../List/List";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../helpers/localStorage";
import Filters from "../Filters/Filters";
import { ButtonProps } from "../../types/button";

export default function Modal() {
  const [inputValues, setInputValues] = useState<InputValues>({
    task: "",
    search: "",
  });

  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [taskListFiltered, setTaskListFiltered] = useState<TaskItem[]>([]);
  const [lastId, setLastId] = useState<number>(0);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filter, setFilter] = useState("");

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
      isDone: false,
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
    setInputValues((prevState) => ({ ...prevState, task: "" }));
  };

  const onDelete = (index: number) => {
    const newTaskList = [...taskList];
    newTaskList.splice(index, 1);
    // if (isFiltered) {
    //   const filteredList = newTaskList.filter((task) => task.isDone === true);
    //   setTaskListFiltered(filteredList);
    // }
    setTaskList(newTaskList);
    saveToLocalStorage("taskList", newTaskList);
  };

  const setTaskStatus = (index: number) => {
    const updatedTaskList = taskList.map((task) =>
      task.id === index ? { ...task, isDone: true } : task
    );

    // if (isFiltered) {
    //   const filteredList = updatedTaskList.filter((task) => task.isDone === true);
    //   setTaskListFiltered(filteredList);
    // }

    saveToLocalStorage("taskList", updatedTaskList);
    setTaskList(updatedTaskList);
  };

  const filterTasksByStatus = (status: boolean) => {
    const taskListToFilter = getFromLocalStorage("taskList");
    const listParsed = taskListToFilter && JSON.parse(taskListToFilter);
    const filteredByStatus: TaskItem[] = listParsed.filter(
      (task: { isDone: boolean }) => task.isDone === status
    );

    setTaskListFiltered(filteredByStatus);
    status ? setFilter("done") : setFilter("pending");
    isFiltered ? setIsFiltered(false) : setIsFiltered(true);
  };

  const buttonsF: ButtonProps[] = [
    {
      theme: filter === "done" && isFiltered ? doneSelectTheme : doneTheme,
      onButtonClick: () => filterTasksByStatus(true),
      children: "Done",
    },
    {
      theme: filter === "pending" && isFiltered ? doneSelectTheme : doneTheme,
      onButtonClick: () => filterTasksByStatus(false),
      children: "Pending",
    },
  ];

  const searchTask = (e: ChangeEvent<HTMLInputElement>, list: TaskItem[]) => {
    const { name, value } = e.target;
    setInputValues((prevState) => ({ ...prevState, [name]: value }));
    const searchTerm = value.toLocaleLowerCase();
    const filtered = list.filter((t) => t.task.toLocaleLowerCase().includes(searchTerm));
    setTaskListFiltered(filtered);
    value === "" ? setIsFiltered(false) : setIsFiltered(true);
  }

  return (
    <ModalStyle>
      <Filters
        input={{
          value: inputValues.search,
          kind: InputTypes.SEARCH,
          onChange: (e: ChangeEvent<HTMLInputElement>) => searchTask(e, isFiltered ? taskListFiltered : taskList),
        }}
        buttons={buttonsF}
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
