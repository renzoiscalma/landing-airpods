export function getCurrentViewportSize() {
  if (window.innerWidth >= 1068) {
    return "l";
  } else if (window.innerWidth >= 640) {
    return "m";
  } else return "s";
}

export function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.scrollX || document.documentElement.scrollLeft,
    scrollTop = window.scrollY || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft,
    bottom: rect.top + scrollTop + el.offsetHeight,
  };
}

export function getPercentage(val, min, max) {
  return (val - min) / (max - min);
}

export function computeOpacity(val, min, max) {
  return val > min ? (val < max ? getPercentage(val, min, max) : 1 - getPercentage(val, min, max)) : 0;
}

export function computeTransformYMatrix(scrollFraction, base, max, limit) {
  if (limit) {
    if (scrollFraction >= 1) return `matrix(1, 0, 0, 1, 0, ${max})`;
    if (scrollFraction <= base) return `matrix(1, 0, 0, 1, 0, ${base})`;
  }
  return `matrix(1, 0, 0, 1, 0, ${base + scrollFraction * max})`;
}

export function computeTransformXMatrix(scrollFraction, base, max, limit) {
  if (limit) {
    if (scrollFraction >= 1) return `matrix(1, 0, 0, 1, ${max}, 0)`;
    if (scrollFraction <= base) return `matrix(1, 0, 0, 1, ${base}, 0)`;
  }
  return `matrix(1, 0, 0, 1, ${base + scrollFraction * max}, 0)`;
}
