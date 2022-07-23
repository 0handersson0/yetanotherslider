let globalState = {
  mouseDownPosition: undefined,
  mouseUpPosition: undefined
};
const sliderHelpValuesArray = [];
const defaultDisplay = 3;
const defaultSpeed = 0.8;
const defaultAuto = 2000;
const defaultArrows = "BC";
const arrowWrapper = "arrowWrapper";
const arrowRight = "arrowRight";
const arrowLeft = "arrowLeft";
const slider = "slider";

const initSliderLogic = (sliderInstance, isResizeEvent) => {
  let sliderHelperValue = sliderHelpValuesArray.find(x => x.id === sliderInstance.id);
  if(sliderHelperValue === undefined) {
    sliderHelperValue = {};
    sliderHelperValue.sliderInstance = sliderInstance; 
    sliderHelperValue.id = sliderInstance.id;
    sliderHelperValue.lastTransformValue = 0;
    sliderHelperValue.step = 0;
    sliderHelperValue.leftQue = 0;
    sliderHelperValue.moveRight = true;
    sliderHelperValue.canClick = true;
    sliderHelpValuesArray.push(sliderHelperValue);
  }
  sliderHelperValue.imagesInSlider = getImagesInSlider(sliderHelperValue.sliderInstance);
  sliderHelperValue.widthOfSlider = getWidthOfSlider(sliderHelperValue.sliderInstance);
  sliderHelperValue.imagesPerFrame = getimagesPerFrameValue(sliderHelperValue.sliderInstance);
  sliderHelperValue.widthOfImage = sliderHelperValue.widthOfSlider / sliderHelperValue.imagesPerFrame;
  setWidthOfChildren(sliderHelperValue.imagesInSlider, sliderHelperValue.widthOfImage);
  if(!isResizeEvent) {
    sliderHelperValue.numberOfImagesInSlider = countNumberOfImagesInSlider(sliderHelperValue.imagesInSlider);
    sliderHelperValue.rightQue = sliderHelperValue.numberOfImagesInSlider - sliderHelperValue.imagesPerFrame;
    sliderHelperValue.auto = getAutoRotateSpeed(sliderHelperValue.sliderInstance);
    sliderHelperValue.transitionSpeed = getTransitionSpeed(sliderHelperValue.sliderInstance);
    if (sliderHelperValue.numberOfImagesInSlider > sliderHelperValue.imagesPerFrame) {
      setTransitionSpeedInSecondsOfChildren(sliderHelperValue.imagesInSlider, sliderHelperValue.transitionSpeed);
      addArrowsToDOM(sliderHelperValue.sliderInstance, sliderHelperValue.id);
      sliderHelperValue.widthOfArrowWrapper = getWidthOfArrowWrapper(getArrowWrapperById(`${arrowWrapper}${sliderHelperValue.id}`));
      setArrowPosition(getArrowWrapperById(`${arrowWrapper}${sliderHelperValue.id}`), getArrowPosition(sliderHelperValue.sliderInstance), sliderHelperValue.widthOfSlider, sliderHelperValue.widthOfArrowWrapper);
      showArrow(getArrowById(`${arrowRight}${sliderHelperValue.id}`));
      addRightClickAction(getArrowById(`${arrowRight}${sliderHelperValue.id}`), getArrowById(`${arrowLeft}${sliderHelperValue.id}`), sliderInstance.id);
      addLeftClickAction(getArrowById(`${arrowRight}${sliderHelperValue.id}`), getArrowById(`${arrowLeft}${sliderHelperValue.id}`), sliderInstance.id);
      if(sliderHelperValue.auto !== null) {
        sliderHelperValue.autoRotateId = setUpAutoRotate(sliderHelperValue.auto, Math.floor(sliderHelperValue.imagesInSlider.length/sliderHelperValue.imagesPerFrame), getArrowById(`${arrowLeft}${sliderHelperValue.id}`), getArrowById(`${arrowRight}${sliderHelperValue.id}`), sliderHelperValue.id);
      }
       setUpDaD(sliderHelperValue.sliderInstance, getArrowById(`${arrowLeft}${sliderHelperValue.id}`), getArrowById(`${arrowRight}${sliderHelperValue.id}`), sliderHelperValue.id);
    }
  }
  if(isResizeEvent) {
    resetImagesAfterResizeEvent();
    if (sliderHelperValue.numberOfImagesInSlider > sliderHelperValue.imagesPerFrame) {
      setArrowPosition(getArrowWrapperById(`${arrowWrapper}${sliderHelperValue.id}`), getArrowPosition(sliderHelperValue.sliderInstance), sliderHelperValue.widthOfSlider, sliderHelperValue.widthOfArrowWrapper);
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

const setUpAutoRotate = (rotateSpeed, steps, leftArrow, rightArrow, sliderId) => {
  return setInterval(() => {
    const sliderHelperValues = getSliderHelperValuesById(sliderId);
    const {step, moveRight} = sliderHelperValues;
    if(step < steps - 1) {
      if(moveRight) {
        shiftLeft(rightArrow, leftArrow, sliderId);
        sliderHelperValues.step++;
      }
      else {
        shiftRight(rightArrow, leftArrow, sliderId);
        sliderHelperValues.step++;
      }
    }
    else {
      sliderHelperValues.step = 0;
      sliderHelperValues.moveRight = !moveRight;
    }
    
  }, rotateSpeed);
}

const setUpDaD = (sliderInstance, leftArrow, rightArrow, sliderId) => {
  sliderInstance.onmousedown = (event) => {
    sliderInstance.style.cursor = "grabbing";
    event.stopPropagation();
    globalState.mouseDownPosition = event.clientX;
    return false;
  };
  sliderInstance.onmouseup = (event) => {
    const { autoRotateId, rightQue, leftQue } = getSliderHelperValuesById(sliderId);
    sliderInstance.style.cursor = "grab";
    event.stopPropagation();
    globalState.mouseUpPosition = event.clientX;
    if(globalState.mouseUpPosition < globalState.mouseDownPosition && rightQue > 0) {
      removeAutoRotate(autoRotateId);
      shiftLeft(rightArrow, leftArrow, sliderId)
    }
    if(globalState.mouseUpPosition > globalState.mouseDownPosition && leftQue > 0){
      removeAutoRotate(autoRotateId);
      shiftRight(rightArrow, leftArrow, sliderId);
    }
    return false;
  };
}

const rotateEvent = (sliderId) => {
  const { sliderInstance, widthOfSlider } = getSliderHelperValuesById(sliderId);
  setArrowPosition(getArrowWrapperById(`${arrowWrapper}${sliderId}`), getArrowPosition(sliderInstance), widthOfSlider, getWidthOfArrowWrapper(getArrowWrapperById(`${arrowWrapper}${sliderId}`)));
}

const removeAutoRotate = (id) => {
  clearInterval(id);
}

const resetImagesAfterResizeEvent = () => {
  for(let i = 0; i < sliderHelpValuesArray.length; i++) {
    const sliderValues = sliderHelpValuesArray[i];
    const {id, numberOfImagesInSlider, imagesPerFrame} = sliderValues;
    for (let v = 0; v < numberOfImagesInSlider; v++) {
      sliderValues.rightQue = numberOfImagesInSlider - imagesPerFrame;
      sliderValues.leftQue = 0;
      sliderValues.lastTransformValue = 0;
      sliderValues.imagesInSlider[v].style.transform = `translateX(0px)`;
      showArrow(getArrowById(`${arrowRight}${id}`));
      hideArrow(getArrowById(`${arrowLeft}${id}`))
    }
  }
}

const addLeftClickAction = (rightArrow, leftArrow, sliderId) => {
    leftArrow.addEventListener("click", () => {
      let sliderHelperValues = getSliderHelperValuesById(sliderId);
      const { autoRotateId, transitionSpeed } = sliderHelperValues;
      const sleepTime = transitionSpeed * 1000;
      if(sliderHelperValues.canClick) {
        sliderHelperValues.canClick = false;
        removeAutoRotate(autoRotateId);
        shiftRight(rightArrow, leftArrow, sliderId);
        setTimeout(() => {
          sliderHelperValues.canClick = true;
        }, sleepTime);
      }
      
    });
};

const addRightClickAction = (rightArrow, leftArrow, sliderId) => {
  rightArrow.addEventListener("click", () => {
    let sliderHelperValues = getSliderHelperValuesById(sliderId);
      const {autoRotateId, transitionSpeed } = sliderHelperValues;
      const sleepTime = transitionSpeed * 1000;
      if(sliderHelperValues.canClick) {
        sliderHelperValues.canClick = false;
        removeAutoRotate(autoRotateId);
        shiftLeft(rightArrow, leftArrow, sliderId);
        setTimeout(() => {
          sliderHelperValues.canClick = true;
        }, sleepTime);
      }
  });
};

const shiftRight = (rightArrow, leftArrow, sliderId) => {
    let sliderHelperValue = getSliderHelperValuesById(sliderId);
    const { numberOfImagesInSlider, widthOfImage, imagesPerFrame, lastTransformValue, imagesInSlider, leftQue, rightQue, id } = sliderHelperValue;
    let transformValue;
    for (let i = 0; i < imagesPerFrame && sliderHelperValue.leftQue > 0; i++) {
      sliderHelperValue.rightQue++;
      sliderHelperValue.leftQue--;
      for (let v = 0; v < numberOfImagesInSlider; v++) {
        if (isNaN(lastTransformValue)) sliderHelperValue.lastTransformValue = 0;
        if (imagesInSlider[v]?.className === "arrow-wrapper") continue;
        const tst = i === 0 ? 1 : i + 1;
        transformValue = Math.abs((widthOfImage * tst) - lastTransformValue);
        imagesInSlider[v].style.transform = `translateX(-${transformValue}px)`;
      }
    }
    if (sliderHelperValue.rightQue > 0) showArrow(rightArrow);
    if (sliderHelperValue.leftQue <= 0) hideArrow(leftArrow);
    sliderHelperValue.lastTransformValue = transformValue;
    rotateEvent(id);
}

const shiftLeft = (rightArrow, leftArrow, sliderId) => {
    let sliderHelperValue = getSliderHelperValuesById(sliderId);
    const { numberOfImagesInSlider, widthOfImage, imagesPerFrame, lastTransformValue, imagesInSlider, leftQue, rightQue, id } = sliderHelperValue;
    let transformValue;
    for (let i = 0; i < imagesPerFrame && sliderHelperValue.rightQue > 0; i++) {
      sliderHelperValue.rightQue--;
      sliderHelperValue.leftQue++;
      for (let v = 0; v < numberOfImagesInSlider; v++) {
        if (isNaN(lastTransformValue)) sliderHelperValue.lastTransformValue = 0;
        if (imagesInSlider[v]?.className === "arrow-wrapper") continue;
        const tst = i === 0 ? 1 : i + 1;
        transformValue = widthOfImage * tst + lastTransformValue;
        imagesInSlider[v].style.transform = `translateX(-${transformValue}px)`;
      }
    }
    if (sliderHelperValue.rightQue <= 0) hideArrow(rightArrow);
    if (sliderHelperValue.leftQue > 0) showArrow(leftArrow);
    sliderHelperValue.lastTransformValue = transformValue;
    rotateEvent(id);
}

const getSliderHelperValuesById = (id) => {
  return sliderHelpValuesArray.find(x => x.id === id);
}

const getimagesPerFrameValue = (sliderInstance) => {
  return sliderInstance.getAttribute("display") ?? defaultDisplay;
}

const getAutoRotateSpeed = (sliderInstance) => {
  return sliderInstance.getAttribute("auto") ?? defaultAuto;
}

const addArrowsToDOM = (sliderInstance, id) => {
  sliderInstance.innerHTML += `<div id="${arrowWrapper}${id}" class="arrow-wrapper"><svg id="${arrowLeft}${id}" class="arrow" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z"/></svg><svg id="${arrowRight}${id}" class="arrow" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"/></svg></div>`;
};

const showArrow = (arrowRef) => {
  arrowRef.style.display = "initial";
};

const hideArrow = (arrowRef) => {
  arrowRef.style.display = "none";
};

const getArrowPosition = (sliderInstance) => {
  return sliderInstance.getAttribute("arrows") ?? defaultArrows;
}

const getTransitionSpeed = (sliderInstance) => {
  return sliderInstance.getAttribute("speed") ?? defaultSpeed;
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

const setTransitionSpeedInSecondsOfChildren = (children, time) => {
  for (let child of children) {
    if (child.className === "arrow-wrapper") continue;
    child.style.transition = `transform ${time}s`;
  }
}

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

const getSliderReferencesByClassName = (sliderClassname) => {
  return document.getElementsByClassName(sliderClassname);
}

const getSliderReferenceById = (sliderId) => {
  return document.getElementById(sliderId);
};

const sliderInstances = getSliderReferencesByClassName(slider);

if (sliderInstances !== null) {
  for(sliderInstance of sliderInstances) {
    initSliderLogic(sliderInstance, false);
  };
  
  window.onresize = () => { 
    for(sliderInstance of sliderInstances) {
      initSliderLogic(sliderInstance, true);
    }; 
  };
} else {
  console.error("Could not load slider...");
}


