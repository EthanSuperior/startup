export interface CircleColor{
    stroke:string,
    opacity:number
}
interface CircleProps {
    i?:number,
    x:number,
    y:number,
    c: CircleColor,
    onChange: ChangeFunction
}
type ChangeFunction = (key: number) => void;
export function ChangeCircle(props:CircleProps){
    props.i ??= 0;
    function key():number {
        return (props.x + props.y * 3) * 3 + (props.i ?? 0);
    }
    return (
      <circle
        key={key()}
        cx={7 + 14*props.x}
        cy={7 + 14*props.y}
        r={1.5 + props.i * 1.25}
        stroke={props.c.stroke}
        strokeWidth="1"
        strokeOpacity={props.c.opacity}
        fill="none"
        onClick={() => props.onChange(key())}
      />
    );
}

export default function CircleSet(props:CircleProps){
    return <g>{[0, 1, 2].map(i => (<ChangeCircle {...props} i={i} />))}</g>;
}