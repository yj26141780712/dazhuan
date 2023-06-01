//砖块

import { convertToRGBA } from "./util/common";
import { Bezier } from "bezier-js";
import SAT from 'sat';

interface RectOption {
    x: number;
    y: number;
    color: string;
    opacity: number;
    t:number
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
    removeIndexs: number[] = [];
    removeSpeed = 0.05;
    bezier = new Bezier([0, 0, 0, 0, .58, 1,1, 1])
    rect =  new SAT.Box(new SAT.Vector(0,0), this.width, this.height).toPolygon();
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    init() {
        this.sums = [];
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.rowNum; j++) {
                this.sums.push({
                    x: this.startX + this.width * j,
                    y: this.startY + this.height * i,
                    color: `rgb(${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)},${Math.ceil(Math.random() * 255)})`,
                    opacity: 1,
                    t:0
                });
            }
        }
        this.draw();
    }

    drawRect(x: RectOption) {

    }

    speedF() {
    
    }

    draw() {
        this.sums.forEach((rect, index) => {
            if (this.removeIndexs.includes(index)) {
                rect.t = rect.t +0.02;
                if (rect.t > 1) {
                    return;
                }
            }
            const opacity = 1 - this.bezier.get(rect.t).y;
            this.ctx.fillStyle = convertToRGBA(rect.color, opacity);
            this.ctx.fillRect(rect.x, rect.y, this.width, this.height);
        })
    }

    update(){
        this.draw();
    }
    
}