let rightQue = 0;
let leftQue = 0;
let imagesPerFrame;
let imagesInSlider;
let numberOfImagesInSlider;
let widthOfSlider;
let widthOfImage;
let lastTransformValue = 0;
let autoRotateId;
let mouseDownPosition;
let mouseUpPosition;
let widthOfArrowWrapper;
const arrowWrapper = "arrowWrapper";
const arrowRight = "arrowRight";
const arrowLeft = "arrowLeft";
const slider = "slider";

const initSliderLogic = (sliderInstance, isResizeEvent) => {
  if(sliderInstance === null) {
    sliderInstance = getSliderReferenceById(slider);
  } 
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
      widthOfArrowWrapper = getWidthOfArrowWrapper(getArrowWrapperById(arrowWrapper));
      setArrowPosition(getArrowWrapperById(arrowWrapper), getArrowPosition(sliderInstance), widthOfSlider, widthOfArrowWrapper);
      showArrow(getArrowById(arrowRight));
      addRightClickAction(getArrowById(arrowRight), getArrowById(arrowLeft));
      addLeftClickAction(getArrowById(arrowRight), getArrowById(arrowLeft));
      if(speed !== null) {
        autoRotateId = setUpAutoRotate(speed, Math.floor(imagesInSlider.length/imagesPerFrame), getArrowById(arrowLeft), getArrowById(arrowRight));
      }
       setUpDaD(sliderInstance, getArrowById(arrowLeft), getArrowById(arrowRight));
    }
  }
  if(isResizeEvent) {
    resetImagesAfterResizeEvent();
    if (numberOfImagesInSlider > imagesPerFrame) {
      setArrowPosition(getArrowWrapperById(arrowWrapper), getArrowPosition(sliderInstance), widthOfSlider, widthOfArrowWrapper);
    }
  }
};

const setArrowPosition = (arrowWrapper, position, widthOfSlider, widthOfWrapper ) => {
    switch (position) {
      case "TR":
        arrowWrapper.style.top = "0";
        arrowWrapper.style.right = "0";
        break;
      case "TL":
        arrowWrapper.style.top = "0";
        arrowWrapper.style.left = "0";
        break;
        case "BR":
        arrowWrapper.style.bottom = "0";
        arrowWrapper.style.right = "0";
        break;
      case "BL":
        arrowWrapper.style.bottom = "0";
        arrowWrapper.style.left = "0";
        break;
        case "TC":
        arrowWrapper.style.top = "0";
        arrowWrapper.style.left = (widthOfSlider/2)-(widthOfWrapper/2);
        break;
        case "BC":
        arrowWrapper.style.bottom = "0";
        arrowWrapper.style.left = (widthOfSlider/2)-(widthOfWrapper/2);
        break;
        default:
        arrowWrapper.style.bottom = "0";
        arrowWrapper.style.left = (widthOfSlider/2)-(widthOfWrapper/2);
        break;
    }
}

const setUpAutoRotate = (rotateSpeed, steps, leftArrow, rightArrow) => {
  let step = 0;
  let moveRight = true;
  return setInterval(() => {
    if(step < steps - 1) {
      if(moveRight) {
        shiftLeft(rightArrow, leftArrow);
        step++;
      }
      else {
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
    return false;
  };
  sliderInstance.onmouseup = (event) => {
    sliderInstance.style.cursor = "grab";
    event.stopPropagation();
    mouseUpPosition = event.clientX;
    if(mouseUpPosition < mouseDownPosition && rightQue > 0) {
      removeAutoRotate(autoRotateId);
      shiftLeft(rightArrow, leftArrow)
    }
    if(mouseUpPosition > mouseDownPosition && leftQue > 0){
      removeAutoRotate(autoRotateId);
      shiftRight(rightArrow, leftArrow);
    }
    return false;
  };
}

const rotateEvent = () => {
  setArrowPosition(getArrowWrapperById(arrowWrapper), getArrowPosition(sliderInstance), widthOfSlider, getWidthOfArrowWrapper(getArrowWrapperById(arrowWrapper)));
}

const removeAutoRotate = (id) => {
  clearInterval(id);
}

const resetImagesAfterResizeEvent = () => {
  for (let v = 0; v < numberOfImagesInSlider; v++) {
    rightQue = numberOfImagesInSlider - imagesPerFrame;
    leftQue = 0;
    lastTransformValue = 0;
    imagesInSlider[v].style.transform = `translateX(0px)`;
    showArrow(getArrowById(arrowRight));
    hideArrow(getArrowById(arrowLeft))
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
  let transformValue;  
  for (let i = 0; i < imagesPerFrame && leftQue > 0; i++) {
      rightQue++;
      leftQue--;
      for (let v = 0; v < numberOfImagesInSlider; v++) {
        if(isNaN(lastTransformValue)) lastTransformValue = 0;
        if (imagesInSlider[v]?.className === "arrow-wrapper") continue;
        const tst = i === 0 ? 1 : i + 1;
        transformValue = Math.abs((widthOfImage * tst) - lastTransformValue);
        imagesInSlider[v].style.transform = `translateX(-${transformValue}px)`;
      }    
    }
    if (rightQue > 0) showArrow(rightArrow);
    if (leftQue <= 0) hideArrow(leftArrow);
    lastTransformValue = transformValue;
    rotateEvent();
}

const shiftLeft = (rightArrow, leftArrow) => {
  let transformValue;  
  for (let i = 0; i < imagesPerFrame && rightQue > 0; i++) {
      rightQue--;
      leftQue++;
      for (let v = 0; v < numberOfImagesInSlider; v++) {
        if(isNaN(lastTransformValue)) lastTransformValue = 0;
        if (imagesInSlider[v]?.className === "arrow-wrapper") continue;
        const tst = i === 0 ? 1 : i + 1;
        transformValue = widthOfImage * tst + lastTransformValue;
        imagesInSlider[v].style.transform = `translateX(-${transformValue}px)`;
      }    
    }
    if (rightQue <= 0) hideArrow(rightArrow);
    if (leftQue > 0) showArrow(leftArrow);
    lastTransformValue = transformValue;
    rotateEvent();
}


const getimagesPerFrameValue = (sliderInstance) => {
  return sliderInstance.getAttribute("display");
}

const getAutoRotateSpeed = (sliderInstance) => {
  return sliderInstance.getAttribute("auto");
}

const addArrowsToDOM = (sliderInstance) => {
  sliderInstance.innerHTML += `<div id="${arrowWrapper}" class="arrow-wrapper"><svg id="${arrowLeft}" class="arrow" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z"/></svg><svg id="${arrowRight}" class="arrow" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"/></svg></div>`;
};

const showArrow = (arrowRef) => {
  arrowRef.style.display = "initial";
};

const hideArrow = (arrowRef) => {
  arrowRef.style.display = "none";
};

const getArrowPosition = (sliderInstance) => {
  return sliderInstance.getAttribute("arrows");
}

const getArrowWrapperById = (id) => {
  return document.getElementById(id);
}

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
  return getWidthOfElement(sliderInstance);
};

const getWidthOfArrowWrapper = (arrowWrapper) => {
  return getWidthOfElement(arrowWrapper);
}

const getWidthOfElement = (element) => {
  return element?.clientWidth;
}

const getSliderReferenceById = (sliderId) => {
  return document.getElementById(sliderId);
};

const sliderInstance = getSliderReferenceById(slider);

if (sliderInstance !== null) {
  initSliderLogic(sliderInstance, false);
  window.onresize = () => { initSliderLogic(sliderInstance, true) };
} else {
  console.error("Could not load slider...");
}


