import React, { ChangeEvent, useState } from "react";
import { TaskItem } from "../../types/task";
import Input from "../Input/Input";
import { InputTypes } from "../../types/input";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoCheckmarkCircle } from "react-icons/io5";
import Button from "../Button/Button";
import { AddTaskWrapper, deleteTheme, saveTheme } from "../Button/style";
import { ListContainer } from "./style";
import { DisabledInput } from "./style";

export default function List(props: {
  tasks: TaskItem[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (index: number) => void;
  setStatus?: (index: number) => void;
}) {
  const [selectedTaskIndex, setSelectedTaskIndex] = useState<number | null>(
    null
  );

  const onInputClick = (index: number) => {
    if (selectedTaskIndex === index) {
      setSelectedTaskIndex(null);
    } else {
      setSelectedTaskIndex(index);
    }
  };

  return (
    <ListContainer>
      {props.tasks.map((task, index) => (
        <AddTaskWrapper key={index}>
          {selectedTaskIndex === index ? (
            <>
              <Input
                kind={InputTypes.TASK}
                value={task.task}
                onChange={props.onChange}
                onInputClick={() => onInputClick(index)}
              />
              <Button
                theme={deleteTheme}
                onButtonClick={() => props.onDelete?.(index)}
              >
                <AiFillMinusCircle size={23} />
              </Button>
              <Button
                theme={saveTheme}
                onButtonClick={() => props.setStatus?.(task.id)}
              >
                <IoCheckmarkCircle size={23} />
              </Button>
            </>
          ) : (
            <DisabledInput onClick={() => onInputClick(index)}>
              {task.task}
            </DisabledInput>
          )}
        </AddTaskWrapper>
      ))}
    </ListContainer>
  );
}
