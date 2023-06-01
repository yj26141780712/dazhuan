import { Ball } from "./Ball";
import { Brick } from "./Brick";
import { Racket } from "./Racket";
import { getScale } from "./util/auto";
import SAT from 'sat';

export default class Game {

    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;
    private static container: HTMLElement;
    private static ball: Ball;
    private static brick: Brick;
    private static racket: Racket;
    private static starting = false;
    private static leftDown = false;
    private static rightDown = false;
    static height = 600;
    static width = 400;
    static bottomHeight = 20;
    static borderWidth = 20;
    static borderColor = '#000';

    private constructor() {

    }

    public static init(id: string) {
        this.container = document.getElementById('container') as HTMLElement;
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
        console.log('123')
        document.addEventListener('keydown', this.keyDownEvent);
        document.addEventListener('keyup', this.keyUpEvent);
        // document.addEventListener('keydown', this.keyEvent);
        window.addEventListener('resize', this.resize);
        const startBtn = document.getElementById('start');
        startBtn?.addEventListener('click', this.start);
        this.drawBorder();
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
        // if(ev.key)
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

    public static start = () => {
        //this.ball.draw()
        this.starting = true;
        this.racket.init({ x: this.width / 2 - this.racket.width / 2, y: this.height - this.bottomHeight - this.racket.height });
        //球
        this.ball.init({ x: this.width / 2, y: this.height - this.bottomHeight - this.racket.height - this.ball.radius });
        //砖块
        this.brick.init();
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
