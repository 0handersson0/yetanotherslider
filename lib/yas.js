function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var globalState = {
  mouseDownPosition: undefined,
  mouseUpPosition: undefined
};
var sliderHelpValuesArray = [];
var defaultDisplay = 3;
var defaultSpeed = 0.8;
var defaultAuto = 2000;
var defaultArrows = "BC";
var arrowWrapper = "arrowWrapper";
var arrowRight = "arrowRight";
var arrowLeft = "arrowLeft";
var slider = "slider";
var style = "\n  .slider {\n  width: auto;\n  height: auto;\n  background-color: grey;\n  display: flex;\n  flex-wrap: nowrap;\n  flex-direction: row;\n  overflow: hidden;\n  position: relative;\n}\n\n.slider img {\n  height: auto;\n  width: auto;\n}\n\n.slider .arrow-wrapper {\n  display: flex;\n  flex-direction: row;\n  position: absolute;\n}\n\n.slider .arrow-wrapper .arrow {\n  display: none;\n  cursor: pointer;\n  margin-right: 10px;\n  margin-left: 10px;\n  margin-top: 15px;\n  width: 25px;\n  border-radius: 90px;\n  padding: 15px;\n  margin-bottom: 15px;\n  background-color: white;\n  opacity: 0.7;\n}\n\n.slider .arrow-wrapper .arrow:hover {\n  background-color: white;\n  opacity: 0.3;\n}";

var initSliderLogic = function initSliderLogic(sliderInstance, isResizeEvent) {
  var sliderHelperValue = sliderHelpValuesArray.find(function (x) {
    return x.id === sliderInstance.id;
  });

  if (sliderHelperValue === undefined) {
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
  sliderHelperValue.isDraggable = getIsDragable(sliderHelperValue.sliderInstance);
  setWidthOfChildren(sliderHelperValue.imagesInSlider, sliderHelperValue.widthOfImage);

  if (!isResizeEvent) {
    addStyle(sliderHelperValue.sliderInstance);
    sliderHelperValue.numberOfImagesInSlider = countNumberOfImagesInSlider(sliderHelperValue.imagesInSlider);
    sliderHelperValue.rightQue = sliderHelperValue.numberOfImagesInSlider - sliderHelperValue.imagesPerFrame;
    sliderHelperValue.auto = getAutoRotateSpeed(sliderHelperValue.sliderInstance);
    sliderHelperValue.transitionSpeed = getTransitionSpeed(sliderHelperValue.sliderInstance);

    if (sliderHelperValue.numberOfImagesInSlider > sliderHelperValue.imagesPerFrame) {
      setTransitionSpeedInSecondsOfChildren(sliderHelperValue.imagesInSlider, sliderHelperValue.transitionSpeed);
      addArrowsToDOM(sliderHelperValue.sliderInstance, sliderHelperValue.id);
      sliderHelperValue.widthOfArrowWrapper = getWidthOfArrowWrapper(getArrowWrapperById("".concat(arrowWrapper).concat(sliderHelperValue.id)));
      setArrowPosition(getArrowWrapperById("".concat(arrowWrapper).concat(sliderHelperValue.id)), getArrowPosition(sliderHelperValue.sliderInstance), sliderHelperValue.widthOfSlider, sliderHelperValue.widthOfArrowWrapper);
      showArrow(getArrowById("".concat(arrowRight).concat(sliderHelperValue.id)));
      addRightClickAction(getArrowById("".concat(arrowRight).concat(sliderHelperValue.id)), getArrowById("".concat(arrowLeft).concat(sliderHelperValue.id)), sliderInstance.id);
      addLeftClickAction(getArrowById("".concat(arrowRight).concat(sliderHelperValue.id)), getArrowById("".concat(arrowLeft).concat(sliderHelperValue.id)), sliderInstance.id);

      if (sliderHelperValue.auto !== null) {
        sliderHelperValue.autoRotateId = setUpAutoRotate(sliderHelperValue.auto, Math.floor(sliderHelperValue.imagesInSlider.length / sliderHelperValue.imagesPerFrame), getArrowById("".concat(arrowLeft).concat(sliderHelperValue.id)), getArrowById("".concat(arrowRight).concat(sliderHelperValue.id)), sliderHelperValue.id);
      }

      if (sliderHelperValue.isDraggable === "true") {
        setUpDaD(sliderHelperValue.sliderInstance, getArrowById("".concat(arrowLeft).concat(sliderHelperValue.id)), getArrowById("".concat(arrowRight).concat(sliderHelperValue.id)), sliderHelperValue.id);
      }
    }
  }

  if (isResizeEvent) {
    resetImagesAfterResizeEvent();

    if (sliderHelperValue.numberOfImagesInSlider > sliderHelperValue.imagesPerFrame) {
      setArrowPosition(getArrowWrapperById("".concat(arrowWrapper).concat(sliderHelperValue.id)), getArrowPosition(sliderHelperValue.sliderInstance), sliderHelperValue.widthOfSlider, sliderHelperValue.widthOfArrowWrapper);
    }
  }
};

var setArrowPosition = function setArrowPosition(arrowWrapper, position, widthOfSlider, widthOfWrapper) {
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
      arrowWrapper.style.left = widthOfSlider / 2 - widthOfWrapper / 2;
      break;

    case "BC":
      arrowWrapper.style.bottom = "0";
      arrowWrapper.style.left = widthOfSlider / 2 - widthOfWrapper / 2;
      break;

    default:
      arrowWrapper.style.bottom = "0";
      arrowWrapper.style.left = widthOfSlider / 2 - widthOfWrapper / 2;
      break;
  }
};

