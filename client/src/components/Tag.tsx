import { ReactNode } from "react";
import { tagClasses } from "../features/tasks/utils.tasks";

export type Props = {
  color: 'red' | 'orange' | 'green',
  children: ReactNode,
  classNames?: string,
}

export default function Tag(props: Props) {
  const bgColour = tagClasses[props.color].bg;
  const textColour = tagClasses[props.color].text;
  return (
    <div className={`rounded-xl h-8 px-2 w-fit py-1 ${props.classNames} ${bgColour} ${textColour}`}>
      {props.children}
    </div>
  )
}