import { useRef } from "preact/hooks";
import LabeledInput from "../components/LabeledInput.tsx";

export default function Login() {

  const nameIn = useRef<HTMLInputElement>(null);
  const passwordIn = useRef<HTMLInputElement>(null);
  async function handleSubmit(e:Event){
    e.preventDefault();
    const res = await fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if(res.ok) self.location.href = "/play";
  };

  return (
    <form method='post' action='/user/login'>
        <LabeledInput ref={nameIn} id="username" placeholder="Enter username here"/>
        <LabeledInput ref={passwordIn} type="password" id="password" placeholder="Enter password here"/>
        <button type="submit" className="w-full bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600 focus:ring focus:ring-indigo-300 focus:outline-none">Login</button>
    </form>
  );
}