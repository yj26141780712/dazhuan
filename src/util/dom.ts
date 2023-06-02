export function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}


export function getEventPosition(event: MouseEvent | TouchEvent): MouseEvent | Touch {
  return isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
}

export function isPC() {
  const userAgentInfo = navigator.userAgent;
  const agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];

  for (let i = 0; i < agents.length; i++) {
    if (userAgentInfo.indexOf(agents[i]) > -1) {
      return false; // 如果用户代理字符串中包含移动设备的关键字，则判定为非PC
    }
  }

  return true; // 如果用户代理字符串中不包含移动设备的关键字，则判定为PC
}

export function getRandomRgb() {
  return `rgb(${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)})`;
}

export function convertToRGBA(rgbString: string, opacity: number) {
  rgbString = rgbString.replace(/\s/g, '');
  const colorValues = rgbString.match(/\d+/g);
  if (colorValues && colorValues.length === 3) {
    const red = parseInt(colorValues[0], 10);
    const green = parseInt(colorValues[1], 10);
    const blue = parseInt(colorValues[2], 10);
    const rgbaString = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    return rgbaString;
  }
  return '';
}

