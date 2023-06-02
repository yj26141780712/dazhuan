// 边框
import p2 from 'p2';
import { Box } from 'sat';
import Game from './game';

interface BorderOption {
    ctx: CanvasRenderingContext2D;
    world: p2.World;
}

export class Border {

    color = '#000';
    ctx: CanvasRenderingContext2D;
    speed = 4;
    direction = 0;

    borders: p2.Body[] = [];
    world: p2.World;
    constructor(option: BorderOption) {
        this.ctx = option.ctx;
        this.world = option.world;
        // 左
        const leftShape = new p2.Box({
            width: Game.borderWidth,
            height: Game.height,
        })
        this.borders[0] = new p2.Body({
            mass:0,
            position: [0, 0]
        })
        this.borders[0].addShape(leftShape);
        this.world.addBody(this.borders[0]);
        // 上
        const topShape = new p2.Box({
            width: Game.width,
            height: Game.borderWidth,
        })
        this.borders[1] = new p2.Body({
            mass:0,
            position: [0, 0]
        })
        this.borders[1].addShape(topShape);
        this.world.addBody(this.borders[1]);
        // 右
        const rightShape = new p2.Box({
            width: Game.borderWidth,
            height: Game.height,
        })
        this.borders[2] = new p2.Body({
            mass:0,
            position: [Game.width - Game.borderWidth, 0]
        })
        this.borders[2].addShape(rightShape);
        this.world.addBody(this.borders[2]);
    }

    init() {

    }

    draw() {
        this.borders.forEach(x => {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(x.position[0], x.position[1],
                (x.shapes[0] as p2.Box).width, (x.shapes[0] as p2.Box).height);
        })
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