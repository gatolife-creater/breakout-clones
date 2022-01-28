class Blocks {
    constructor() {
        this.x = [];
        this.y = [];
        this.w = [];
        this.h = [];
        this.count_x = 30;
        this.count_y = 10;
        this.visible = [];
        this.counter = this.count_x * this.count_y;
    }
    s() {
        for (var i = 0; i < this.count_x; i++) {
            this.w[i] = [];
            this.h[i] = [];
            this.x[i] = [];
            this.y[i] = [];
            this.visible[i] = [];

            for (var j = 0; j < this.count_y; j++) {
                this.w[i][j] = 20;
                this.h[i][j] = 20;
                this.x[i][j] = this.w[i][j] * i;
                this.y[i][j] = this.h[i][j] * j;
                this.visible[i][j] = true;
            }
        }
    }
    d() {
        for (var i = 0; i < this.count_x; i++) {
            for (var j = 0; j < this.count_y; j++) {
                strokeWeight(2);
                stroke(0);
                if (this.visible[i][j]) {
                    fill(255, 0, 125);
                    rect(this.x[i][j], this.y[i][j], this.w[i][j], this.h[i][j]);
                }
            }
        }
    }
}
class Player {
    constructor() {
        this.x = width / 2;
        this.y = 350;
        this.w = 75;
        this.h = 10;
    }
    s() {
        this.x = width / 2;
        this.y = 350;
        this.w = 75;
        this.h = 10;
    }
    d() {
        this.x = mouseX - this.w / 2;
        if (this.x < 0) this.x = 0;
        if (this.x > width - this.w) this.x = width - this.w;
        fill(0, 125, 255);
        rect(this.x, this.y, this.w, this.h);
    }
}

class Ball {
    constructor() {
        this.x = width / 2;
        this.y = 330;
        this.size = 12;
        this.xsp = 6;
        this.ysp = 6;
        this.pierce = false;
    }
    s() {
        this.x = width / 2;
        this.y = 330;
        this.size = 12;
        this.xsp = 6;
        this.ysp = 6;
        this.pierce = false;
    }
    d() {
        if (proceed.move == 1) {
            this.x += this.xsp;
            this.y -= this.ysp;
        }

        noStroke();
        circle(this.x, this.y, this.size);
    }
}

class Touch {
    touch_wall() {
        if (ball.x < ball.size / 2 || ball.x > width - ball.size / 2) {
            if (ball.x < ball.size / 2) ball.x = ball.size / 2;
            if (ball.x > width - ball.size / 2) ball.x = width - ball.size / 2;
            ball.xsp *= -1;
        }
        if (ball.y < ball.size / 2) {
            ball.y = ball.size / 2;
            ball.ysp *= -1;
        }
    }
    touch_player(bx, by, bsize, px, py, pw, ph) {
        if (
            bx + bsize / 2 >= px &&
            bx - bsize / 2 <= px + pw &&
            by + bsize / 2 >= py &&
            by - bsize / 2 <= py + ph
        ) {
            if (bx + bsize / 2 >= px && bx + bsize / 2 <= px + pw / 4) ball.xsp = -6;
            if (bx + bsize / 2 > px + pw / 4 && bx - bsize / 2 < px + pw / 2) ball.xsp = -3;
            if (bx + bsize / 2 > px + (pw / 4) * 3 && bx - bsize / 2 < px + pw) ball.xsp = 6;
            if (
                bx + bsize / 2 >= px + pw / 2 &&
                bx - bsize / 2 <= px + (pw / 4) * 3
            ) ball.xsp = 3;
            ball.ysp *= -1;
        }
    }
    touch_block() {
        for (var i = 0; i < blocks.count_x; i++) {
            for (var j = 0; j < blocks.count_y; j++) {
                if (
                    blocks.visible[i][j] &&
                    ball.x + ball.size / 2 > blocks.x[i][j] &&
                    ball.x - ball.size / 2 < blocks.x[i][j] + blocks.w[i][j] &&
                    ball.y + ball.size / 2 > blocks.y[i][j] &&
                    ball.y - ball.size / 2 < blocks.y[i][j] + blocks.h[i][j]
                ) {
                    if (ball.pierce == false) ball.ysp *= -1;

                    blocks.visible[i][j] = false;
                    blocks.counter -= 1;
                    proceed.score += 10;
                    let r = int(random(100));
                    if (r == 1 || r == 2) {
                        this.x;
                        items.visible[i][j] = true;
                    }
                }
            }
        }
    }
    touch_item() {
        for (var i = 0; i < blocks.count_x; i++) {
            for (var j = 0; j < blocks.count_y; j++) {
                if (
                    items.visible[i][j] == true &&
                    items.x[i][j] + items.size[i][j] / 2 >= player.x &&
                    items.x[i][j] - items.size[i][j] / 2 <= player.x + player.w &&
                    items.y[i][j] + items.size[i][j] / 2 >= player.y &&
                    items.y[i][j] - items.size[i][j] / 2 <= player.y + player.h
                ) {
                    switch (items.type[i][j]) {
                        case 1:
                            ball.pierce = true;
                            items.visible[i][j] = false;
                            break;

                        case 2:
                            player.w = 150;
                            items.visible[i][j] = false;
                            break;

                        case 3:
                            ball.size = 24;
                            items.visible[i][j] = false;
                            break;
                    }
                    proceed.score += 50;
                }
            }
        }
    }
}

