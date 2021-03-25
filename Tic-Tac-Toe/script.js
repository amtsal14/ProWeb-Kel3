//selecting all elements
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = ()=>{ //Windows pertama diload
    for (let i = 0; i < allBox.length; i++) { //menabahkan onleClick attribute
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide"); //menyembunyikan select box
    playBoard.classList.add("show"); //menampilkan playboard
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide"); //menyembunyikan select box
    playBoard.classList.add("show"); //menampilkan playboard
    players.setAttribute("class", "players active player"); //set class attribute pada pemain dengan nilai aktif
}

let playerXIcon //class name X Icon
let playerOIcon //class name O Icon
let playerSign = "X"; //Global variabel untuk miltiple function
let runBot = true; //Global variabel untuk menonaktifkan Bot

// Fungsi Click pengguna
function clickedBox(element){
    if(players.classList.contains("player")){
        playerSign = "O"; //Jika player memilih (O) maka akan mengganti variable playerSign ke O
        element.innerHTML = `<img src="img/o.svg" style="height: 32px;" alt="O">`; //menambahkan Icon (O) kedalam Clicked User Element
        players.classList.add("active"); //menambahkan class active player
        element.setAttribute("id", playerSign); //Set attribute untuk pilihan player
    }else{
        element.innerHTML = `<img src="img/x.svg" style="height: 32px;" alt="X">`; //menambahkan Icon (X) kedalam Clicked Element
        players.classList.add("active");
        element.setAttribute("id", playerSign);
    }
    selectWinner(); //Fungsi untuk memanggil pemengang game
    element.style.pointerEvents = "none"; //Ketika player sudah memilih board, tidak dapat memilih kembali
    playBoard.style.pointerEvents = "none"; //Menambahkan pointerEvents none sehingga player tidak dapat memilih sebelum Bot selesai
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed(); //membuat random number sehingga Bot akan memberi jeda permainan
    setTimeout(()=>{
        bot(runBot); //Memanggil Fungsi Bot
    }, randomTimeDelay); //passing random delay value
}

//bot auto select function
function bot(){
    let array = []; //creating empty array...we'll store unclicked boxes index
    if(runBot){ //if runBot is true
        playerSign = "O"; //change the playerSign to O so if player has chosen X then bot will O
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){ //if the box/span has no children means <i> tag
                array.push(i); //inserting unclicked boxes number/index inside array
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)]; //getting random index from array so bot will select random unselected box
        if(array.length > 0){ //if array length is greater than 0
            if(players.classList.contains("player")){ 
                playerSign = "X"; //Jika player memilih (O) maka Bot akan menjadi (X)
                allBox[randomBox].innerHTML = `<img src="img/x.svg" style="height: 32px;" alt="X">`; //menambahkan Icon (X) kedalam Clicked Bot Element
                players.classList.remove("active"); //Menghapus active player pada user
                allBox[randomBox].setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
            }else{
                allBox[randomBox].innerHTML = `<img src="img/o.svg" style="height: 32px;" alt="O">`; //menambahkan Icon (O) kedalam Clicked Bot Element
                players.classList.remove("active"); //Menghapus active player pada user
                allBox[randomBox].setAttribute("id", playerSign); //set id attribute in span/box with player choosen sign
            }
            selectWinner(); //calling selectWinner function
        }
        allBox[randomBox].style.pointerEvents = "none"; //once bot select any box then user can't click on that box
        playBoard.style.pointerEvents = "auto"; //add pointerEvents auto in playboard so user can again click on box
        playerSign = "X"; //if player has chosen X then bot will be O right then we change the playerSign again to X so user will X because above we have changed the playerSign to O for bot
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id; //return id value
}
function checkIdSign(val1, val2, val3, sign){ //checking all id value is equal to sign (X or O) or not if yes then return true
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function selectWinner(){ //if the one of following winning combination match then select the winner
    if(checkIdSign(1,2,3,playerSign) || checkIdSign(4,5,6, playerSign) || checkIdSign(7,8,9, playerSign) || checkIdSign(1,4,7, playerSign) || checkIdSign(2,5,8, playerSign) || checkIdSign(3,6,9, playerSign) || checkIdSign(1,5,9, playerSign) || checkIdSign(3,5,7, playerSign)){
        runBot = false; //passing the false boolen value to runBot so bot won't run again
        bot(runBot); //calling bot function
        setTimeout(()=>{ //after match won by someone then hide the playboard and show the result box after 700ms
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700); //1s = 1000ms
        wonText.innerHTML = `Player <p>${playerSign}</p> Menang!`; //displaying winning text with passing playerSign (X or O)
    }else{ //if all boxes/element have id value and still no one win then draw the match
        if(getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != ""){
            runBot = false; //passing the false boolen value to runBot so bot won't run again
            bot(runBot); //calling bot function
            setTimeout(()=>{ //after match drawn then hide the playboard and show the result box after 700ms
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700); //1s = 1000ms
            wonText.textContent = "Permainan Seri!"; //displaying draw match text
        }
    }
}

replayBtn.onclick = ()=>{
    window.location.reload(); //reload the current page on replay button click
}
