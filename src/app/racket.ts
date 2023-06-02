// 球拍
// import SAT from 'sat';
import Game from './game';
import p2 from 'p2';

interface RacketOption {
    ctx: CanvasRenderingContext2D;
    world: p2.World;
    startPos: [number, number];
    height: number;
    width: number;
    mass?: number;
}

export class Racket {

    color = '#000';
    ctx: CanvasRenderingContext2D;
    speed = 4;
    direction = 0;
    rectBody: p2.Body;
    rectShape: p2.Box; // 创建矩形形状
    world: p2.World;
    constructor(option: RacketOption) {
        this.ctx = option.ctx;
        this.world = option.world;
        this.rectBody = new p2.Body({
            mass: 1,
            position: option.startPos,
            angle: 0,
            angularVelocity:1
        })
        this.rectShape = new p2.Box({
            width: option.width,
            height: option.height
        })
        this.rectBody.addShape(this.rectShape);
    }

    init() {

    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.rectBody.position[0], this.rectBody.position[1],
            this.rectShape.width, this.rectShape.height);
    }

    update() {
        // this.x = this.x + this.speed * this.direction;
        // if (this.x > Game.width - Game.borderWidth - this.width) {
        //     this.x = Game.width - Game.borderWidth - this.width;
        // }
        // if (this.x < Game.borderWidth) {
        //     this.x = Game.borderWidth;
        // }
        // this.rectBody.position[0] = this.x;
        // console.log(this.x, this.direction)
        this.draw();
    }
}