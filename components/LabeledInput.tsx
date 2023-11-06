import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { SignalLike } from "$fresh/src/types.ts";
function capitalizeFirstLetter(id:string|undefined|SignalLike<string|undefined>) {
  if (id == undefined) return
  const str = (typeof id === 'string' ? id : id.value)??'';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export default function LabeledInput(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <div class="mb-4">
        <label for={props.id} class="block text-gray-600 font-medium">{capitalizeFirstLetter(props.id)}</label>
      <input
        {...props}
        disabled={!IS_BROWSER || props.disabled}
        class={`block w-full border rounded-md py-2 px-3 text-gray-700 mt-1 focus:ring focus:ring-indigo-300 focus:outline-none"
        ${props.class ?? ""}`}
      />
    </div>
  );
}