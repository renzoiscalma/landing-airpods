let heroCurrentFrame = 1;
let heroMaxFrame = 64;
const html = document.documentElement;
const hero = document.getElementById("hero");

const section1 = document.getElementById("section-1");
const section2 = document.getElementById("section-2");
const section3 = document.getElementById("section-3");

const sections = [hero, section1, section2, section3];
const sectionsContent = [
  document.getElementById("hero-content"),
  document.getElementById("section-1-content"),
  document.getElementById("section-2-content"),
  document.getElementById("section-3-content"),
];

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
  const maxScrollTop = currSectionOffSet.bottom - 1500;
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
  return sections.findIndex(
    (section) => scrollTop <= Number(offset(section).bottom),
  );
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
  document.getElementById("watch-links").style.opacity =
    opacity < 0.5 ? opacity : 1;
}

function modifySections(scrollFraction, currSection) {
  if (currSection == 0) {
    const frameIndex = Math.min(
      heroMaxFrame - 1,
      Math.floor(scrollFraction * heroMaxFrame),
    );
    modifyHeroByFraction(scrollFraction);
    window.requestAnimationFrame(() => updateImage(frameIndex + 1));
  }
}

function getPercentage(val, min, max) {
  return (val - min) / (max - min);
}

// https://codepen.io/braydoncoyer/pen/rNxwgjq
