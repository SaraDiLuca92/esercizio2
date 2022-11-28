const getExpandElementHeight = (expandElem) => {
  const items = expandElem.querySelectorAll(".ld-topic-list > *");
  let totalHeight = 0;
  for (let item of items) {
    totalHeight += item.offsetHeight;
  }
  return totalHeight + 50;
};
const toggle = (btn) => {
  const elemId = btn.getAttribute("data-ld-expands");
  const elemContainer = document.getElementById(elemId);
  const expandElem = elemContainer.querySelector(".ld-item-list-item-expanded");
  const expandElemHeight = getExpandElementHeight(expandElem);
  console.log(expandElemHeight);
  const icon = btn.querySelector(".ld-icon ");
  if (elemContainer.classList.contains("ld-expanded")) {
    elemContainer.classList.remove("ld-expanded");
    expandElem.style.maxHeight = 0;
    icon.classList = "ld-icon-arrow-down ld-icon";
  } else {
    elemContainer.classList.add("ld-expanded");
    expandElem.style.maxHeight = `${expandElemHeight}px`;

    icon.classList = "ld-icon-arrow-up ld-icon ";
  }
};

window.onload = () => {
  const expandBtns = document.querySelectorAll(".ld-expand-button");
  const singleExpandBtns = [];
  let expandAllBtn = null;
  for (let btn of expandBtns) {
    if (!btn.hasAttribute("data-ld-expand-text")) {
      singleExpandBtns.push(btn);
    } else {
      expandAllBtn = btn;
    }
  }
  if (expandAllBtn) {
    expandAllBtn.addEventListener("click", () => {
      for (let btn of singleExpandBtns) {
        toggle(btn);
      }
    });
  }

  for (let btn of singleExpandBtns) {
    btn.addEventListener("click", (e) => {
      toggle(btn);
    });
  }
};
