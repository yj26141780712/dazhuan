import Game from "./Game";

// 球
export class Ball {
    x: number = 0;
    y: number = 0;
    radius: number = 20;
    ctx: CanvasRenderingContext2D;
    color: string = 'red';
    vx = 0; // x方向速度
    vy = 0; // y方向速度
    // angle = 60; // 角度
    // direction = 1; //方向
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    init({ x = 0, y = 0 }) {
        // 初始化位置
        this.x = x;
        this.y = y;
        this.update();
        this.draw();
        this.vx = 5;
        this.vy = 5;
    }

    update(){
        this.x = this.x + this.vx;
        this.y = this.y + this.vy;
        if(this.x > (Game.width - Game.borderWidth - this.radius) || this.x < (Game.borderWidth+this.radius)) {
            this.vx =  -this.vx;
        }
        if(this.y > (Game.height - Game.bottomHeight - Game.racketHeight - this.radius) || this.y < (Game.borderWidth + this.radius)){
            this.vy = - this.vy;
        }
        this.draw()
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}