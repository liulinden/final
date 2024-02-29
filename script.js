const canvas = document.getElementById('cvs')
document.addEventListener("keydown", keyDown)
document.addEventListener("keyup", keyUp)

const dpr = Math.ceil(window.devicePixelRatio || 1);
canvas.width=canvas.clientWidth*dpr;
canvas.height=canvas.clientHeight*dpr;

const ctx=canvas.getContext('2d')

function gameloop(){
    player.tick(upArrow,downArrow,leftArrow,rightArrow);
    updateScreenDim()
    drawFrame()
    requestAnimationFrame(gameloop)
}

function keyDown(event){
    switch (event.key){
        case ('ArrowDown'):
            downArrow=true;
            break;
        case ('ArrowLeft'):
            leftArrow=true;
            break;
        case ('ArrowRight'):
            rightArrow=true;
            break;
        case ('ArrowUp'):
            upArrow=true;
            break;
    }
}

function keyUp(event){
    switch (event.key){
        case ('ArrowDown'):
            downArrow=false;
            break;
        case ('ArrowLeft'):
            leftArrow=false;
            break;
        case ('ArrowRight'):
            rightArrow=false;
            break;
        case ('ArrowUp'):
            upArrow=false;
            break;
    }
}

function drawFrame(){
    player.draw()
    for (let i=0;i<platforms.length;i++){
        platforms[i].draw()
    }
    ctx.fillRect(0,Math.max(0,floorHeight),canvas.width,canvas.height)
}

function updateScreenDim(){
    canvas.width=canvas.clientWidth*dpr;
    canvas.height=canvas.clientHeight*dpr;
}

class Player{
    constructor(startx,starty,width=70,height=90){
        this.x=startx
        this.y=starty
        this.width=width
        this.height=height
        this.xSpeed=0
        this.ySpeed=0
        this.onGround=false;
    }
    tick(up=false,down=false,left=false,right=false){
        this.ySpeed+=2
        if (this.onGround) this.xSpeed*=0.6;
        else this.xSpeed*=0.9
        if (this.onGround && up){
            this.ySpeed-=35;
        }
        if (right){
            if (this.onGround) this.xSpeed+=6;
            else this.xSpeed+=1
        }
        if (left){
            if (this.onGround) this.xSpeed-=6;
            else this.xSpeed-=1
        }
        let falling=this.ySpeed>0
        this.moveX();
        this.onGround= this.moveY() && falling;
    }
    moveY(){ //returns whether or not it collided
        if (this.isColliding()){
            console.log("stuck in wall");
            return true;
        }
        this.y+=this.ySpeed;
        if (this.isColliding()){
            if (this.ySpeed>0){
                while (this.isColliding()) this.y-=5;
                while (!this.isColliding()) this.y+=1;
                this.y-=1;
            } else{
                while (this.isColliding()) this.y+=5;
                while (!this.isColliding()) this.y-=1;
                this.y+=1;
            }
            this.ySpeed=0
            return true;
        }
        return false;
    }
    moveX(){
        if (this.isColliding()){
            console.log("stuck in wall");
            return true;
        }
        this.x+=this.xSpeed;
        if (this.isColliding()){
            if (this.xSpeed>0){
                while (this.isColliding()) this.x-=5;
                while (!this.isColliding()) this.x+=1;
                this.x-=1;
            } else{
                while (this.isColliding()) this.x+=5;
                while (!this.isColliding()) this.x-=1;
                this.x+=1;
            }
            this.xSpeed=0;
            return true;
        }
        return false;
    }
    isColliding(floor=true){
        if (floor){
            if (this.y+this.height>floorHeight) return true;
        }
        for (let i=0;i<platforms.length;i++){
            if (this.collidesWith(platforms[i])) return true;
        }
        return false;
    }
    collidesWith(object){
        if (this.x<object.x+object.width && this.x+this.width>object.x && this.y<object.y+object.height && this.y+this.height>object.y) return true;
        else return false;
    }
    draw(){
        ctx.fillStyle='black'
        ctx.fillRect(Math.round(this.x-0.5),Math.round(this.y-0.5),Math.round(this.width+1),Math.round(this.height+1))
        console.log()
    }
}

class Platform{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }
    draw(){
        ctx.fillRect(Math.round(this.x),Math.round(this.y),Math.round(this.width),Math.round(this.height))
    }
}

var scrollX=0;
var scrollY=0;
var upArrow=false;
var downArrow=false;
var rightArrow=false;
var leftArrow=false;
var platforms=[
    new Platform(650,540,150,160),
    new Platform(300,400,100,50),
    new Platform(600,200,100,50)
]
const floorHeight=700
const player=new Player(0,0);
gameloop();