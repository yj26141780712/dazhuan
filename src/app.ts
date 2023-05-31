import Game from "./Game";
// import { Ball } from "./Ball";
// import { Brick } from "./Brick";
// import { Racket } from "./Racket";

function update(){
    Game.update();
    requestAnimationFrame(update);
}

function init(){
    //初始化
    // const ball = new Ball();
    // const brick = new Brick();
    // const racket = new Racket();
    Game.init('canvas');
    update();
}

init()


