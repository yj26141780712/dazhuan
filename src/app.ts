import Game from "./Game";
// import { Ball } from "./Ball";
// import { Brick } from "./Brick";
// import { Racket } from "./Racket";

function update() {
    console.log(123);
    Game.update();
    requestAnimationFrame(update);
}

function init() {
    //初始化
    // const ball = new Ball();
    // const brick = new Brick();
    // const racket = new Racket();
    document.addEventListener('contextmenu', function (event) {
        console.log('contextmenu')
        event.preventDefault();
    });
    document.addEventListener('selectstart', function (event) {
        console.log('selectstart')
        event.preventDefault();
    });
    Game.init('canvas');
    update();
}

init()