var setUpAutoRotate = function setUpAutoRotate(rotateSpeed, steps, leftArrow, rightArrow, sliderId) {
  return setInterval(function () {
    var sliderHelperValues = getSliderHelperValuesById(sliderId);
    var step = sliderHelperValues.step,
        moveRight = sliderHelperValues.moveRight;
    var stepCounter = steps !== 1 ? steps - 1 : steps;

    if (step < stepCounter) {
      if (moveRight) {
        shiftLeft(rightArrow, leftArrow, sliderId);
        sliderHelperValues.step++;
      } else {
        shiftRight(rightArrow, leftArrow, sliderId);
        sliderHelperValues.step++;
      }
    } else {
      sliderHelperValues.step = 0;
      sliderHelperValues.moveRight = !moveRight;
    }
  }, rotateSpeed);
};

var setUpDaD = function setUpDaD(sliderInstance, leftArrow, rightArrow, sliderId) {
  sliderInstance.style.cursor = "grab";

  sliderInstance.onmousedown = function (event) {
    sliderInstance.style.cursor = "grabbing";
    event.stopPropagation();
    globalState.mouseDownPosition = event.clientX;
    return false;
  };

  sliderInstance.onmouseup = function (event) {
    var _getSliderHelperValue = getSliderHelperValuesById(sliderId),
        autoRotateId = _getSliderHelperValue.autoRotateId,
        rightQue = _getSliderHelperValue.rightQue,
        leftQue = _getSliderHelperValue.leftQue;

    sliderInstance.style.cursor = "grab";
    event.stopPropagation();
    globalState.mouseUpPosition = event.clientX;

    if (globalState.mouseUpPosition < globalState.mouseDownPosition && rightQue > 0) {
      removeAutoRotate(autoRotateId);
      shiftLeft(rightArrow, leftArrow, sliderId);
    }

    if (globalState.mouseUpPosition > globalState.mouseDownPosition && leftQue > 0) {
      removeAutoRotate(autoRotateId);
      shiftRight(rightArrow, leftArrow, sliderId);
    }

    return false;
  };
};

var rotateEvent = function rotateEvent(sliderId) {
  var _getSliderHelperValue2 = getSliderHelperValuesById(sliderId),
      sliderInstance = _getSliderHelperValue2.sliderInstance,
      widthOfSlider = _getSliderHelperValue2.widthOfSlider;

  setArrowPosition(getArrowWrapperById("".concat(arrowWrapper).concat(sliderId)), getArrowPosition(sliderInstance), widthOfSlider, getWidthOfArrowWrapper(getArrowWrapperById("".concat(arrowWrapper).concat(sliderId))));
};

var removeAutoRotate = function removeAutoRotate(id) {
  clearInterval(id);
};

var resetImagesAfterResizeEvent = function resetImagesAfterResizeEvent() {
  for (var i = 0; i < sliderHelpValuesArray.length; i++) {
    var sliderValues = sliderHelpValuesArray[i];
    var id = sliderValues.id,
        numberOfImagesInSlider = sliderValues.numberOfImagesInSlider,
        imagesPerFrame = sliderValues.imagesPerFrame;

    for (var v = 0; v < numberOfImagesInSlider; v++) {
      sliderValues.rightQue = numberOfImagesInSlider - imagesPerFrame;
      sliderValues.leftQue = 0;
      sliderValues.lastTransformValue = 0;
      sliderValues.imagesInSlider[v].style.transform = "translateX(0px)";
      showArrow(getArrowById("".concat(arrowRight).concat(id)));
      hideArrow(getArrowById("".concat(arrowLeft).concat(id)));
    }
  }
};

