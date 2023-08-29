import { ReactNode, useEffect, useRef } from "react"

type Props = {
  action: () => void,
  destination: 'top' | 'bottom',
  children: ReactNode,
  className?: string,
}

export default function ScrollableComponent(props: Props) {
  const scrollableDivRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const div = scrollableDivRef.current;
    if (div) {
      const end = props.destination === 'bottom'
        ? div.scrollTop + div.clientHeight >= div.scrollHeight - 10
        : -div.scrollTop + div.clientHeight >= div.scrollHeight - 1
      if (end) {
        props.action();
        // console.log('Reached end of scrollable div');
      }
    }
  };

  useEffect(() => {
    const div = scrollableDivRef.current;
    if (div) {
      div.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (div) {
        div.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div ref={scrollableDivRef}
      className={`${props.destination === 'top' ? 'flex flex-col-reverse' : ''} ${props.className}`}>
      {props.children}
    </div>
  )
}