// Run code in practice.html
const runBtn = document.getElementById("runBtn");
if (runBtn) {
  runBtn.addEventListener("click", () => {
    const code = document.getElementById("codeEditor").value;
    const preview = document.getElementById("preview").contentWindow.document;
    preview.open();
    preview.write(code);
    preview.close();
  });
}

// Fade transitions
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("main").style.opacity = 1;
});
