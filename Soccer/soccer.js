// memilih elemen canvas
const canvas = document.getElementById("soccer");

// metode & property untuk menggambar elemen pada canvas
const ctx = canvas.getContext('2d');

// suara
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();

hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// mendeskripsikan bola
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "WHITE"
}

// mendeskripsikan pemain
let i;
const user = {
    x : 70, // posisi x awal = 70 px dari sisi kiri canvas
    y : (canvas.height - 30)/2, // posisi y awal = (tinggi canvas - tinggi pemain) / 2
    width : 20,
    height : 30,
    speed : 7,
    score : 0,
    rate : 0,
    color : "BLUE"
}

// mendeskripsikan lawan
const com = {
    x : canvas.width - 90, // posisi x awal = lebar canvas - lebar lawan - 70 px dari sisi kanan canvas
    y : (canvas.height - 30)/2, // posisi y awal = (tinggi canvas - tinggi lawan) / 2
    width : 20,
    height : 30,
    score : 0,
    color : "RED"
}

// fungsi untuk menggambar persegi
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// fungsi untuk menggambar lingkaran
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// fungsi untuk menggerakan pemain menggunakan mouse
canvas.addEventListener("mousemove", getMousePos);
function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
}

// fungsi mengembalikan bola ke posisi awal
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

// fungsi menggambar skor
function drawScore(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "50px fantasy";
    ctx.fillText(text, x, y);
}

// fungsi menggambar rating
function drawRate(text,x,y){
    ctx.fillStyle = "#FFF";
    ctx.font = "20px fantasy";
    ctx.fillText(text, x, y);
}

// fungsi mendeteksi benturan
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// fungsi untuk melakukan segala perhitungan
function update(){
    
    // kondisi apabila mencetak skor
    if( ball.x - ball.radius < 0 && ball.y > 150 && ball.y < 250){ // bola memasuki gawang pemain
        com.score++; // skor lawan bertambah 1
        comScore.play(); 
        resetBall(); // mengembalikan bola ke posisi awal
    }else if( ball.x + ball.radius > canvas.width && ball.y > 150 && ball.y < 250){ // bola memasuki gawang lawan
        if(user.score <= com.score-1 && user.score >= com.score-2){ // pemain sedang tertinggal 1 sampai 2 gol
            user.rate += 6; // rating bertambah 6
        }else if(user.score < com.score-2){ // pemain sedang tertinggal lebih dari 2 gol
            user.rate += 4; // rating bertambah 4
        } else{
            for(i=0;i<(8 + (user.score - com.score)*3);i++){ // pemain sedang unggul
                user.rate++; // rating bertambah 8 + (selisih gol * 3)
            }
        }
        user.score++; // skor pemain bertambah 1
        userScore.play();
        resetBall(); // mengambalikan bola ke posisi awal
    }

    // mengatasi bug dimana bola keluar lapangan
    if(ball.y < 0){
        ball.y = 20;
    }else if(ball.y > 400){
        ball.y = 380;
    }
    
    // perpindahan posisi bola berdasarkan kecepatan bola
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI lawan
    if(ball.y > 10 && ball.y < 390 && user.score < com.score){ // bola di dalam lapangan & lawan sedang unggul
        com.y += (ball.y - (com.y + com.height/2))*0.06; // lawan bergerak mengikuti posisi bola di sumbu y dengan kecepatan 0.06
    } else if(ball.y > 10 && ball.y < 390 && user.score == com.score){ // bola di dalam lapangan & skor seri
        com.y += (ball.y - (com.y + com.height/2))*0.08; // lawan bergerak mengikuti posisi bola di sumbu y dengan kecepatan 0.08
    } else if(ball.y > 10 && ball.y < 390 && user.score > com.score){ // bola di dalam lapangan & pemain sedang unggul
        com.y += (ball.y - (com.y + com.height/2))*(0.08 + (user.score - com.score)/50); // lawan begerak mengikuti posisi bola di sumbu y dengan kecepatan 0.08 + selisih gol / 50
    }
    
    // kondisi bola menyentuh sisi atas atau bawah lapangan
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY; // membalikkan arah bola di sumbu y dengan kecepatan tetap
        wall.play();
    }

    // kondisi bola menyentuk sisi kanan atau kiri lapangan
    if(ball.x - ball.radius < 0 || ball.x + ball.radius - 100 > canvas.height + 100){
        ball.velocityX = -ball.velocityX; // membalikkan arah bola di sumbu x dengan kecepatan tetap
        wall.play();
    }
    
    // mengecek apakah bola sejajar pemain atau lawan di sumbu x
    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    
    // kondisi bola menyentuh pemain atau lawan
    if(collision(ball,player)){
        hit.play();

        // mengecek apakah bola menyentuh pemain ataupun lawan
        let collidePoint = (ball.y - (player.y + player.height/2));

        // normalisasi nilai dari titik benturan untuk mendapatkan angka antara -1 dan 1
        // -player.height/2 < collide Point < player.height/2
        collidePoint = collidePoint / (player.height/2);
        
        // ketika bola menyentuh bagian atas pemain / lawan, bola mengambil sudut -45 derajat
        // ketika bola menyentuh bagian tengah pemain / lawan, bola mengambil sudut 0 derajat
        // ketika bola menyentuh bagian bawah pemain / lawan, bola mengambil sudut 45 derajat
        // Math.PI/4 = 45 derajat
        let angleRad = (Math.PI/4) * collidePoint;
        
        // mengubah kecepatan pada sumbu x dan y
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // menambah kecepatan bola setiap benturan dengan pemain atau lawan
        ball.speed += 0.2; // kecepatan bola bertambah 0.2
    }
}

