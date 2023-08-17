import { computeOpacity, getCurrentViewportSize, getPercentage } from "./helper.js";

export default class Hero {
  constructor(viewPortSize) {
    this.canvasImg = new Image();
    this.airpodsCanvas = document.getElementById("airpods-hero-canvas");
    this.context = this.airpodsCanvas.getContext("2d");
    this.heroMaxFrame = { s: 64, m: 64, l: 64 };
    this.loadedImages = { s: false, m: false, l: false };
    this.calledLoadImages = { s: false, m: false, l: false };
    this.loadedRemaining = { s: 64, m: 64, l: 64 };
    this.canvasImg;
    this.images = {
      s: new Array(92),
      m: new Array(64),
      l: new Array(64),
    };
    this.currentFrame = 0;
    this.loadFirstImageFrame(viewPortSize);
    this.loadImageFrames(viewPortSize);
    this.updateCanvasSize();
  }

  loadImageFrames(viewPortSize) {
    if (this.calledLoadImages[viewPortSize]) return;
    for (let i = 0; i <= this.heroMaxFrame[viewPortSize]; i++) {
      if (i == 0 && this.images[viewPortSize][0]) continue;
      this.images[viewPortSize][i] = new Image();
      this.images[viewPortSize][i].src = this.getImage(i, viewPortSize);
      this.images[viewPortSize][i].onload = () => this.onImageLoad(viewPortSize);
    }
    this.calledLoadImages[viewPortSize] = true;
  }

  loadFirstImageFrame(viewPortSize) {
    this.images[viewPortSize][0] = new Image();
    this.images[viewPortSize][0].src = this.getImage(0, viewPortSize);
    this.images[viewPortSize][0].onload = () => {
      this.onImageLoad(viewPortSize);
      document.dispatchEvent(new CustomEvent("firstImageLoaded"));
      this.draw(0);
    };
  }

  onImageLoad(viewPortSize) {
    if (this.loadedImages[viewPortSize]-- == 0) {
      this.loadedImages[viewPortSize] = true;
    }
  }

  getImage(frame, viewPortSize) {
    let viewPortSizeStr = "";
    let fileExt = "";
    switch (viewPortSize) {
      case "s":
      case "m":
        viewPortSizeStr = "medium";
        fileExt = "png";
        break;
      case "l":
        viewPortSizeStr = "large";
        fileExt = "png";
        break;
      default:
        break;
    }
    return `https://www.apple.com/105/media/us/airpods-pro/2022/d2deeb8e-83eb-48ea-9721-f567cf0fffa8/anim/hero/${viewPortSizeStr}/${frame
      .toString()
      .padStart(4, "0")}.${fileExt}`;
  }

  draw(frame, viewPortSize) {
    this.context.clearRect(0, 0, this.airpodsCanvas.width, this.airpodsCanvas.height);
    this.context.drawImage(this.images[viewPortSize][frame], 0, 0);
  }

  draw() {
    this.context.clearRect(0, 0, this.airpodsCanvas.width, this.airpodsCanvas.height);
    this.context.drawImage(this.images[getCurrentViewportSize()][this.currentFrame], 0, 0);
  }

  updateHero(scrollFraction) {
    this.modifyHeroByFraction(scrollFraction);
    this.modifyAirpodsAnimation(scrollFraction);
  }

  // hero animation finished when scrollFraction on hero section is 40%
  modifyHeroByFraction(scrollFraction) {
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
    document.getElementById("hero-payoff").style.opacity =
      scrollFraction > 0.6 ? 0 : computeOpacity(scrollFraction, 0.4, 0.6);
    if (scrollFraction > 0.4 && scrollFraction < 0.6) {
      document.getElementById("hero-payoff").style.transform = `matrix(${size - 0.2}, 0, 0, ${
        size - 0.2
      }, 0, 0)`;
    }
  }

  // hero animation finished when scrollFraction on hero section is 80%
  modifyAirpodsAnimation(scrollFraction) {
    let percent = getPercentage(Math.min(0.8, scrollFraction), 0, 0.5);
    let heroMaxFrame = this.heroMaxFrame[getCurrentViewportSize()];

    this.currentFrame = Math.min(heroMaxFrame, Math.floor(percent * heroMaxFrame));
    window.requestAnimationFrame(() => this.draw(this.currentFrame + 1, getCurrentViewportSize()));
  }

  endHero() {
    this.updateHero(1);
  }

  resized() {
    let viewPortSize = getCurrentViewportSize();
    this.updateCanvasSize();
    this.loadImageFrames(viewPortSize);
    if (!this.images[viewPortSize][this.currentFrame].complete) {
      this.images[viewPortSize][this.currentFrame].onload = () => {
        window.requestAnimationFrame(() => this.draw(this.currentFrame, getCurrentViewportSize()));
      };
    } else {
      window.requestAnimationFrame(() => this.draw(this.currentFrame, getCurrentViewportSize()));
    }
  }

  updateCanvasSize() {
    let viewPortSize = getCurrentViewportSize();
    switch (viewPortSize) {
      case "s":
      case "m":
        this.airpodsCanvas.width = 1068;
        this.airpodsCanvas.height = 600;
        break;
      case "l":
        this.airpodsCanvas.width = 1440;
        this.airpodsCanvas.height = 810;
        break;
      default:
        break;
    }
  }
}
