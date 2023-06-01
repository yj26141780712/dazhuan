export  function convertToRGBA(rgbString:string, opacity:number) {
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