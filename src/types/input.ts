import { ChangeEvent } from "react";

export enum InputTypes {
  SEARCH,
  TASK,
  NONE,
}

export interface InputProps {
  kind: InputTypes,
  value: string,
  name?: string,
  onSearch?: (s: string) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  onInputClick?: () => void,
  isDisabled?: boolean,
  onClearClick?: () => void,
  handleKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}

export interface InputValues {
  [key: string]: string;
}