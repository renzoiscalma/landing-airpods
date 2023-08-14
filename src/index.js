let heroMaxFrame = 64;
let lastScrollTop = 0;
let scrollUp = false;
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

function isScrollUp() {
  return scrollUp;
}

document.addEventListener("scroll", function () {
  const currSection = getCurrentSection();
  if (currSection == -1) return;
  const currSectionOffSet = offset(sections[currSection]);
  const scrollTop = html.scrollTop;
  const maxScrollTop = currSectionOffSet.bottom;
  const percentScrolledOfSection = getPercentage(scrollTop, currSectionOffSet.top, maxScrollTop);
  const scrollFraction = Math.max(0.0001, percentScrolledOfSection);
  scrollUp = scrollTop < lastScrollTop;
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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

  if (currSection == 4) {
    let caseVideoContainer = document.getElementById("case-video");
    let caseVideoOffset = offset(caseVideoContainer);
    if (window.scrollY > caseVideoOffset.top) {
      let caseVideoScrolled = getPercentage(
        window.scrollY,
        caseVideoOffset.top,
        caseVideoOffset.bottom - window.innerHeight - 200,
      );
      modifyCaseVideo(caseVideoScrolled);
    }
  }

  if (currSection == 5) {
    modifyPhoneVideo(scrollFraction);
  }
}

function getPercentage(val, min, max) {
  return (val - min) / (max - min);
}

function modifyCaseVideo(scrollFraction) {
  let video = document.getElementById("case-battery-video");
  if (!video) return;
  let VIDEO_DURATION = 5.367;
  video.currentTime = Math.min(VIDEO_DURATION, scrollFraction * VIDEO_DURATION);
  let { currentTime } = video;
  console.log(currentTime);
  let textShowBreakpoints = [1.5, 2.8, 4.1, 5.3];
  let textHideBreakpoints = [1.5, 3.8];
  let text1 = document.getElementById("case-feat-1");
  let text2 = document.getElementById("case-feat-2");
  let text3 = document.getElementById("case-feat-3");
  let text4 = document.getElementById("case-feat-4");
  let text1Opacity = getPercentage(currentTime, 0, 1.5);
  text1.style.opacity = 1 - text1Opacity;

  text2.style.opacity =
    currentTime >= 2
      ? currentTime <= 2.8
        ? getPercentage(currentTime, 2, 2.8)
        : 1 - getPercentage(currentTime, 3.1, 3.8)
      : 0;

  text3.style.opacity =
    currentTime >= 3.7
      ? currentTime <= 4.0
        ? getPercentage(currentTime, 3.7, 4.0)
        : 1 - getPercentage(currentTime, 4.3, 5.2)
      : 0;

  text4.style.opacity = currentTime >= 4.9 ? getPercentage(currentTime, 4.9, 5.367) : 0;
}

function modifyPhoneVideo(scrollFraction) {
  let phoneVideo = document.getElementById("phone-video");
  let phoneVideoContainer = document.getElementById("phone-video-container");
  let caseBlinker = document.getElementById("case-blinker");
  let phoneVideoContainerOffset = offset(phoneVideoContainer);
  if (
    window.scrollY > phoneVideoContainerOffset.top - 300 &&
    window.scrollY < phoneVideoContainerOffset.top
  ) {
    setupPhoneVideoStartup();
  } else if (window.scrollY > phoneVideoContainerOffset.top) {
    phoneVideoContainer.style.opacity = 1;
    let videoContainerPercentScrolled = getPercentage(
      window.scrollY,
      phoneVideoContainerOffset.top,
      phoneVideoContainerOffset.bottom - window.innerHeight,
    );
    phoneVideoScrolling(videoContainerPercentScrolled);
  }
}

function setupPhoneVideoStartup() {
  let phoneVideo = document.getElementById("phone-video");
  let phoneVideoContainer = document.getElementById("phone-video-container");
  let caseBlinker = document.getElementById("case-blinker");
  let phoneText1 = document.getElementById("phone-text-1");
  let phoneVideoContainerOffset = offset(phoneVideoContainer);

  let phoneVideoScrolled = getPercentage(
    window.scrollY,
    phoneVideoContainerOffset.top - 300,
    phoneVideoContainerOffset.top,
  );

  if (phoneVideoScrolled <= 0.1) {
    phoneVideo.pause();
    phoneVideo.currentTime = 0;
    phoneVideoContainer.style.opacity = 0;
    caseBlinker.classList.remove("animate-airpods-connecting");
  }

  if (phoneVideoScrolled >= 0.8 && phoneVideo.currentTime == 0) {
    phoneVideo.play();
    caseBlinker.classList.add("animate-airpods-connecting");
  }

  phoneVideoContainer.style.opacity = phoneText1.style.opacity = phoneVideoScrolled;
  phoneText1.style.transform = `matrix(1, 0, 0, 1, 0, ${phoneVideoScrolled * -135})`;
}

document.getElementById("phone-video").addEventListener("ended", function () {
  document.getElementById("replay-container").style.opacity = 1;
});

function phoneVideoScrolling(scrollFraction) {
  let caseBlinker = document.getElementById("case-blinker");
  let phoneVideo = document.getElementById("phone-video");
  let phoneMusic = document.getElementById("phone-music");
  let phoneText1 = document.getElementById("phone-text-1");
  let phoneText2 = document.getElementById("phone-text-2");

  // modify videos and airpod case blinking animation
  if (isScrollUp() && scrollFraction >= 0.8) {
    phoneVideo.play();
    document.getElementById("replay-container").style.opacity = 0;
  } else if (scrollFraction >= 0.9) {
    caseBlinker.classList.remove("animate-airpods-connecting");
    phoneMusic.style.opacity = 1;
  } else {
    caseBlinker.classList.add("animate-airpods-connecting");
    phoneMusic.style.opacity = 0;
  }

  // modify texts
  if (scrollFraction > 0.6) {
    phoneText1.style.opacity = 0;
  } else if (scrollFraction > 0.15) {
    phoneText1.style.opacity = 1 - computeOpacity(scrollFraction, 0.15, 0.6);
    phoneText1.style.transform = computeTransformYMatrix(scrollFraction - 0.15, -135, -180, true);
  } else {
    phoneText1.style.opacity = 1;
  }

  phoneText2.style.opacity = scrollFraction > 0.95 ? 1 : computeOpacity(scrollFraction, 0.6, 1);
  phoneText2.style.transform = computeTransformYMatrix(scrollFraction, 0, -135, true);
}

function computeOpacity(val, min, max) {
  return val > min
    ? val < max
      ? getPercentage(val, min, max)
      : 1 - getPercentage(val, min, max)
    : 0;
}

function computeTransformYMatrix(scrollFraction, base, max, limit) {
  if (limit) {
    if (scrollFraction >= 1) return `matrix(1, 0, 0, 1, 0, ${max})`;
    if (scrollFraction <= base) return `matrix(1, 0, 0, 1, 0, ${base})`;
  }
  return `matrix(1, 0, 0, 1, 0, ${base + scrollFraction * max})`;
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

function replayConnectingVideo() {
  let phoneVideo = document.getElementById("phone-video");
  phoneVideo.currentTime = 0;
  phoneVideo.play();
}

// https://codepen.io/braydoncoyer/pen/rNxwgjq
