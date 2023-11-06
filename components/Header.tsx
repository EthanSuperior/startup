type Props = {
  active: string;
};

export default function Header() {
  const menus = [
    { name: "Login", href: "/" },
    { name: "Play", href: "/play" },
    { name: "Scores", href: "/leaderboard" },
    { name: "Rules", href: "/rules" },
  ];

  return (
    <div class="bg-white w-full max-w-screen-lg py-6 px-8 flex flex-col md:flex-row gap-4">
      <div class="flex items-center flex-1">
        <div class="text-2xl ml-1 font-bold">
          Otrio
        </div>
      </div>
      <ul class="flex items-center gap-6">
        {menus.map((menu) => (
          <li>
            <a
              href={menu.href}
              class={"text-gray-500 hover:text-gray-700 py-1 border-gray-500 [data-current]:{font-bold border-b-2}"}>
              {menu.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}