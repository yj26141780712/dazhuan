//砖块

interface RectOption {
    x:number;
    y:number;
    color:string;
}

export class Brick {
    ctx: CanvasRenderingContext2D;
    sums: RectOption[] = [];
    height = 15;
    width = 40;
    rowNum = 8;
    row = 6;
    startX = 40;
    startY = 40;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    init() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.rowNum; j++) {
                this.sums.push({
                    x: this.startX + this.width * j,
                    y: this.startY + this.height * i,
                    color:`rgb(${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)},${Math.ceil(Math.random()*255)})`
                });
            }
        }
        this.draw();
    }

    drawRect(x:RectOption) {

    }

    draw() {
        console.log(this.sums);
        this.sums.forEach(rect => {
            if (rect) {
                this.ctx.fillStyle = rect.color;
                this.ctx.fillRect(rect.x,rect.y,this.width,this.height);
            }
        })
    }
}