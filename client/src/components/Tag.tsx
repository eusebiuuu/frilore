import { ReactNode } from "react";
import { Colour, tagClasses } from "../features/tasks/utils.tasks";

export type Props = {
  color: Colour,
  children: ReactNode,
  classNames?: string,
}

export default function Tag(props: Props) {
  let bgColour = 'bg-green-200', textColour = 'text-green-600';
  if (props.color === 'red' || props.color === 'green' || props.color === 'orange') {
    bgColour = tagClasses[props.color].bg;
    textColour = tagClasses[props.color].text;
  }
  return (
    <div className={`rounded-xl h-8 px-2 w-fit py-1 ${props.classNames} ${bgColour} ${textColour}`}>
      {props.children}
    </div>
  )
}