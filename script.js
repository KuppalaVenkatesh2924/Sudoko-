const gridContainer = document.getElementById('sudoku-grid');
const difficultySelector = document.getElementById('difficulty');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const leaderboardList = document.getElementById('leaderboard-list');

let timer, seconds = 0;
let score = 0;
let sudoku = [], solution = [];

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

function startTimer(){
    clearInterval(timer); seconds=0;
    timer = setInterval(()=>{
        let mins=String(Math.floor(seconds/60)).padStart(2,'0');
        let secs=String(seconds%60).padStart(2,'0');
        timeDisplay.textContent=`${mins}:${secs}`;
        seconds++;
    },1000);
}

function generateSudoku(){
    gridContainer.innerHTML=''; sudoku = JSON.parse(JSON.stringify(baseSudoku));
    let removeCount = difficultySelector.value==='easy'?30:difficultySelector.value==='medium'?40:50;
    for(let i=0;i<removeCount;i++){
        let r=Math.floor(Math.random()*9), c=Math.floor(Math.random()*9);
        sudoku[r][c]=0;
    }
    solution = JSON.parse(JSON.stringify(baseSudoku));
    for(let r=0;r<9;r++){
        for(let c=0;c<9;c++){
            const input=document.createElement('input');
            input.type='text'; input.maxLength=1;
            const blockIndex=Math.floor(r/3)*3 + Math.floor(c/3);
            input.classList.add(`block-color-${blockIndex%4}`);
            if(sudoku[r][c]!==0){ input.value=sudoku[r][c]; input.classList.add('prefilled'); input.disabled=true; }
            else{ input.addEventListener('input',(e)=>{ let val=parseInt(e.target.value); if(isNaN(val)||val<1||val>9) e.target.value=''; }); }
            input.dataset.row=r; input.dataset.col=c;
            gridContainer.appendChild(input);
        }
    }
    score=0; scoreDisplay.textContent=score;
    document.getElementById('message').textContent='';
    startTimer(); updateLeaderboardUI();
}

function checkSudoku(){
    const inputs=gridContainer.querySelectorAll('input'); let correct=true; let index=0;
    for(let r=0;r<9;r++){ for(let c=0;c<9;c++){
        let val=parseInt(inputs[index].value);
        if(val!==solution[r][c]){ correct=false; inputs[index].style.backgroundColor='#f8d7da'; }
        else if(!inputs[index].classList.contains('prefilled')){ inputs[index].style.backgroundColor='#d4edda'; }
        index++;
    }}
    if(correct){ clearInterval(timer); score=Math.max(0,1000-seconds*2); scoreDisplay.textContent=score;
        document.getElementById('message').textContent="🎉 Congratulations!"; saveScore(score); updateLeaderboardUI(); }
    else{ document.getElementById('message').textContent="⚠ Some numbers are incorrect!"; }
}

function resetSudoku(){
    const inputs=gridContainer.querySelectorAll('input');
    inputs.forEach(input=>{ if(!input.classList.contains('prefilled')){ input.value=''; input.style.backgroundColor='white'; } });
    document.getElementById('message').textContent='';
}

function giveHint(){
    const inputs=gridContainer.querySelectorAll('input'); let emptyCells=[];
    inputs.forEach(input=>{ if(input.value==='') emptyCells.push(input); });
    if(emptyCells.length>0){
        const randCell=emptyCells[Math.floor(Math.random()*emptyCells.length)];
        let r=parseInt(randCell.dataset.row), c=parseInt(randCell.dataset.col);
        randCell.value=solution[r][c]; randCell.style.animation='hint-flash 1s ease';
        setTimeout(()=>randCell.style.animation='',1000);
    }
}

function saveScore(newScore){
    let scores=JSON.parse(localStorage.getItem('sudokuScores'))||[];
    scores.push(newScore); scores.sort((a,b)=>b-a); scores=scores.slice(0,5);
    localStorage.setItem('sudokuScores',JSON.stringify(scores));
}

function updateLeaderboardUI(){
    let scores=JSON.parse(localStorage.getItem('sudokuScores'))||[];
    leaderboardList.innerHTML='';
    scores.forEach((s,i)=>{ const li=document.createElement('li'); li.textContent=`${i+1}. ${s}`; leaderboardList.appendChild(li); });
}

// Initial
generateSudoku();
