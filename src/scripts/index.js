export const isDefined = (v) => v !== null && v !== undefined; 

const mediaMobile = 1024;

function customSlider(sliderConfig) {
  const sliderInitialConfig = {
    sliderElement: null,
    isUseDots: sliderConfig.isUseDots ?? false,
    isUseCounter: sliderConfig.isUseCounter ?? false,
    isInfinity: sliderConfig.isInfinity ?? false,
    slideViewCount: sliderConfig.slideViewCount ?? 0,
    currentValue: 0,
    isAuto: false,
    __slidesCount: 0,
    __sliderTrack: null,
    __sliderList: null,
    __sliderPrevButton: null,
    __sliderNextButton: null,
    __sliderCurrentCountBlock: null,
    __sliderAllCountBlock: null,
    __sliderDotsList: null,
    __isButtonClick: false,
    __sliderInterval: null,
    __sliderSpeed: 4000,
  };

  const reactConfig = new Proxy(sliderInitialConfig, {
    set(target, prop, value) {
      target[prop] = value;

      if (prop === "sliderElement") {
        target.__sliderTrack = target.sliderElement.querySelector(".sliderTrack");
        target.__sliderList = target.sliderElement.querySelectorAll(".sliderListItem");
        target.__sliderPrevButton = target.sliderElement.querySelector(".sliderPrev");
        target.__sliderNextButton = target.sliderElement.querySelector(".sliderNext");

        if (target.isUseCounter) {
          target.__sliderCurrentCountBlock = target.sliderElement.querySelector(".sliderCurrentValue");
          target.__sliderAllCountBlock = target.sliderElement.querySelector(".sliderAllValue");
        }

        if (target.isUseDots) {
          target.__sliderDotsList = target.sliderElement.querySelectorAll(".sliderDots");
          for (let i = 0; i < target.__sliderDotsList.length; ++i) {
            target.__sliderDotsList[i].addEventListener("click", () => moveToSlide(i));
          }
        }

        reactConfig.__slidesCount = target.__sliderList.length;

        target.__sliderPrevButton.addEventListener("click", moveToPrevSlide);
        target.__sliderNextButton.addEventListener("click", moveToNextSlide);
      }

      if (prop === "__slidesCount") {
        if (target.isUseCounter && isDefined(target.__sliderAllCountBlock)) {
          target.__sliderAllCountBlock.innerHTML = reactConfig.__slidesCount;
        }
      }

      if (prop === "currentValue") {
        const isPrevStop = target[prop] <= 0;
        const isNextStop = target[prop] + target.slideViewCount >= target.__slidesCount;
        
        if (target.isUseDots && isDefined(target.__sliderDotsList)) {
          for (let i = 0; i < target.__sliderDotsList.length; ++i) {
            if (target[prop] === i) {
              target.__sliderDotsList[i].classList.add("sliderDots__active");
            }
            else {
              target.__sliderDotsList[i].classList.remove("sliderDots__active");
            }
          }
        }

        if (target.isUseCounter && isDefined(target.__sliderCurrentCountBlock)) {
          target.__sliderCurrentCountBlock.innerHTML = target[prop] + target.slideViewCount;
        }

        if (target.isInfinity) {
          return true;
        }

        if (isPrevStop) {
          target.__sliderPrevButton.setAttribute("disabled", isPrevStop);
        }
        else {
          target.__sliderPrevButton.removeAttribute("disabled");
        }

        if (isNextStop) {
          target.__sliderNextButton.setAttribute("disabled", isNextStop);
        }
        else {
          target.__sliderNextButton.removeAttribute("disabled");
        }
      }

      if (prop === "isAuto") {
        target.__sliderInterval = setInterval(() => {
          moveToNextSlide();
        }, target.__sliderSpeed);

        if (!target[prop]) {
          if (isDefined(target.__sliderInterval)) {
            clearTimeout(target.__sliderInterval);
          }
        }
      }

      if (prop === "__isButtonClick") {
        if (target[prop]) {
          if (isDefined(target.__sliderInterval)) {
            clearTimeout(target.__sliderInterval);
            reactConfig.__isButtonClick = false;
          }
        }
        else {
          if (target.isAuto) {
            target.__sliderInterval = setInterval(() => {
              moveToNextSlide();
            }, target.__sliderSpeed);
          }
        }
      }

      return true;
    }
  });

  const moveToNextSlide = () => {
    reactConfig.__isButtonClick = true;
    const isNextStop = reactConfig.currentValue + reactConfig.slideViewCount >= reactConfig.__slidesCount;
    const borderValue = reactConfig.isInfinity ? 0 : (reactConfig.__slidesCount - reactConfig.slideViewCount);
    reactConfig.currentValue = isNextStop ? borderValue : reactConfig.currentValue + 1;
    
    if (!isNextStop || reactConfig.isInfinity) {
      const slideStep = `calc(${reactConfig.currentValue} * (100% / -${reactConfig.slideViewCount}))`;
      reactConfig.__sliderTrack.setAttribute("style", `transform: translate3d(${slideStep}, 0, 0)`);
    }
  };

  const moveToPrevSlide = () => {
    reactConfig.__isButtonClick = true;
    const isPrevStop = reactConfig.currentValue <= 0;
    const borderValue = reactConfig.isInfinity ? (reactConfig.__slidesCount - reactConfig.slideViewCount) : 0;
    reactConfig.currentValue = isPrevStop ? borderValue : reactConfig.currentValue - 1;

    if (!isPrevStop || reactConfig.isInfinity) {
      const slideStep = `calc(${reactConfig.currentValue} * (100% / -${reactConfig.slideViewCount}))`;
      reactConfig.__sliderTrack.setAttribute("style", `transform: translate3d(${slideStep}, 0, 0)`);
    }
  };

  const moveToSlide = (slideId) => {
    reactConfig.__isButtonClick = true;
    const isCanMove = slideId >=0 && slideId <= reactConfig.__slidesCount;

    if (isCanMove) {
      reactConfig.currentValue = slideId;
    }
    
    if (isCanMove) {
      const slideStep = `calc(${reactConfig.currentValue} * (100% / -${reactConfig.slideViewCount}))`;
      reactConfig.__sliderTrack.setAttribute("style", `transform: translate3d(${slideStep}, 0, 0)`);
    }
  };

  const sliderInit = () => {
    try {
      reactConfig.sliderElement = sliderConfig.sliderElement;
      reactConfig.currentValue = sliderConfig.currentValue;
      reactConfig.isAuto = sliderConfig.isAuto;
    }
    catch(e) {
      console.log("Ошибка: ", e)
    }
  };

  return sliderInit;
};

document.addEventListener('DOMContentLoaded', () => {
  const chessSlider = document.querySelector("#chess-slider");
  const stepSlider = document.querySelector("#step-slider");
  const isMoble = window.innerWidth <= mediaMobile;

  if (isMoble) {
    const stepSliderConfig = {
      sliderElement: stepSlider,
      slideViewCount: 1,
      currentValue: 0,
      isUseDots: true,
    };
  
    const stepSliderInit = customSlider(stepSliderConfig);
  
    stepSliderInit();
  }

  const chessSliderConfig = {
    sliderElement: chessSlider,
    isInfinity: true,
    slideViewCount: isMoble ? 1 : 3,
    currentValue: 0,
    isAuto: true,
  };

  const chessSliderInit = customSlider(chessSliderConfig);

  chessSliderInit();
});