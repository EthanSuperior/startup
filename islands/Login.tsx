import LabeledInput from "../components/LabeledInput.tsx";

function saveUsername() {
    // Get the input element for the username
    const usernameInput = document.getElementById('name') as HTMLInputElement | null;
  
    // Get the value entered by the user
    const username = usernameInput?.value;
  
    // Check if the user entered a username
    if (username) localStorage.setItem('username', username);
  }

export default function Login() {
  return (
    <form method="get" action="/play" onSubmit={saveUsername}>
        <LabeledInput id="name" placeholder="Enter username here"/>
        <LabeledInput id="password" placeholder="Enter password here"/>
        <button type="submit" className="w-full bg-indigo-500 text-white rounded-md py-2 px-4 hover:bg-indigo-600 focus:ring focus:ring-indigo-300 focus:outline-none">Login</button>
    </form>
  );
}