class Proceed {
    constructor() {
        this.move = 0;
        this.bc = 255;
        this.bsp = -2;
        this.life = 5;
        this.score = 0;
        this.h1 = "";
        this.h2 = "";
    }
    miss() {
        if (ball.y > height - ball.size / 2) {
            if (proceed.life > 0) {
                proceed.life -= 1;
                if (mouseX < 0 + ball.size / 2) {
                    ball.x = ball.size / 2;
                } else if (mouseX > width - ball.size / 2) {
                    ball.x = width - ball.size / 2;
                } else if (mouseX > ball.size / 2 && mouseX < width - ball.size / 2) {
                    ball.x = mouseX;
                }
                ball.y = 330;
                ball.xsp = 0;
                ball.ysp = 0;
                player.w = 75;
                ball.size = 12;
                ball.pierce = false;
                player.h = 10;
            }
        }
    }
    observe() {
        if (proceed.life == 0 && ball.y > height - ball.size / 2) {
            proceed.life = "null";
            proceed.h1 = "R.I.P.";
            proceed.h2 = "この文字をタップでリトライ";
        }
        if (blocks.counter == 0) {
            proceed.h1 = "GAMECLEAR!";
            proceed.h2 = "この文字をタップでリトライ";
        }
    }
    display() {
        if (proceed.move == 0) {
            this.bc -= this.bsp;
            if (this.bc < 0 || this.bc > 255) {
                this.bsp *= -1;
            }
            fill(251, 125, 222, this.bc);
            textAlign(CENTER);
            textSize(50);
            text("CLICK TO START", width / 2, height / 2 + 100);
        }

        if (proceed.move == 1) {
            textSize(15);
            text("残機:" + proceed.life, width - 50, height - 25);
            text("score:" + proceed.score, 50, height - 25);
            textSize(50);
            fill(0, 255, 0);
            text(proceed.h1, width / 2, height / 2 + 100);
            textSize(10);
            text(proceed.h2, width / 2, height / 2 + 125);
        }
        if (proceed.h1 == "R.I.P.") {
            proceed.score = 0;
        }
    }
    reset() {
        let parent = document.getElementsByTagName("article")[0];
        canvas = createCanvas(600, 400);
        canvas.parent(parent);
        blocks.s();
        blocks.counter = 300;
        player.s();
        ball.s();
        proceed.display();
        proceed.life = 5;
        proceed.h1 = " ";
        proceed.h2 = " ";
        proceed.move = 0;
    }
}

class Items {
    constructor() {
        this.x = [];
        this.y = [];
        this.size = [];
        this.sp = [];
        this.type = [];
        this.col = [];
        this.visible = [];
    }
    s() {
        for (var i = 0; i < blocks.count_x; i++) {
            this.size[i] = [];
            this.x[i] = [];
            this.y[i] = [];
            this.sp[i] = [];
            this.type[i] = [];
            this.col[i] = [];
            this.visible[i] = [];
            for (var j = 0; j < blocks.count_y; j++) {
                this.size[i][j] = 20;
                this.x[i][j] = blocks.x[i][j] + blocks.w[i][j] / 2;
                this.y[i][j] = blocks.y[i][j] + blocks.h[i][j] / 2;
                this.sp[i][j] = 1;
                this.type[i][j] = int(random(1, 4));
                this.visible[i][j] = false;
                switch (this.type[i][j]) {
                    case 1:
                        this.col[i][j] = color(255, 0, 0);
                        break;
                    case 2:
                        this.col[i][j] = color(0, 255, 0);
                        break;
                    case 3:
                        this.col[i][j] = color(0, 0, 255);
                        break;
                }
            }
        }
    }
    d() {
        for (var i = 0; i < blocks.count_x; i++) {
            for (var j = 0; j < blocks.count_y; j++) {
                if (this.visible[i][j]) {
                    this.y[i][j] += this.sp[i][j];

                    fill(this.col[i][j]);
                    circle(this.x[i][j], this.y[i][j], this.size[i][j]);
                }
            }
        }
    }
}



function setup() {
    let parent = document.getElementsByTagName("article")[0];
    let canvas = createCanvas(600, 400);
    canvas.parent(parent);

    blocks = new Blocks(),
        player = new Player(),
        ball = new Ball(),
        touch = new Touch(),
        proceed = new Proceed(),
        items = new Items();
    blocks.s();
    player.s();
    ball.s();
    items.s();
}

function draw() {
    background(0);
    if (proceed.move == 0) {
        blocks.d();
        player.d();
        ball.d();
        proceed.display();
    }
    if (proceed.move == 1) {
        blocks.d();
        player.d();
        ball.d();
        touch.touch_wall();
        touch.touch_player(
            ball.x,
            ball.y,
            ball.size,
            player.x,
            player.y,
            player.w,
            player.h
        );
        touch.touch_block();
        touch.touch_item();
        proceed.miss();
        proceed.observe();
        proceed.display();
        items.d();
    }
}

function mousePressed() {
    if (
        mouseX >= 100 &&
        mouseX <= width - 100 &&
        mouseY >= height / 2 + 50 &&
        mouseY <= height / 2 + 100
    ) proceed.move = 1;
    if (proceed.life >= 0 && ball.xsp == 0 && ball.ysp == 0) ball.xsp = ball.ysp = 6;
    if (proceed.h1 == "R.I.P." || proceed.h1 == "GAMECLEAR!") proceed.reset();
}