
(function setupDarkMode() {
    function setColorScheme(e:string) {
        if (e=='auto') console.log('auto setting theme to '+(e=(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)? "dark" : "light") +' mode');
        if (e=='dark') document.body.classList.add("dark")
        else document.body.classList.remove("dark");
        // if (e=='light') document.body.classList.add("light")
        // else document.body.classList.remove("light");
    }
    // var darkModePref = "dark";
    // if (darkModePref == 'dark') document.getElementById("dark-toggle").classList.remove("hidden");
    var iTag = document.getElementById("dark-toggle-icon");
    if (!iTag) return;
    iTag.addEventListener('click', _event => {
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
    setColorScheme('auto');
    iTag.children[0].classList.add(...(document.body.classList.contains("dark")?["fa-toggle-on", "text-action"]:["fa-toggle-off"]));
})();
// Function to adjust the iframe height
function adjustIframeHeight() {
    var iframe:HTMLIFrameElement = <HTMLIFrameElement>document.getElementById("frame");
    if (iframe) {
        // Set the iframe height to the content height
        iframe.style.height = iframe.contentWindow?.document.body.scrollHeight + "px";
        iframe.addEventListener("load", adjustIframeHeight);
    }
}

// Call the function when the iframe has loaded
window.addEventListener("load", adjustIframeHeight);