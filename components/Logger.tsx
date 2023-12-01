const Log = (() => {
  let logger: HTMLElement | null;
  return (msg: string, _tag: string | null = null) => {
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
