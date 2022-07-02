// Note
console.log("Loading...")

let position = 0;
let rightQue = 0;
let leftQue = 0;
let onDisplay = 0;
let imagesPerFrame;
let imagesInSlider;
let numberOfImagesInSlider;
let widthOfSlider;
let widthOfImage;
let lastClickedArrow;
const initSliderLogic = (sliderInstance) => {
  imagesInSlider = getImagesInSlider(sliderInstance);
  numberOfImagesInSlider = countNumberOfImagesInSlider(imagesInSlider);
  widthOfSlider = getWidthOfSlider(sliderInstance);
  widthOfImage = getImageWidth(sliderInstance);
  setWidthOfChildren(imagesInSlider, widthOfImage);
  imagesPerFrame = widthOfSlider / widthOfImage;
  rightQue = numberOfImagesInSlider - imagesPerFrame;
  onDisplay = imagesPerFrame;
  if (numberOfImagesInSlider > imagesPerFrame) {
    addArrowsToDOM(sliderInstance);
    showArrow(getArrowById("arrowRight"));
    addRightClickAction(getArrowById("arrowRight"), getArrowById("arrowLeft"));
    addLeftClickAction(getArrowById("arrowRight"), getArrowById("arrowLeft"));
  }
  console.log(
    numberOfImagesInSlider,
    widthOfSlider,
    widthOfImage,
    imagesInSlider,
    imagesPerFrame,
    rightQue
  );
};

const addLeftClickAction = (rightArrow, leftArrow) => {
  leftArrow.addEventListener("click", () => {
    if (lastClickedArrow === "right") position--;
    if (position === -1) position = 0;
    console.log("click");
    for (let i = 0; i < imagesPerFrame && leftQue > 0; i++) {
      if (imagesInSlider[position]?.className === "arrow-wrapper") continue;
      rightQue++;
      leftQue--;
      imagesInSlider[position].style.maxWidth = widthOfImage + "px";
      console.log("Moving item:" + position);
      position--;
    }
    console.log("RighQue:" + rightQue, "LeftQue:" + leftQue);
    if (rightQue === 0) hideArrow(getArrowById("arrowRight"));
    else showArrow(getArrowById("arrowRight"));
    if (leftQue > 0) showArrow(leftArrow);
    else hideArrow(leftArrow);
    lastClickedArrow = "left";
  });
};

const addRightClickAction = (rightArrow, leftArrow) => {
  rightArrow.addEventListener("click", () => {
    if (lastClickedArrow === "left") position = position++;
    if (position === -1) position = 0;
    console.log("click");
    for (let i = 0; i < imagesPerFrame && rightQue > 0; i++) {
      if (imagesInSlider[position]?.className === "arrow-wrapper") continue;
      rightQue--;
      leftQue++;
      imagesInSlider[position].style.maxWidth = "0px";
      console.log("Moving item:" + position);
      position++;
    }
    console.log("RighQue:" + rightQue, "LeftQue:" + leftQue);
    if (rightQue === 0) hideArrow(getArrowById("arrowRight"));
    if (leftQue > 0) showArrow(leftArrow);
    lastClickedArrow = "right";
  });
};

const addArrowsToDOM = (sliderInstance) => {
  sliderInstance.innerHTML += `<div class="arrow-wrapper"><span id="arrowLeft" class="arrow"><</span><span id="arrowRight" class="arrow">></span></div>`;
};

const showArrow = (arrowRef) => {
  arrowRef.style.display = "initial";
};

const hideArrow = (arrowRef) => {
  arrowRef.style.display = "none";
};

const getArrowById = (idOfArrow) => {
  return document.getElementById(idOfArrow);
};

const setWidthOfChildren = (children, width) => {
  for (let child of children) {
    if (child.className === "arrow-wrapper") continue;
    child.style.maxWidth = `${width}px`;
    child.style.flex = `0 1 ${width}px`;
  }
};

const getImageWidth = (sliderInstance) => {
  return sliderInstance.getAttribute("imgwidth");
};

const countNumberOfImagesInSlider = (images) => {
  return images.length;
};

const getImagesInSlider = (sliderInstance) => {
  return sliderInstance.children;
};

const getWidthOfSlider = (sliderInstance) => {
  return sliderInstance.clientWidth;
};

const getSliderReferenceById = (sliderId) => {
  return document.getElementById(sliderId);
};

const sliderInstance = getSliderReferenceById("slider");

if (sliderInstance !== null) {
  console.log("Load slider..");
  initSliderLogic(sliderInstance);
} else {
  console.log("Could not load slider..");
}
