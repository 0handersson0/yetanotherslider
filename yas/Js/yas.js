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
let rightBtnClicks = 0;
var last = 0;
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
    for (let i = 0; i < imagesPerFrame; i++) {
      rightQue++;
      leftQue--;
      // imagesInSlider[position].style.maxWidth = widthOfImage + "px";
      for (let i = 0; i < numberOfImagesInSlider; i++) {
        if (imagesInSlider[i]?.className === "arrow-wrapper") continue;
        imagesInSlider[i].style.transform = `translateX(${widthOfImage}px)`;
      }     
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
      rightQue--;
      leftQue++;
      // imagesInSlider[position].style.maxWidth = "0px";
      for (let v = 0; v < numberOfImagesInSlider; v++) {
        if (imagesInSlider[v]?.className === "arrow-wrapper") continue;
        const tst = i === 0 ? 1 : i + 1;
        var value = widthOfImage*tst + last;
        var test = `translateX(-${value}px)`;
        imagesInSlider[v].style.transform = test;
        console.log("Moving item:" + v + "," + test);
      }    
      // console.log("Moving item:" + position);
      position++;
    }
    console.log("RighQue:" + rightQue, "LeftQue:" + leftQue);
    if (rightQue <= 0) hideArrow(getArrowById("arrowRight"));
    if (leftQue > 0) showArrow(leftArrow);
    lastClickedArrow = "right";
    rightBtnClicks++;
    last = value;
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