// fungsi render untuk menggambar berbagai objek pada canvas
function render(){
    
    // membersihkan canvas dengan warna hijau sebagai dasar lapangan
    drawRect(0, 0, canvas.width, canvas.height, "green");
    
    // menggambar skor pemain
    drawScore(user.score,canvas.width/4 - 25,canvas.height/6);
    
    // menggambarkan skor lawan
    drawScore(com.score,3*canvas.width/4 - 25,canvas.height/6);

    // menggambarkan rating
    drawRate("Rate : "+user.rate,20,canvas.height-30);
    
    // menggambar garis lapangan
    // menggambar lingkaran tengah lapangan
    drawArc(canvas.width/2,canvas.height/2,85,"white");
    drawArc(canvas.width/2,canvas.height/2,80,"green");

    // menggambar garis tengah
    drawRect(canvas.width/2-2.5,0,5,400,"white")

    // menggambar kotak penalti pemain
    drawArc(105,canvas.height/2,55,"white");
    drawArc(105,canvas.height/2,50,"green");
    drawRect(0,canvas.height/2-105,105,210,"white")
    drawRect(0,canvas.height/2-100,100,200,"green")
    drawRect(0,canvas.height/2-55,35,110,"white")
    drawRect(0,canvas.height/2-50,30,100,"darkgreen")

    // menggambar kotak penalti lawan
    drawArc(canvas.width-105,canvas.height/2,55,"white");
    drawArc(canvas.width-105,canvas.height/2,50,"green");
    drawRect(canvas.width-105,canvas.height/2-105,105,210,"white")
    drawRect(canvas.width-100,canvas.height/2-100,100,200,"green")
    drawRect(canvas.width-35,canvas.height/2-55,35,110,"white")
    drawRect(canvas.width-30,canvas.height/2-50,30,100,"darkgreen")

    // menggambar titik
    drawArc(canvas.width/2,canvas.height/2,5,"white"); // titik tengah lapangan
    drawArc(70,canvas.height/2,5,"white"); // titik penalti pemain
    drawArc(canvas.width-70,canvas.height/2,5,"white"); // titik penalti lawan

    // menggambar titik sudut
    // atas kiri
    drawArc(0,0,8,"white");
    drawArc(0,0,5,"green");
    // atas kanan
    drawArc(canvas.width,0,8,"white");
    drawArc(canvas.width,0,5,"green");
    // bawah kiri
    drawArc(0,canvas.height,8,"white");
    drawArc(0,canvas.height,5,"green");
    // bawah kanan
    drawArc(canvas.width,canvas.height,8,"white");
    drawArc(canvas.width,canvas.height,5,"green");
    
    // menggambar pemain
    drawRect(user.x, user.y, user.width, user.height, user.color);

    // menggambar lawan
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // menggambar bola
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

// fungsi game untuk memanggil fungsi update dan game
function game(){
    update();
    render();
}

let framePerSecond = 50; // nilai frame per detik
let loop = setInterval(game,1000/framePerSecond); // perulangan memanggil fungsi game 50 kali tiap 1 detik

