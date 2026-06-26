export function getPixelRatio() {
  const max = window.matchMedia('(max-width: 768px)').matches ? 1.5 : 2;
  return Math.min(window.devicePixelRatio, max);
}

export function getWinSize() {
  return {
    wd: window.innerWidth,
    wh: document.documentElement.clientHeight,
  };
}

export function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function wrapZ(value, depth) {
  return ((value % depth) + depth) % depth - depth;
}
