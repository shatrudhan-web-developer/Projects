const rocket = document.getElementById("rocket");
const scene = document.querySelector(".scene");
let launched = false;
function createSmoke() {
  if (launched) return;
  const smoke = document.createElement("span");
  smoke.className = "smoke";
  smoke.style.left = rocket.offsetLeft + 30 + "px";
  smoke.style.top = rocket.offsetTop + 190 + "px";
  smoke.style.setProperty(
    "--x",
    Math.random() * 80 - 40 + "px"
    );
  scene.appendChild(smoke);
  setTimeout(() => {
    smoke.remove();
  }, 1200);
}
setInterval(createSmoke, 120);
rocket.addEventListener("click", () => {
  launched = true;
  rocket.classList.add("launch");
});