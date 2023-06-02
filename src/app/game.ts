import { Ball } from "./ball";
import { Brick } from "./brick";
import { Racket } from "./racket";
import { getScale } from "../util/auto";
// import SAT from 'sat';
import { getEventPosition, isPC, isTouchEvent } from "../util/dom";
import { DragService } from "../service/dragService";
import p2 from 'p2';
import { Border } from "./border";

export default class Game {

    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;
    private static container: HTMLElement;
    private static touchArea: HTMLElement;
    private static ball: Ball;
    private static brick: Brick;
    private static racket: Racket;
    private static border: Border;
    private static starting = false;
    private static leftDown = false;
    private static rightDown = false;
    private static dragService = new DragService(document);
    static height = 600;
    static width = 400;
    static bottomHeight = 20;
    static borderWidth = 20;
    static borderColor = '#000';
    static isMouseDown = false;
    static startPoint = { x: 0, y: 0 };
    static world = new p2.World();
    static ballRadius = 20;
    static brickHeight = 15;
    static brickWidth = 40;
    static brickRow = 6;
    static brickRowNum = 8;
    static racketHeight = 10;
    static racketWidth = 80;
    private constructor() {

    }

    public static init(id: string) {
        this.container = document.getElementById('container') as HTMLElement;
        this.container.style.background = `url(/assets/test.png)`;
        if (this.container) {
            this.container.style.height = this.height + 'px';
            this.container.style.width = this.width + 'px';
            this.resize();
        }
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        if (this.canvas) {
            this.canvas.height = this.height;
            this.canvas.width = this.width;
        }
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        //墙壁
        this.border = new Border({
            ctx: this.ctx,
            world: this.world, 
        });
        //球拍
        this.racket = new Racket({
            ctx: this.ctx,
            world: this.world,
            startPos: [
                this.width / 2 - this.racketWidth / 2,
                this.height - this.bottomHeight - this.racketHeight
            ],
            height: this.racketHeight,
            width: this.racketWidth,
            mass: 0
        });
        //球
        this.ball = new Ball({
            ctx: this.ctx,
            world: this.world,
            startPos: [
                this.width / 2,
                this.height - this.bottomHeight - this.racketHeight - this.ballRadius
            ],
            mass: 0,
            radius: this.ballRadius
        });
        //砖块
        this.brick = new Brick({
            ctx: this.ctx,
            world: this.world,
            height: this.brickHeight,
            width: this.brickWidth,
            row: this.brickRow,
            rowNum: this.brickRowNum,
            mass: 0,
        });
        // window.addEventListener('keydown', this.keyDownEvent);
        // window.addEventListener('keyup', this.keyUpEvent);
        window.addEventListener('resize', this.resize);
        const startBtn = document.getElementById('start');
        const ispc = isPC();
        if (ispc) {
            startBtn?.addEventListener('mousedown', this.start);
        } else {
            startBtn?.addEventListener('touchstart', this.start);
        }
        // this.touchArea = document.getElementById('touch') as HTMLElement;
        // if (ispc) {
        //     this.touchArea.addEventListener('mousedown', this.mousedown);
        // } else {
        //     this.touchArea.addEventListener('touchstart', this.mousedown);
        // }
        //碰撞检测
        this.world.on("beginContact", this.beginContact)
    }

    public static mousedown = (ev: MouseEvent | TouchEvent) => {
        console.log(new Date());
        const p = getEventPosition(ev);
        this.startPoint.x = p.pageX;
        this.countDirection(this.startPoint.x);
        this.isMouseDown = true;
        console.log(ev);
        this.dragService.requestDraggingSequence(ev).subscribe((delta) => {
            const x = this.startPoint.x + delta.x;
            this.countDirection(x);
        }, () => { }, () => {
            console.log('结束拖拽')
            this.isMouseDown = false;
            this.racket.direction = 0;
        });
    }

    public static countDirection(x: number) {
        if (x >= document.body.clientWidth / 2) {
            this.racket.direction = 1;
        } else {
            this.racket.direction = -1;
        }
    }

    public static keyDownEvent = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowLeft') {
            this.racket.direction = -1;
            this.leftDown = true;
        } else if (ev.key === 'ArrowRight') {
            this.racket.direction = 1;
            this.rightDown = true;
        } else {
            console.log('无效键')
        }
    }

    public static keyUpEvent = (ev: KeyboardEvent) => {
        if (ev.key === 'ArrowLeft') {
            this.leftDown = false;
            this.racket.direction = this.rightDown ? 1 : 0;
        } else if (ev.key === 'ArrowRight') {
            this.rightDown = false;
            this.racket.direction = this.leftDown ? -1 : 0;
        } else {
            console.log('无效键')
        }
    }

    public static start = (e: MouseEvent | TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.racket.init();
        this.ball.init();
        this.brick.init();
        this.starting = true;
    }

    public static end() {

    }

    public static drawBorder() {
        this.ctx.fillStyle = this.borderColor;
        this.ctx.fillRect(0, 0, this.width, this.borderWidth);
        this.ctx.fillRect(0, this.borderWidth, this.borderWidth, this.height - this.bottomHeight - this.racketHeight - this.borderWidth);
        this.ctx.fillRect(this.width - this.borderWidth, this.borderWidth, this.borderWidth, this.height - this.bottomHeight - this.racketHeight - this.borderWidth);
        this.ctx.fillRect(0, this.height - 5, this.width, 5);
    }


    public static resize = () => {
        const scale = getScale(this.height, this.width, document.body.clientHeight, document.body.clientWidth);
        this.container.style.transform = `translate(-50%,-50%) scale(${scale})`;
    }

    public static update() {
        if (Game.starting) {
            this.ctx.clearRect(0, 0, 400, 800);
            //更新边框
            this.border.update();
            //更新砖块
            this.brick.update();
            //更新球位置
            this.ball.update();
            //更新球拍
            this.racket.update();
            // //检测砖块碰撞
            // this.checkBrickColliding();
            // //检测是否胜利
            // this.checkIsWin();
            // //检测球拍碰撞
            // this.checkRacketColliding();
            // 更新物理世界
            this.world.step(1 / 60);

            // 执行其他逻辑

            // 进行碰撞检测
            // this.world.emitCollisionEvents(); // 触发碰撞事件

        }
    }

    // 碰撞检测
    public static checkBrickColliding() {
        // 判断小球是否进去砖块区域

        // 判断小球是否与砖块进行碰撞
    }

    public static checkOver() {

    }

    public static checkIsWin() {
        if (this.brick.sums.length === this.brick.removeIndexs.length) {
            this.starting = false;
        }
    }

    public static checkRacketColliding() {
        //判断小球是否进去球拍区域

    }

    public static beginContact = (event: any) => {
        // console.log(event);
        const shapeA = event.bodyA.shapes[0];
        const shapeB = event.bodyB.shapes[0];
        console.log(event);
    }

}
