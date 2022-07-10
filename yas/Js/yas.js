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
let lastKnownSliderWidth;
let last = 0;
let autoRotateId;
let mouseDownPosition;
let mouseUpPosition;
const initSliderLogic = (sliderInstance, isResizeEvent) => {
  if(sliderInstance === null) {
    sliderInstance = getSliderReferenceById("slider");
  } 
  console.log("running init");
  imagesInSlider = getImagesInSlider(sliderInstance);
  widthOfSlider = getWidthOfSlider(sliderInstance);
  imagesPerFrame = getimagesPerFrameValue(sliderInstance);
  widthOfImage = widthOfSlider / imagesPerFrame;
  setWidthOfChildren(imagesInSlider, widthOfImage);
  onDisplay = imagesPerFrame;
  if(!isResizeEvent) {
    numberOfImagesInSlider = countNumberOfImagesInSlider(imagesInSlider);
    rightQue = numberOfImagesInSlider - imagesPerFrame;
    const speed = getAutoRotateSpeed(sliderInstance);
    if (numberOfImagesInSlider > imagesPerFrame) {
      addArrowsToDOM(sliderInstance);
      showArrow(getArrowById("arrowRight"));
      addRightClickAction(getArrowById("arrowRight"), getArrowById("arrowLeft"));
      addLeftClickAction(getArrowById("arrowRight"), getArrowById("arrowLeft"));
      if(speed !== null) {
        autoRotateId = setUpAutoRotate(speed, Math.floor(imagesInSlider.length/imagesPerFrame), getArrowById("arrowLeft"), getArrowById("arrowRight"));
      }
       setUpDaD(sliderInstance, getArrowById("arrowLeft"), getArrowById("arrowRight"));
    }
  }
  if(isResizeEvent) {
    resetImagesAfterResizeEvent();
  }
  lastKnownSliderWidth = widthOfSlider;
  console.log(
    numberOfImagesInSlider,
    widthOfSlider,
    widthOfImage,
    imagesInSlider,
    imagesPerFrame,
    rightQue
  );
};

const setUpAutoRotate = (rotateSpeed, steps, leftArrow, rightArrow) => {
  let step = 0;
  let moveRight = true;
  return setInterval(() => {
    if(step < steps - 1) {
      if(moveRight) {
        removeAutoRotate(autoRotateId);
        shiftLeft(rightArrow, leftArrow);
        step++;
      }
      else {
        removeAutoRotate(autoRotateId);
        shiftRight(rightArrow, leftArrow);
        step++;
      }
    }
    else {
      step = 0;
      moveRight = !moveRight;
    }
    
  }, rotateSpeed);
}

const setUpDaD = (sliderInstance, leftArrow, rightArrow) => {
  sliderInstance.onmousedown = (event) => {
    sliderInstance.style.cursor = "grabbing";
    event.stopPropagation();
    mouseDownPosition = event.clientX;
    console.log("Mouse down:" + event.clientX);
    return false;
  };
  sliderInstance.onmouseup = (event) => {
    sliderInstance.style.cursor = "grab";
    event.stopPropagation();
    mouseUpPosition = event.clientX;
    console.log("Mouse up:" + event.clientX);
    if(mouseUpPosition < mouseDownPosition && rightQue > 0) {
      shiftLeft(rightArrow, leftArrow)
    }
    if(mouseUpPosition > mouseDownPosition && leftQue > 0){
      shiftRight(rightArrow, leftArrow);
    }
    return false;
  };
}



const removeAutoRotate = (id) => {
  clearInterval(id);
}

const resetImagesAfterResizeEvent = () => {
  for (let v = 0; v < numberOfImagesInSlider; v++) {
    rightQue = numberOfImagesInSlider - imagesPerFrame;
    leftQue = 0;
    last = 0;
    imagesInSlider[v].style.transform = `translateX(0px)`;
    showArrow(getArrowById("arrowRight"));
    hideArrow(getArrowById("arrowLeft"))
  }
}

const addLeftClickAction = (rightArrow, leftArrow) => {
  leftArrow.addEventListener("click", () => {
    removeAutoRotate(autoRotateId);
    shiftRight(rightArrow, leftArrow);
  });
};

const addRightClickAction = (rightArrow, leftArrow) => {
  rightArrow.addEventListener("click", () => {
    removeAutoRotate(autoRotateId);
    shiftLeft(rightArrow, leftArrow);
  });
};

const shiftRight = (rightArrow, leftArrow) => {
    console.log("click");
    for (let i = 0; i < imagesPerFrame && leftQue > 0; i++) {
      rightQue++;
      leftQue--;
      for (let v = 0; v < numberOfImagesInSlider; v++) {
        if(isNaN(last)) last = 0;
        if (imagesInSlider[v]?.className === "arrow-wrapper") continue;
        const tst = i === 0 ? 1 : i + 1;
        var value = Math.abs((widthOfImage * tst) - last);
        var test = `translateX(-${value}px)`;
        imagesInSlider[v].style.transform = test;
        console.log("Moving item:" + v + "," + test);
      }    
    }
    console.log("RighQue:" + rightQue, "LeftQue:" + leftQue);
    if (rightQue > 0) showArrow(rightArrow);
    if (leftQue <= 0) hideArrow(leftArrow);
    last = value;
}

const shiftLeft = (rightArrow, leftArrow) => {
    console.log("click");
    for (let i = 0; i < imagesPerFrame && rightQue > 0; i++) {
      rightQue--;
      leftQue++;
      for (let v = 0; v < numberOfImagesInSlider; v++) {
        if(isNaN(last)) last = 0;
        if (imagesInSlider[v]?.className === "arrow-wrapper") continue;
        const tst = i === 0 ? 1 : i + 1;
        var value = widthOfImage * tst + last;
        var test = `translateX(-${value}px)`;
        imagesInSlider[v].style.transform = test;
        console.log("Moving item:" + v + "," + test);
      }    
    }
    console.log("RighQue:" + rightQue, "LeftQue:" + leftQue);
    if (rightQue <= 0) hideArrow(rightArrow);
    if (leftQue > 0) showArrow(leftArrow);
    last = value;
}

const getimagesPerFrameValue = (sliderInstance) => {
  return sliderInstance.getAttribute("display");
}

const getAutoRotateSpeed = (sliderInstance) => {
  return sliderInstance.getAttribute("auto");
}

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
    child.style.minWidth = `${width}px`;
    child.style.flex = `0 1 ${width}px`;
  }
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
  initSliderLogic(sliderInstance, false);
  window.onresize = () => { initSliderLogic(sliderInstance, true) };
} else {
  console.log("Could not load slider..");
}


