/**
 * 获取元素的高度, 包括边距, 边框.
 */
export function outerHeight(elm) {
  let height = elm && elm.offsetHeight;
  const style = elm && window.getComputedStyle(elm);
  if (elm) {
    height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10);
    return height;
  }
  return 0;
}

// 获得当前视口的高度.
// 改高度不包含滚动条的高度.
export function getViewportHeight() {
  return window.innerHeight;
}

// 占位符方法或者函数.
export function empty() {
  return '';
}

// 检测元素是否全部在范围内.
export function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.width > 0 &&
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

