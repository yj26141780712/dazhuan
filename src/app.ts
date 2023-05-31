
function main() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
        ctx.beginPath();
        ctx.arc(100, 100, 25, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = 'blue';
        ctx.fill();
        for (let i = 0; i < 1; i++) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }
}

function ob(x: any, y: any, r: any, cc: any, o: any, s: any) {
    // this.x = x;
    // this.y = y;
    // this.r = r;
    // this.cc = cc;
    // this.theta = Math.random() * Math.PI * 2;
    // this.s = s;
    // this.o = o;
    // this.t = Math.random() * 150;
    // this.dr = function() {
    //     const ls = {
    //         x: this.x,
    //         y: this.y
    //     };
    //     this.theta += this.s;
    //     this.x = m.x + Math.cos(this.theta) * this.t;
    //     this.y = m.y + Math.sin(this.theta) * this.t;
    //     c.beginPath();
    //     c.lineWidth = this.r;
    //     c.strokeStyle = this.cc;
    //     c.moveTo(ls.x, ls.y);
    //     c.lineTo(this.x, this.y);
    //     c.stroke();
    //     c.closePath();
    // }
}


function drawStar(ctx: any, r: any) {
    ctx.save();
    ctx.beginPath()
    ctx.moveTo(r, 0);
    for (var i = 0; i < 9; i++) {
        ctx.rotate(Math.PI / 5);
        if (i % 2 == 0) {
            ctx.lineTo((r / 0.525731) * 0.200811, 0);
        } else {
            ctx.lineTo(r, 0);
        }
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}


main();

