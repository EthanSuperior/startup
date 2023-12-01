import { type AppProps } from "$fresh/server.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Put your description here." />
        <title>Otrio</title>
        <link rel="icon" href="favicon.ico" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="p-0">
        <Header />
        <hr />
        <Component />
        <Footer />
      </body>
    </html>
  );
}

function setupDarkMode() {
  function setColorScheme(e: string) {
    if (e == "auto") {
      console.log(
        "auto setting theme to " +
          (e = (window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? "dark"
            : "light") +
          " mode",
      );
    }
    if (e == "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    // if (e=='light') document.body.classList.add("light")
    // else document.body.classList.remove("light");
  }
  // var darkModePref = "dark";
  // if (darkModePref == 'dark') document.getElementById("dark-toggle").classList.remove("hidden");
  const iTag = document.getElementById("dark-toggle-icon");
  if (!iTag) return;
  iTag.addEventListener("click", (_event) => {
    if (iTag?.children[0].classList.contains("fa-toggle-off")) {
      iTag.children[0].classList.remove("fa-toggle-off");
      iTag.children[0].classList.add("fa-toggle-on", "text-action");
      setColorScheme("dark");
    } else {
      iTag?.children[0].classList.remove("fa-toggle-on", "text-action");
      iTag?.children[0].classList.add("fa-toggle-off");
      setColorScheme("light");
    }
  });
  setColorScheme("auto");
  iTag.children[0].classList.add(
    ...(document.body.classList.contains("dark")
      ? ["fa-toggle-on", "text-action"]
      : ["fa-toggle-off"]),
  );
}
