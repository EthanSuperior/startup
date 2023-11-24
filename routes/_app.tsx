import { AppProps } from "$fresh/server.ts";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

export default function App({ Component }: AppProps) {
  const fontStyles = `
  @import url("https://fonts.googleapis.com/css?family=Open+Sans");
  body {
    padding: 50px;
    font-family: "Open Sans", sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 100;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
  }
  a {
    text-decoration: none;
    color: rgba(34, 34, 34, 0.8);
  }
  a:hover, a :focus {
    color: black;
  }
  `;
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Put your description here." />
        <title>Otrio</title>
        <link rel="icon" href="favicon.ico" />
        <style>{{ fontStyles }}</style>
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