var addLeftClickAction = function addLeftClickAction(rightArrow, leftArrow, sliderId) {
  leftArrow.addEventListener("click", function () {
    var sliderHelperValues = getSliderHelperValuesById(sliderId);
    var autoRotateId = sliderHelperValues.autoRotateId,
        transitionSpeed = sliderHelperValues.transitionSpeed;
    var sleepTime = transitionSpeed * 1000;

    if (sliderHelperValues.canClick) {
      sliderHelperValues.canClick = false;
      removeAutoRotate(autoRotateId);
      shiftRight(rightArrow, leftArrow, sliderId);
      setTimeout(function () {
        sliderHelperValues.canClick = true;
      }, sleepTime);
    }
  });
};

var addRightClickAction = function addRightClickAction(rightArrow, leftArrow, sliderId) {
  rightArrow.addEventListener("click", function () {
    var sliderHelperValues = getSliderHelperValuesById(sliderId);
    var autoRotateId = sliderHelperValues.autoRotateId,
        transitionSpeed = sliderHelperValues.transitionSpeed;
    var sleepTime = transitionSpeed * 1000;

    if (sliderHelperValues.canClick) {
      sliderHelperValues.canClick = false;
      removeAutoRotate(autoRotateId);
      shiftLeft(rightArrow, leftArrow, sliderId);
      setTimeout(function () {
        sliderHelperValues.canClick = true;
      }, sleepTime);
    }
  });
};

var shiftRight = function shiftRight(rightArrow, leftArrow, sliderId) {
  var sliderHelperValue = getSliderHelperValuesById(sliderId);
  var numberOfImagesInSlider = sliderHelperValue.numberOfImagesInSlider,
      widthOfImage = sliderHelperValue.widthOfImage,
      imagesPerFrame = sliderHelperValue.imagesPerFrame,
      lastTransformValue = sliderHelperValue.lastTransformValue,
      imagesInSlider = sliderHelperValue.imagesInSlider,
      leftQue = sliderHelperValue.leftQue,
      rightQue = sliderHelperValue.rightQue,
      id = sliderHelperValue.id;
  var transformValue;

  for (var i = 0; i < imagesPerFrame && sliderHelperValue.leftQue > 0; i++) {
    sliderHelperValue.rightQue++;
    sliderHelperValue.leftQue--;

    for (var v = 0; v < numberOfImagesInSlider; v++) {
      var _imagesInSlider$v;

      if (isNaN(lastTransformValue)) sliderHelperValue.lastTransformValue = 0;
      if (((_imagesInSlider$v = imagesInSlider[v]) === null || _imagesInSlider$v === void 0 ? void 0 : _imagesInSlider$v.className) === "arrow-wrapper") continue;
      var tst = i === 0 ? 1 : i + 1;
      transformValue = Math.abs(widthOfImage * tst - lastTransformValue);
      imagesInSlider[v].style.transform = "translateX(-".concat(transformValue, "px)");
    }
  }

  if (sliderHelperValue.rightQue > 0) showArrow(rightArrow);
  if (sliderHelperValue.leftQue <= 0) hideArrow(leftArrow);
  sliderHelperValue.lastTransformValue = transformValue;
  rotateEvent(id);
};

var shiftLeft = function shiftLeft(rightArrow, leftArrow, sliderId) {
  var sliderHelperValue = getSliderHelperValuesById(sliderId);
  var numberOfImagesInSlider = sliderHelperValue.numberOfImagesInSlider,
      widthOfImage = sliderHelperValue.widthOfImage,
      imagesPerFrame = sliderHelperValue.imagesPerFrame,
      lastTransformValue = sliderHelperValue.lastTransformValue,
      imagesInSlider = sliderHelperValue.imagesInSlider,
      leftQue = sliderHelperValue.leftQue,
      rightQue = sliderHelperValue.rightQue,
      id = sliderHelperValue.id;
  var transformValue;

  for (var i = 0; i < imagesPerFrame && sliderHelperValue.rightQue > 0; i++) {
    sliderHelperValue.rightQue--;
    sliderHelperValue.leftQue++;

    for (var v = 0; v < numberOfImagesInSlider; v++) {
      var _imagesInSlider$v2;

      if (isNaN(lastTransformValue)) sliderHelperValue.lastTransformValue = 0;
      if (((_imagesInSlider$v2 = imagesInSlider[v]) === null || _imagesInSlider$v2 === void 0 ? void 0 : _imagesInSlider$v2.className) === "arrow-wrapper") continue;
      var tst = i === 0 ? 1 : i + 1;
      transformValue = widthOfImage * tst + lastTransformValue;
      imagesInSlider[v].style.transform = "translateX(-".concat(transformValue, "px)");
    }
  }

  if (sliderHelperValue.rightQue <= 0) hideArrow(rightArrow);
  if (sliderHelperValue.leftQue > 0) showArrow(leftArrow);
  sliderHelperValue.lastTransformValue = transformValue;
  rotateEvent(id);
};

var addStyle = function addStyle(sliderInstance) {
  sliderInstance.innerHTML += "<style>".concat(style, "</style>");
};

