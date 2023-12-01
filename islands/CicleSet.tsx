import { Signal } from "@preact/signals";
import { useRef } from "preact/hooks";

export interface CircleColor {
  stroke: string;
  opacity: number;
}
export interface CircleProps {
  i?: number;
  x: number;
  y: number;
  sig: Signal<string>;
  onChange: ChangeFunction;
}
type ChangeFunction = (this: SVGCircleElement, key: number) => void;
export function ChangeCircle(props: CircleProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  function key(): number {
    return (props.x + props.y * 3) * 3 + (props?.i ?? 0);
  }
  return (
    <circle
      ref={circleRef}
      key={key()}
      cx={6 + 10 * props.x}
      cy={6 + 10 * props.y}
      r={1.5 + props.i! * 1.25}
      stroke={props.sig}
      strokeWidth="1"
      fill="none"
      onClick={() => props.onChange.call(circleRef.current!, key())}
    />
  );
}

export default function CircleSet(props: CircleProps) {
  return <g>{[0, 1, 2].map((i) => <ChangeCircle {...props} i={i} />)}</g>;
}
