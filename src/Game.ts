import { Ball } from "./Ball";
import { Brick } from "./Brick";
import { Racket } from "./Racket";
import { getScale } from "./util/auto";

export default class Game {
    
    private static canvas: HTMLCanvasElement;
    private static ctx: CanvasRenderingContext2D;
    private static container: HTMLElement;
    private static ball:Ball;
    private static brick:Brick;
    private static racket:Racket;
    private static starting =false;
     static height = 600;
     static width = 400;
     static bottomHeight = 20;
     static racketHeight = 20;
     static borderWidth = 20;
     static borderColor = '#000';

    
    private constructor() {

    }



    public static init(id: string) {
        this.container = document.getElementById('container') as HTMLElement;
        if(this.container){
            this.container.style.height = this.height + 'px';
            this.container.style.width = this.width  + 'px';
            this.resize();
        }
        this.canvas = document.getElementById(id) as HTMLCanvasElement;
        if(this.canvas){
            this.canvas.height = this.height;
            this.canvas.width = this.width;
        }
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.ball = new Ball(this.ctx);
        this.ball.init({x:200,y:520});
        this.brick = new Brick(this.ctx);
        this.brick.init();
        this.racket = new Racket(this.ctx);
        document.addEventListener('keydown',this.keyEvent);
        window.addEventListener('resize',this.resize);
        const startBtn = document.getElementById('start');
        startBtn?.addEventListener('click',this.start);

    }

    public static keyEvent = (ev:KeyboardEvent)=>{
       
    }

    public static start = ()=>{
        
        //this.ball.draw()
        this.starting = true;
    }

    public static end(){

    }

    public static drawBorder(){
        this.ctx.fillStyle = this.borderColor;
        this.ctx.fillRect(0,0,this.width,this.borderWidth);
        this.ctx.fillRect(0,this.borderWidth,this.borderWidth,this.height-this.bottomHeight-this.racketHeight-this.borderWidth);
        this.ctx.fillRect(this.width - this.borderWidth,20,20,this.height-this.bottomHeight-this.racketHeight-this.borderWidth);
        this.ctx.fillRect(0,this.height-this.bottomHeight,this.width,this.bottomHeight);
    }

    public static update(){
        console.log(Game.starting)
        if(Game.starting) {
            this.ctx.clearRect(0,0,400,800);
            this.drawBorder();
            this.ball.update();
            this.brick.draw();
        }
        //更新球位置
    }

    public static resize = ()=>{
        console.log(document.body.clientHeight,document.body.clientWidth)
        const scale = getScale(this.height,this.width,document.body.clientHeight,document.body.clientWidth);
        console.log(scale);
        this.container.style.transform = `translate(-50%,-50%) scale(${scale})`;
    }
}
