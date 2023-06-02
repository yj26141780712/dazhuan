//砖块
import { Bezier } from "bezier-js";
// import SAT from 'sat';
import p2 from 'p2';
import { convertToRGBA, getRandomRgb } from "../util/dom";

interface BrickOption {
    ctx: CanvasRenderingContext2D;
    world: p2.World;
    mass: number;
    rowNum: number;
    row: number;
    height: number;
    width: number;
}

interface RectOption {
    startPos: [number, number];
    color: string;
    opacity: number;
    t: number;
    rectBody: p2.Body;
}

export class Brick {

    ctx: CanvasRenderingContext2D;
    sums: RectOption[] = [];
    startX = 40;
    startY = 40;
    width = 40;
    height = 15;
    rowNum = 8;
    row = 6;
    mass = 0;
    removeIndexs: number[] = [];
    removeSpeed = 0.05;
    world: p2.World;
    bezier = new Bezier([0, 0, 0, 0, .58, 1, 1, 1])
    constructor(option: BrickOption) {
        this.ctx = option.ctx;
        this.world = option.world;
        this.width = option.width;
        this.height = option.height;
        this.rowNum = option.rowNum;
        this.row = option.row;
        this.mass = option.mass;
        this.createBricks();
    }

    createBricks() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.rowNum; j++) {
                const x = this.startX + this.width * j;
                const y = this.startY + this.height * i;
                const rectBody = new p2.Body({
                    mass: 1,
                    position: [x, y],
                    angle: 0
                });
                var rectangleShape = new p2.Box({
                    width: this.width,
                    height: this.height
                });
                rectBody.type = p2.Body.STATIC;
                rectBody.addShape(rectangleShape);
                this.world?.addBody(rectBody);
                this.sums.push({
                    startPos: [x, y],
                    color: getRandomRgb(),
                    opacity: 1,
                    t: 0,
                    rectBody
                });
            }
        }
    }

    init() {
        this.removeIndexs = [];
        this.sums.forEach(x => {
            x.opacity = 1;
            x.t = 0;
            x.color = getRandomRgb(),
                x.rectBody.position = [...x.startPos];
        })
    }

    draw() {
        this.sums.forEach((rect, index) => {
            if (this.removeIndexs.includes(index)) {
                rect.t = rect.t + 0.02;
                if (rect.t > 1) {
                    return;
                }
            }
            const opacity = 1 - this.bezier.get(rect.t).y;
            this.ctx.fillStyle = convertToRGBA(rect.color, opacity);
            this.ctx.fillRect(rect.rectBody.position[0], rect.rectBody.position[1], this.width, this.height);
        })
    }

    update() {
        this.draw();
    }

}