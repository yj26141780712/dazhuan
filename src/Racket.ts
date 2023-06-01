// 球拍
import SAT from 'sat';

export class Racket {
    
    height = 10;
    width = 40;
    x = 0;
    y = 0;
    color = '#000';
    ctx: CanvasRenderingContext2D;
    rect = new SAT.Box(new SAT.Vector(), this.width, this.height).toPolygon();
    speed = 5;
    direction = 0;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    init({ x = 0, y = 0 }) {
        this.x = x;
        this.y = y;
        this.rect.pos.x = this.x;
        this.rect.pos.y = this.y;
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x = this.x + this.speed*this.direction;
        this.rect.pos.x = this.x;
        console.log(this.x,this.direction)
        this.draw();
    }
}