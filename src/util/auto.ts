//自动适应
export function getScale(height: number, width: number, cHeight: number, cWidth: number) {
    let scale = 1
    console.log(cHeight / cWidth>= height / width)
    if (cHeight / cWidth>= height / width ) { //上下留黑边
        scale = cWidth / width;
    } else {
        scale = cHeight / height; // 左右留黑边
    }
    return scale;
}