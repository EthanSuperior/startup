import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function NavLink(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return (
    <li class="nav-item">
      <a
        {...props}
        disabled={!IS_BROWSER || props.disabled}
        class="relative transition-colors duration-350 ease-in-out hover:text-blue-500"
      >
        {/* <span class="absolute left-0 bottom-0 h-2 bg-blue-500 w-0 transition-width duration-0 ease-in-out"></span>
        <span class="absolute right-0 bottom-0 h-2 bg-transparent w-0 transition-width duration-350 ease-in-out"></span> */}
      </a>
    </li>
  );
}