var getSliderHelperValuesById = function getSliderHelperValuesById(id) {
  return sliderHelpValuesArray.find(function (x) {
    return x.id === id;
  });
};

var getimagesPerFrameValue = function getimagesPerFrameValue(sliderInstance) {
  var _sliderInstance$getAt;

  return (_sliderInstance$getAt = sliderInstance.getAttribute("display")) !== null && _sliderInstance$getAt !== void 0 ? _sliderInstance$getAt : defaultDisplay;
};

var getAutoRotateSpeed = function getAutoRotateSpeed(sliderInstance) {
  var _sliderInstance$getAt2;

  return (_sliderInstance$getAt2 = sliderInstance.getAttribute("auto")) !== null && _sliderInstance$getAt2 !== void 0 ? _sliderInstance$getAt2 : defaultAuto;
};

var addArrowsToDOM = function addArrowsToDOM(sliderInstance, id) {
  sliderInstance.innerHTML += "<div id=\"".concat(arrowWrapper).concat(id, "\" class=\"arrow-wrapper\"><svg id=\"").concat(arrowLeft).concat(id, "\" class=\"arrow\" width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"><path d=\"M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z\"/></svg><svg id=\"").concat(arrowRight).concat(id, "\" class=\"arrow\" width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\"><path d=\"M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z\"/></svg></div>");
};

var showArrow = function showArrow(arrowRef) {
  arrowRef.style.display = "initial";
};

var hideArrow = function hideArrow(arrowRef) {
  arrowRef.style.display = "none";
};

var getArrowPosition = function getArrowPosition(sliderInstance) {
  var _sliderInstance$getAt3;

  return (_sliderInstance$getAt3 = sliderInstance.getAttribute("arrows")) !== null && _sliderInstance$getAt3 !== void 0 ? _sliderInstance$getAt3 : defaultArrows;
};

var getTransitionSpeed = function getTransitionSpeed(sliderInstance) {
  var _sliderInstance$getAt4;

  return (_sliderInstance$getAt4 = sliderInstance.getAttribute("speed")) !== null && _sliderInstance$getAt4 !== void 0 ? _sliderInstance$getAt4 : defaultSpeed;
};

var getIsDragable = function getIsDragable(sliderInstance) {
  var _sliderInstance$getAt5;

  return (_sliderInstance$getAt5 = sliderInstance.getAttribute("draggable")) !== null && _sliderInstance$getAt5 !== void 0 ? _sliderInstance$getAt5 : "false";
};

var getArrowWrapperById = function getArrowWrapperById(id) {
  return document.getElementById(id);
};

var getArrowById = function getArrowById(idOfArrow) {
  return document.getElementById(idOfArrow);
};

var setWidthOfChildren = function setWidthOfChildren(children, width) {
  var _iterator = _createForOfIteratorHelper(children),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var child = _step.value;
      if (child.className === "arrow-wrapper") continue;
      child.style.maxWidth = "".concat(width, "px");
      child.style.minWidth = "".concat(width, "px");
      child.style.flex = "0 1 ".concat(width, "px");
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

var setTransitionSpeedInSecondsOfChildren = function setTransitionSpeedInSecondsOfChildren(children, time) {
  var _iterator2 = _createForOfIteratorHelper(children),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var child = _step2.value;
      if (child.className === "arrow-wrapper") continue;
      child.style.transition = "transform ".concat(time, "s");
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
};

var countNumberOfImagesInSlider = function countNumberOfImagesInSlider(images) {
  return images.length;
};

var getImagesInSlider = function getImagesInSlider(sliderInstance) {
  return sliderInstance.children;
};

var getWidthOfSlider = function getWidthOfSlider(sliderInstance) {
  return getWidthOfElement(sliderInstance);
};

var getWidthOfArrowWrapper = function getWidthOfArrowWrapper(arrowWrapper) {
  return getWidthOfElement(arrowWrapper);
};

var getWidthOfElement = function getWidthOfElement(element) {
  return element === null || element === void 0 ? void 0 : element.clientWidth;
};

var getSliderReferencesByClassName = function getSliderReferencesByClassName(sliderClassname) {
  return document.getElementsByClassName(sliderClassname);
};

var getSliderReferenceById = function getSliderReferenceById(sliderId) {
  return document.getElementById(sliderId);
};

var sliderInstances = getSliderReferencesByClassName(slider);

if (sliderInstances !== null) {
  var _iterator3 = _createForOfIteratorHelper(sliderInstances),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      sliderInstance = _step3.value;
      initSliderLogic(sliderInstance, false);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  ;

  window.onresize = function () {
    var _iterator4 = _createForOfIteratorHelper(sliderInstances),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        sliderInstance = _step4.value;
        initSliderLogic(sliderInstance, true);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }

    ;
  };
} else {
  console.error("Could not load slider...");
}