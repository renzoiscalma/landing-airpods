let heroMaxFrame = 64;
const html = document.documentElement;
const hero = document.getElementById("hero");
const section1 = document.getElementById("section-1");
const section2 = document.getElementById("section-2");
const section3 = document.getElementById("section-3");
const section4 = document.getElementById("section-4");
const section5 = document.getElementById("section-5");

const sections = [hero, section1, section2, section3, section4, section5];

const airpodsCanvas = document.getElementById("airpods-hero-canvas");
const canvasImg = new Image();
const context = airpodsCanvas.getContext("2d");

const images = [];

for (let i = 1; i <= heroMaxFrame; i++) {
  images[i] = new Image();
  images[i].src = getImage(i);
}

canvasImg.src = getImage(0);
airpodsCanvas.width = 1440;
airpodsCanvas.height = 810;

canvasImg.onload = function () {
  context.drawImage(canvasImg, 0, 0);
};

function getImage(frame) {
  return `https://www.apple.com/105/media/us/airpods-pro/2022/d2deeb8e-83eb-48ea-9721-f567cf0fffa8/anim/hero/large/${frame
    .toString()
    .padStart(4, "0")}.png`;
}

function updateImage(frame) {
  canvasImg.src = getImage(frame);
  context.clearRect(0, 0, airpodsCanvas.width, airpodsCanvas.height);
  context.drawImage(images[frame], 0, 0);
}

document.addEventListener("scroll", function () {
  const currSection = getCurrentSection();
  const currSectionOffSet = offset(sections[currSection]);
  const scrollTop = html.scrollTop;
  const maxScrollTop = currSectionOffSet.bottom;
  //scroll fraction per section
  const scrollFraction = Math.max(
    0.0001,
    getPercentage(scrollTop, currSectionOffSet.top, maxScrollTop),
  );

  modifySections(scrollFraction, currSection);
});

function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.scrollX || document.documentElement.scrollLeft,
    scrollTop = window.scrollY || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    bottom: rect.top + scrollTop + el.offsetHeight,
  };
}

function getCurrentSection() {
  const scrollTop = html.scrollTop;
  return sections.findIndex((section) => scrollTop <= Number(offset(section).bottom));
}

// hero animation finished when scrollFraction on hero section is 40%
function modifyHeroByFraction(scrollFraction) {
  let percent = getPercentage(Math.min(0.4, scrollFraction), 0, 0.4);
  let opacity = Math.max(0, 1 - percent);
  let size = 1 + 0.5 * scrollFraction;
  if (opacity > 0.0001)
    document.getElementById(
      "hero-maintext",
    ).style.transform = `matrix(${size}, 0, 0, ${size}, 0, 0)`;
  document.getElementById("hero-maintext").style.opacity = opacity;
  document.getElementById("all-new").style.opacity = opacity;
  document.getElementById("watch-links").style.opacity = opacity < 0.5 ? opacity : 1;

  // modify hero payoff section
  // todo gradual opacity
  if (scrollFraction > 0.4 && scrollFraction < 0.6) {
    document.getElementById("hero-payoff").style.opacity = 1;
    document.getElementById("hero-payoff").style.transform = `matrix(${size - 0.2}, 0, 0, ${
      size - 0.2
    }, 0, 0)`;
  } else {
    document.getElementById("hero-payoff").style.opacity = 0;
  }
}
// hero animation finished when scrollFraction on hero section is 80%
function modifyAirpodsAnimation(scrollFraction) {
  let percent = getPercentage(Math.min(0.8, scrollFraction), 0, 0.5);

  const frameIndex = Math.min(heroMaxFrame - 1, Math.floor(percent * heroMaxFrame));
  window.requestAnimationFrame(() => updateImage(frameIndex + 1));
}

