import { Ball } from "./ball";
import { Brick } from "./brick";
import { Racket } from "./racket";
import { getScale } from "./util/auto";
import SAT from 'sat';
import { getEventPosition, isPC, isTouchEvent } from "./util/dom";
import { DragService } from "./service/dragService";

export default class Game {

    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;
    private static container: HTMLElement;
    private static touchArea: HTMLElement;
    private static ball: Ball;
    private static brick: Brick;
    private static racket: Racket;
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
        //球拍
        this.racket = new Racket(this.ctx);
        this.racket.init({ x: this.width / 2 - this.racket.width / 2, y: this.height - this.bottomHeight - this.racket.height });
        //球
        this.ball = new Ball(this.ctx);
        this.ball.init({ x: this.width / 2, y: this.height - this.bottomHeight - this.racket.height - this.ball.radius });
        //砖块
        this.brick = new Brick(this.ctx);
        this.brick.init();
  
        window.addEventListener('keydown', this.keyDownEvent);
        window.addEventListener('keyup', this.keyUpEvent);
        window.addEventListener('resize', this.resize);
        const startBtn = document.getElementById('start');
        const ispc = isPC();
        if(ispc) {
            startBtn?.addEventListener('mousedown', this.start);
        } else {
            startBtn?.addEventListener('touchstart', this.start);
        }
        this.touchArea = document.getElementById('touch') as HTMLElement;
        if(ispc) {
            this.touchArea.addEventListener('mousedown', this.mousedown);
        } else {
            this.touchArea.addEventListener('touchstart', this.mousedown);
        }
        this.drawBorder();
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

    public static start = (e:MouseEvent | TouchEvent) => {
        e.stopPropagation();
        e.preventDefault();
        this.racket.init({ x: this.width / 2 - this.racket.width / 2, y: this.height - this.bottomHeight - this.racket.height });
        //球
        this.ball.init({ x: this.width / 2, y: this.height - this.bottomHeight - this.racket.height - this.ball.radius });
        //砖块
        this.brick.init();
        this.starting = true;
    }

    public static end() {

    }

    public static drawBorder() {
        this.ctx.fillStyle = this.borderColor;
        this.ctx.fillRect(0, 0, this.width, this.borderWidth);
        this.ctx.fillRect(0, this.borderWidth, this.borderWidth, this.height - this.bottomHeight - this.racket.height - this.borderWidth);
        this.ctx.fillRect(this.width - this.borderWidth, 20, 20, this.height - this.bottomHeight - this.racket.height - this.borderWidth);
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
            this.drawBorder();
            //更新砖块
            this.brick.update();
            //更新球位置
            this.ball.update();
            //更新球拍
            this.racket.update();
            //检测砖块碰撞
            this.checkBrickColliding();
            //检测是否胜利
            this.checkIsWin();
            this.checkRacketColliding();
            //检测球拍碰撞
            this.racket.update();
        }
    }

    // 碰撞检测
    public static checkBrickColliding() {
        // 判断小球是否进去砖块区域

        // 判断小球是否与砖块进行碰撞
        var response = new SAT.Response();
        for (let i = 0; i < this.brick.sums.length; i++) {
            const rect = this.brick.sums[i];
            if (!this.brick.removeIndexs.includes(i)) {
                this.brick.rect.pos.x = rect.x;
                this.brick.rect.pos.y = rect.y;
                var isColliding = SAT.testCirclePolygon(this.ball.circle, this.brick.rect, response);
                if (isColliding) {
                    this.brick.removeIndexs.push(i);
                    this.ball.vy = -this.ball.vy;
                    break;
                }
            }
        }
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
        if (this.ball.y > this.height - this.bottomHeight - this.racket.height - this.ball.radius) {
            var response = new SAT.Response();
            var isColliding = SAT.testCirclePolygon(this.ball.circle, this.racket.rect, response);
            if (isColliding) {
                this.ball.vy = -this.ball.vy;
            } else {
                this.starting = false;
                console.log('game over');
            }
        }
    }

}
