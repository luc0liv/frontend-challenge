import React, { ChangeEvent, useState } from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import Input from "../Input";
import DateHeader from "../DateHeader";
import Button from "../Button";
import Filters from "../Filters";
import List from "../List";
import Message from "../Message";
import ProgressBar from "../ProgressBar";
import {
  AddTaskWrapper,
  addTheme,
} from "../Button/style";
import { ModalStyle } from "./style";
import { InputProps, InputTypes, InputValues } from "../../types/input";
import { EFilters } from "../../types/filters";
import { useTasksContext } from "../../context/tasks/tasks";

export default function Modal() {
  const [inputValues, setInputValues] = useState<InputValues>({
    task: "",
    search: "",
  });

  const {
    tasks,
    saveTask,
    deleteTask,
    defineTaskStatus,
    filter,
    tasksFiltered,
    clearFilters,
    searchTask,
    isFiltered
  } = useTasksContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;

    setInputValues((value) =>
      target.validity.valid ? { ...value, [target.name]: target.value } : value
    );
  };

  const handleSearchTask = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValues((prevState) => ({ ...prevState, search: value }));
    searchTask(value);
  };

  const clearSearch = () => {
    setInputValues((value) => ({ ...value, search: "" }));
    clearFilters();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      saveTask(inputValues.task);
    }
  };

  const filterInput: InputProps = {
    value: inputValues.search,
    kind: InputTypes.SEARCH,
    onChange: (e: ChangeEvent<HTMLInputElement>) => handleSearchTask(e),
    isDisabled: filter === EFilters.SEARCH && inputValues.search !== "",
    onClearClick: () => clearSearch(),
  };

  return (
    <ModalStyle>
      <DateHeader />
      <ProgressBar taskList={tasks} />

      <Filters input={filterInput} />

      {filter !== EFilters.SEARCH && (
        <AddTaskWrapper>
          <Input
            kind={InputTypes.TASK}
            value={inputValues.task}
            onChange={handleChange}
            handleKeyPress={handleKeyPress}
          />
          <Button
            theme={addTheme}
            onButtonClick={() => saveTask(inputValues.task)}
          >
            <BsPlusCircleFill size={23} />
          </Button>
        </AddTaskWrapper>
      )}

      {filter !== EFilters.NONE && !tasksFiltered.length && (
        <Message filter={filter} onMessageClick={clearFilters} />
      )}

      <List
        tasks={filter !== EFilters.NONE ? tasksFiltered : tasks}
        onChange={handleChange}
        onDelete={(index) => deleteTask(index)}
        setStatus={(index) => defineTaskStatus(index)}
      />
    </ModalStyle>
  );
}
