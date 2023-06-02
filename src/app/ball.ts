import Game from "./game";
// import SAT from 'sat';
import p2 from 'p2';

interface BallOption {
    ctx: CanvasRenderingContext2D;
    world: p2.World;
    startPos?: [number, number];
    radius?: number;
    mass?: number;
}

type CircleWithRadius = p2.Circle & { radius: number };

// 球
export class Ball {

    ctx: CanvasRenderingContext2D;
    color: string = 'red';
    circleBody: p2.Body;
    circleShape: CircleWithRadius; // 创建圆形形状
    world: p2.World;
    constructor(option: BallOption) {
        this.ctx = option.ctx;
        this.world = option.world;
        this.circleBody = new p2.Body({
            mass:1,
            position: option.startPos ? [...option.startPos] : [0, 0],
        });
        this.circleBody.type = p2.Body.STATIC;
        this.circleBody.velocity = [200,-200];
        this.circleShape = new p2.Circle({ radius: option.radius || 20 })
        this.circleBody.addShape(this.circleShape);
        this.world.addBody(this.circleBody)
        this.init();
    }

    init() {

    }

    update() {
        this.draw()
    }

    draw() {
        if (this.circleBody) {
            this.ctx.beginPath();
            console.log(this.circleBody.position)
            this.ctx.arc(this.circleBody.position[0], this.circleBody.position[1],
                this.circleShape?.radius as number, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

    }
}