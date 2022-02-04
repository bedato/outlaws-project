export function initText(textContent, img, name) {
  const textElement = document.getElementById("text");
  const optionButtonsElement = document.getElementById("option-buttons");
  const textContainer = document.getElementById("text-element");
  const textNodes = textContent;
  const imgPath = img;
  const imgElement = document.getElementById("content-image");
  const textBoxName = document.querySelector(".name");
  textBoxName.innerText = name;
  
  imgElement.setAttribute('src', imgPath)
  let state = {};

  function startTextbox() {
    state = {};
    showTextNode(1);
    textContainer.classList.add("visible");
  }

  function closeTextbox() {
    state = {};
    textContainer.classList.remove("visible")
  }

  function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(
      (textNode) => textNode.id === textNodeIndex
    );
    textElement.innerHTML = textNode.text;
    while (optionButtonsElement.firstChild) {
      optionButtonsElement.removeChild(optionButtonsElement.firstChild);
    }

    textNode.options.forEach((option) => {
      if (showOption(option)) {
        const button = document.createElement("button");
        button.innerHTML = option.text;
        button.classList.add("btn");
        button.addEventListener("click", () => selectOption(option));
        optionButtonsElement.appendChild(button);
      }
    });
  }

  function showOption(option) {
    return option.requiredState == null || option.requiredState(state);
  }

  function selectOption(option) {
    const nextTextNodeId = option.nextText;
    if (nextTextNodeId <= 0) {
      return closeTextbox();
    }
    if (nextTextNodeId === 77) {
      startTextbox()
    }
    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId);
  }

  startTextbox();

}
