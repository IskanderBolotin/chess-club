

document.addEventListener('DOMContentLoaded', () => {
  const chessSlider = document.querySelector("#chess-slider");
  const sliderList = chessSlider.querySelectorAll(".slider__item");
  const sliderTrack = chessSlider.querySelector(".slider");
  const sliderPrevButton = chessSlider.querySelector(".slider-prev");
  const sliderNextButton = chessSlider.querySelector(".slider-next");
  const sliderCurrentCountBlock = chessSlider.querySelector(".slider-current-count");
  const sliderAllCountBlock = chessSlider.querySelector(".slider-all-count");

  const sliderConfig = {
    currentValue: 0,
    slideViewCount: 3,
    sliderGutter: 20,
    slideCount: sliderList.length ?? 0,
  };

  const reactConfig = new Proxy(sliderConfig, {
    set(target, prop, value) {
      if (prop === "currentValue") {
        target[prop] = value;
        const isPrevStop = target[prop] <= 0;
        const isNextStop = target[prop] + target.slideViewCount >= target.slideCount;
        
        sliderCurrentCountBlock.innerHTML = target[prop] + target.slideViewCount;

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
    }
  });

  reactConfig.currentValue = 0;
  sliderAllCountBlock.innerHTML = reactConfig.slideCount;

  const moveToNextSlise = () => {
    const isNextStop = reactConfig.currentValue + reactConfig.slideViewCount >= reactConfig.slideCount;
    reactConfig.currentValue = isNextStop ? (reactConfig.slideCount - reactConfig.slideViewCount) : reactConfig.currentValue + 1;

    if (!isNextStop) {
      const slideStep = `calc(${reactConfig.currentValue} * (100% / -${reactConfig.slideViewCount}))`;
      sliderTrack.setAttribute("style", `transform: translate3d(${slideStep}, 0, 0)`);
    }
  };

  const moveToPrevSlide = () => {
    const isPrevStop = reactConfig.currentValue <= 0;
    reactConfig.currentValue = isPrevStop ? 0 : reactConfig.currentValue - 1;

    if (!isPrevStop) {
      const slideStep = `calc(${reactConfig.currentValue} * (100% / -${reactConfig.slideViewCount}))`;
      sliderTrack.setAttribute("style", `transform: translate3d(${slideStep}, 0, 0)`);
    }
  };

  sliderNextButton.addEventListener("click", moveToNextSlise);
  sliderPrevButton.addEventListener("click", moveToPrevSlide);
});