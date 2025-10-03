const gridContainer = document.getElementById('sudoku-grid');
const difficultySelector = document.getElementById('difficulty');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');

let timer, seconds = 0;
let score = 0;

let sudoku = [];
let solution = [];

// Base solved Sudoku
const baseSudoku = [
    [5,3,4,6,7,8,9,1,2],
    [6,7,2,1,9,5,3,4,8],
    [1,9,8,3,4,2,5,6,7],
    [8,5,9,7,6,1,4,2,3],
    [4,2,6,8,5,3,7,9,1],
    [7,1,3,9,2,4,8,5,6],
    [9,6,1,5,3,7,2,8,4],
    [2,8,7,4,1,9,6,3,5],
    [3,4,5,2,8,6,1,7,9]
];

// Timer
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(()=>{
        seconds++;
        let mins = String(Math.floor(seconds/60)).padStart(2,'0');
        let secs = String(seconds%60).padStart(2,'0');
        timeDisplay.textContent = `${mins}:${secs}`;
    },1000);
}

// Generate Sudoku puzzle
function generateSudoku(){
    gridContainer.innerHTML='';
    sudoku = JSON.parse(JSON.stringify(baseSudoku));
    let difficulty = difficultySelector.value;
    let removeCount = difficulty==='easy'?30:difficulty==='medium'?40:50;

    for(let i=0;i<removeCount;i++){
        let row=Math.floor(Math.random()*9);
        let col=Math.floor(Math.random()*9);
        sudoku[row][col]=0;
    }

    solution = JSON.parse(JSON.stringify(baseSudoku));

    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            const input=document.createElement('input');
            input.type='text';
            input.maxLength=1;

            const blockIndex=Math.floor(row/3)*3 + Math.floor(col/3);
            input.classList.add(`block-color-${blockIndex % 4}`);

            if(sudoku[row][col]!==0){
                input.value=sudoku[row][col];
                input.classList.add('prefilled');
                input.disabled=true;
            } else {
                input.addEventListener('input',(e)=>{
                    let val=parseInt(e.target.value);
                    if(isNaN(val)||val<1||val>9) e.target.value='';
                });
                input.addEventListener('keydown',(e)=>moveFocus(e,row,col));
            }

            input.dataset.row=row;
            input.dataset.col=col;
            gridContainer.appendChild(input);
        }
    }

    score=0;
    scoreDisplay.textContent=score;
    document.getElementById('message').textContent='';
    startTimer();
    updateLeaderboardUI();
}

// Keyboard navigation
function moveFocus(e,row,col){
    const inputs = gridContainer.querySelectorAll('input');
    const index=row*9+col;
    let newIndex=index;
    switch(e.key){
        case 'ArrowUp': newIndex=index-9; break;
        case 'ArrowDown': newIndex=index+9; break;
        case 'ArrowLeft': newIndex=index-1; break;
        case 'ArrowRight': newIndex=index+1; break;
        default: return;
    }
    if(newIndex>=0 && newIndex<81) inputs[newIndex].focus();
}

// Check solution
function checkSudoku(){
    const inputs=gridContainer.querySelectorAll('input');
    let correct=true;
    let index=0;
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            let val=parseInt(inputs[index].value);
            if(val!==solution[row][col]){
                correct=false;
                inputs[index].style.animation='wrong-flash 1s ease';
                setTimeout(()=>inputs[index].style.animation='',1000);
            } else {
                if(!inputs[index].classList.contains('prefilled')){
                    inputs[index].style.animation='correct-flash 1s ease';
                    setTimeout(()=>inputs[index].style.animation='',1000);
                }
            }
            index++;
        }
    }
    if(correct){
        clearInterval(timer);
        score=Math.max(0,1000-seconds*2);
        scoreDisplay.textContent=score;
        document.getElementById('message').textContent="🎉 Congratulations! You solved it!";
        saveScore(score);
        updateLeaderboardUI();
    } else {
        document.getElementById('message
