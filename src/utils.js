export function init(asdf) {
  alert(asdf);
}

export function generateMarkup(content, target) {
  let markup = ``;

  markup += content;
  target.innerHTML = "";
  return target.insertAdjacentHTML("beforeend", markup);
}

export function closeOverlay(overlay) {}