function modifyGuts(scrollFraction) {
  let MAX_SCROLL_TEXT_APPEARANCE = 0.22;
  let guts1 = document.getElementById("img-guts-1");
  let guts2 = document.getElementById("img-guts-2");
  let imgPod = document.getElementById("img-pod");
  let podParticles = document.getElementById("airpods-particles");
  const gutsTextBottom = 200;
  if (scrollFraction < 0.25) {
    guts1.style.opacity = 1;
    guts2.style.opacity = 0;
    imgPod.style.opacity = 0;
    podParticles.classList.remove("scale-100");
    podParticles.classList.add("scale-125");

    let percent = getPercentage(scrollFraction, 0, 0.25);
    let text1 = document.getElementById("guts-1-1");
    let text2 = document.getElementById("guts-1-2");
    // TODO polish values here
    let guts1PercentScrolled = getPercentage(Math.max(0, Math.min(1 - 0.5, percent)), 0, 0.5);
    let guts2PercentScrolled = getPercentage(Math.max(0, Math.min(1 - 0.5, percent - 0.4)), 0, 0.5);
    console.log(`translateY(${gutsTextBottom - gutsTextBottom * guts1PercentScrolled * 2}px)`);
    text1.style.transform = `translateY(${
      gutsTextBottom - gutsTextBottom * guts1PercentScrolled * 2
    }px)`;

    text1.style.opacity =
      guts1PercentScrolled < MAX_SCROLL_TEXT_APPEARANCE
        ? guts1PercentScrolled
        : guts1PercentScrolled > 1 - MAX_SCROLL_TEXT_APPEARANCE
        ? 1 - guts1PercentScrolled
        : 1;

    text2.style.opacity =
      guts2PercentScrolled < MAX_SCROLL_TEXT_APPEARANCE
        ? guts2PercentScrolled
        : guts2PercentScrolled > 1 - MAX_SCROLL_TEXT_APPEARANCE
        ? 1 - guts2PercentScrolled
        : 1;

    text2.style.transform = `translateY(${
      gutsTextBottom - gutsTextBottom * guts2PercentScrolled * 2
    }px)`;

    console.log(percent, guts1PercentScrolled, guts2PercentScrolled);

    // console.log(percent);
  } else if (scrollFraction > 0.25 && scrollFraction < 0.5) {
    guts1.style.opacity = 0;
    guts2.style.opacity = 1;
    imgPod.style.opacity = 0;
    podParticles.classList.remove("scale-100");
    podParticles.classList.add("scale-125");
    let text3 = document.getElementById("guts-2-1");
    let percent = getPercentage(scrollFraction - 0.25, 0, 0.25);
    text3.style.transform = `translateY(${gutsTextBottom - gutsTextBottom * percent * 2}px)`;
    text3.style.opacity =
      percent < MAX_SCROLL_TEXT_APPEARANCE
        ? percent
        : percent > 1 - MAX_SCROLL_TEXT_APPEARANCE
        ? 1 - percent
        : 1;
    // console.log(percent);
  } else if (scrollFraction > 0.5) {
    guts1.style.opacity = 0;
    guts2.style.opacity = 0;
    podParticles.style.opacity = imgPod.style.opacity = 1;
    podParticles.classList.add("scale-100");
    podParticles.classList.remove("scale-125");
    let percent = getPercentage(scrollFraction - 0.5, 0, 0.25);
    let podOpacity = getPercentage(percent, 0.4, 0.6);
    imgPod.style.opacity = podParticles.style.opacity = 1 - podOpacity;
    console.log(percent, podOpacity);
  }
}

function modifySections(scrollFraction, currSection) {
  if (currSection == 0) {
    modifyHeroByFraction(scrollFraction);
    modifyAirpodsAnimation(scrollFraction);
    document.getElementById("video-dancer-container").style.opacity =
      scrollFraction >= 0.6 && scrollFraction < 0.99 ? 1 : 0;
  }

  if (currSection == 1) {
    document.getElementById("video-dancer-container").style.opacity = 0;
  }

  if (currSection == 2) {
    modifyGuts(scrollFraction);
  }
}

function getPercentage(val, min, max) {
  return (val - min) / (max - min);
}

setInterval(() => {
  let circle = document.getElementById("touch-control-circle");
  let MAX_ITERATIONS = 20;
  let PAUSE_ITERATIONS = 10;
  let MAX_DY = 200;
  let iterations = 0;
  let currPauseIterations = 0;

  let swipe = setInterval(() => {
    iterations++;

    if (iterations == MAX_ITERATIONS / 2 + 1 && currPauseIterations < PAUSE_ITERATIONS) {
      currPauseIterations++;
      iterations--; // negate iterations
      return;
    }

    if (iterations <= MAX_ITERATIONS) {
      // swipe down\
      let percentDone = getPercentage(iterations, 0, MAX_ITERATIONS / 2);
      circle.style.transform = `matrix(1, 0, 0, 1, 0, ${percentDone * MAX_DY})`;
      circle.style.opacity = 1 - percentDone;
    }

    if (iterations > MAX_ITERATIONS / 2) {
      // swipe up
      let percentDone = getPercentage(iterations, MAX_ITERATIONS / 2, MAX_ITERATIONS);
      circle.style.transform = `matrix(1, 0, 0, 1, 0, ${MAX_DY - percentDone * MAX_DY * 1.2})`;
      circle.style.opacity = 1 - percentDone;
    }

    if (iterations >= MAX_ITERATIONS) {
      clearInterval(swipe);
    }
  }, 50);
}, 5000);

// https://codepen.io/braydoncoyer/pen/rNxwgjq
