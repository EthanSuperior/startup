const Log = (() => {
  let logger: HTMLElement | null;
  // deno-lint-ignore no-explicit-any
  return (msg: any | string, _tag: string | null = null) => {
    msg = JSON.stringify(msg);
    if (typeof document === "undefined") return;
    logger ??= document.getElementById("log_msg");
    if (!logger) return;
    if (msg == "") return;
    const msgbox = document.createElement("li");
    msgbox.textContent = msg;
    logger.appendChild(msgbox);
  };
})();

export default Log;
