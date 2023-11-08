interface StrokeColor{
    stroke:string,
    opacity:number
}
interface CicleProps {
    i:number,
    x:number,
    y:number,
    c: StrokeColor,
    onChange: ChangeFunction
}
type ChangeFunction = (index: number, color: StrokeColor) => void;
export function ChangeCircle(props:CicleProps){
    function key():number {
        return (props.x + props.y * 3) * 3 + props.i;
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
        onClick={() => props.onChange(props.i, {stroke:'red', opacity:0.5})}
      />
    );
}

export default function CircleSet({c, onChange }:CicleProps){
    const circles = [0, 1, 2].map((i) => (
        <></>
    //   <ChangeCircle i={i} c={c} onChange={onChange} />
    ));
    return <g>{circles}</g>;
}