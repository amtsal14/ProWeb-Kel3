//deklarasi variabel

var level = Number(prompt("Pilih level (1-3)","1"));
var ball;
var player;
var computer;
var backing;
if(level==2){
    var airspeed = 12;
    var buffer = 10;
} else{
    var airspeed = 4;
    var buffer = 20;
}
var topgoal;
var bottomgoal;
var kicksound;
var cheers;
var hitwallsound;
var ballimg;
var goaldist = 100;

function preload(){

    kicksound = loadSound('https://dl.dropbox.com/s/3etf41hvu0rosdw/FOOTBALLKICK.mp3?raw=1');
    cheers = loadSound('https://dl.dropbox.com/s/cntfvu6mtjzcptp/cheer2.mp3?raw=1');
    hitwallsound = loadSound('https://dl.dropbox.com/s/hhb134y06tb2eu/BOUNCE%2B1.mp3?raw=1');
    ballimg = loadImage('https://dl.dropbox.com/s/hbde2jp5frpaj34/unnamed.png?raw=1');
}


function setup(){
    createCanvas(window.innerWidth,window.innerHeight);
    ball = new SoccerBall();
    player = new Players(width / 2, height - 100, 'Player', [102,255,255]);
    computer = new Players(width / 2, height - 100, 'Computer', [255,255,55]);
    //rectMode(CENTER);
    frameRate(50);
    //background(0,255,0);
}

function draw(){
    //background(0,255,0);
    var j = 0;
    for(var i=0; i<height; i+=height/12){
        if(j%2 = 0){
            fill(76,187,23);
        }else{
            fill(57,255,20);
        }
        noStroke();
        rectMode(CORNER);
        rect(0, i, width, height/12);
        j++;
    }
    drawbg();
    ball.show();
    ball.move();
    ball.checkCollision();
    player.show();
    player.move();
    player.hitTheBall(ball);
    computer.show();
    computer.aimove(ball);
    computer.hitTheBall(ball);
    showScores();
    ball.debugme();
    ball.fixme();
}
class SoccerBall{
    constructor(){
        this.x = width/2;
        this.y = height/2;
        this.xvel = -5;
        this.yvel = -5;
        this.maxx = 20;
        this.maxy = 20;
        this.r = 30;
        this.lasthitters = [];
    }
    show(){
        //texture(ballimg);
        //fill(255);
        noStroke();
        
    }
}
