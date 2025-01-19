const mediaMobile = 1024;

document.addEventListener('DOMContentLoaded', () => {
  const chessSlider = document.querySelector("#chess-slider");
  const sliderList = chessSlider.querySelectorAll(".slider__item");
  const sliderTrack = chessSlider.querySelector(".slider");
  const sliderPrevButton = chessSlider.querySelector(".slider-prev");
  const sliderNextButton = chessSlider.querySelector(".slider-next");
  const sliderCurrentCountBlock = chessSlider.querySelector(".slider-current-count");
  const sliderAllCountBlock = chessSlider.querySelector(".slider-all-count");
  
  const isMoble = window.innerWidth <= 1024;

  const sliderConfig = {
    currentValue: 0,
    slideViewCount: isMoble ? 1 : 3,
    sliderGutter: 20,
    isAuto: false,
    isInfinity: true,
    slideCount: sliderList.length ?? 0,
    __isButtonClick: false,
    __sliderInterval: null,
    __sliderSpeed: 4000,
  };

  const reactConfig = new Proxy(sliderConfig, {
    set(target, prop, value) {
      target[prop] = value;

      if (prop === "currentValue") {
        const isPrevStop = target[prop] <= 0;
        const isNextStop = target[prop] + target.slideViewCount >= target.slideCount;
        
        sliderCurrentCountBlock.innerHTML = target[prop] + target.slideViewCount;

        if (target.isInfinity) {
          return true;
        }

        if (isPrevStop) {
          sliderPrevButton.setAttribute("disabled", isPrevStop);
        }
        else {
          sliderPrevButton.removeAttribute("disabled");
        }

        if (isNextStop) {
          sliderNextButton.setAttribute("disabled", isNextStop);
        }
        else {
          sliderNextButton.removeAttribute("disabled");
        }

        return true;
      }

      if (prop === "isAuto") {
        target.__sliderInterval = setInterval(() => {
          moveToNextSlide();
        }, target.__sliderSpeed);

        if (!target[prop]) {
          if (target.__sliderInterval != null) {
            clearTimeout(target.__sliderInterval);
          }
        }

        return true;
      }

      if (prop === "__isButtonClick") {
        if (target[prop]) {
          if (target.__sliderInterval != null) {
            clearTimeout(target.__sliderInterval);
            reactConfig.__isButtonClick = false;
          }
        }
        else {
          target.__sliderInterval = setInterval(() => {
            moveToNextSlide();
          }, target.__sliderSpeed);
        }
        return true;
      }

      return true;
    }
  });

  const sliderInit = () => {
    reactConfig.currentValue = 0;
    sliderCurrentCountBlock.innerHTML = reactConfig.currentValue + reactConfig.slideViewCount;
    sliderAllCountBlock.innerHTML = reactConfig.slideCount;
    reactConfig.isAuto = true;
    reactConfig.isInfinity = true;
  }

  const moveToNextSlide = () => {
    reactConfig.__isButtonClick = true;
    const isNextStop = reactConfig.currentValue + reactConfig.slideViewCount >= reactConfig.slideCount;
    const borderValue = reactConfig.isInfinity ? 0 : (reactConfig.slideCount - reactConfig.slideViewCount);
    reactConfig.currentValue = isNextStop ? borderValue : reactConfig.currentValue + 1;
    
    if (!isNextStop || reactConfig.isInfinity) {
      const slideStep = `calc(${reactConfig.currentValue} * (100% / -${reactConfig.slideViewCount}))`;
      sliderTrack.setAttribute("style", `transform: translate3d(${slideStep}, 0, 0)`);
    }
  };

  const moveToPrevSlide = () => {
    reactConfig.__isButtonClick = true;
    const isPrevStop = reactConfig.currentValue <= 0;
    const borderValue = reactConfig.isInfinity ? (reactConfig.slideCount - reactConfig.slideViewCount) : 0;
    reactConfig.currentValue = isPrevStop ? borderValue : reactConfig.currentValue - 1;

    if (!isPrevStop || reactConfig.isInfinity) {
      const slideStep = `calc(${reactConfig.currentValue} * (100% / -${reactConfig.slideViewCount}))`;
      sliderTrack.setAttribute("style", `transform: translate3d(${slideStep}, 0, 0)`);
    }
  };

  sliderInit();
  sliderNextButton.addEventListener("click", moveToNextSlide);
  sliderPrevButton.addEventListener("click", moveToPrevSlide);
});