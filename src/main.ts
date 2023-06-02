import './style.scss';
import Game from "./app/game";
import worker  from "./app/deepWork";

// import { Ball } from "./Ball";
// import { Brick } from "./Brick";
// import { Racket } from "./Racket";

function update() {
    Game.update();
    requestAnimationFrame(update);
}

function init() {
    worker.postMessage({
        question:
            'The Answer to the Ultimate Question of Life, The Universe, and Everything.',
    });
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





