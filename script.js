const CONFIG = {
    key: "RKXRAKIB",
    depositUrl: "https://tkclub2.com/#/wallet/Recharge",
    wingoUrl: "https://tkclub2.com/#/home/AllLotteryGames/WinGo?id=1"
};

let isVerified = false;

// 1. Toggle Panel (Minimize/Maximize)
function togglePanel(show) {
    const mainBox = document.getElementById('main-box');
    const miniLogo = document.getElementById('mini-logo');
    
    if(show) {
        mainBox.style.display = 'block';
        mainBox.style.opacity = '1';
        mainBox.style.transform = 'scale(1) translateX(0)';
        miniLogo.style.display = 'none';
    } else {
        mainBox.style.opacity = '0';
        mainBox.style.transform = 'scale(0) translateX(-100px)';
        setTimeout(() => {
            mainBox.style.display = 'none';
            miniLogo.style.display = 'flex';
        }, 300);
    }
}

// 2. Authentication
function checkAuth() {
    const key = document.getElementById('passKey').value;
    if(key === CONFIG.key) {
        document.getElementById('auth-view').style.display = 'none';
        document.getElementById('deposit-view').style.display = 'block';
    } else {
        alert("ACCESS DENIED: WRONG SERVER KEY");
    }
}

// 3. Deposit Inside Same Iframe
function openDepositInside() {
    const frame = document.getElementById('game-frame');
    frame.src = CONFIG.depositUrl;
    alert("Please deposit minimum 500 BDT. After payment, enter your User ID or Txn ID here to verify.");
}

// 4. Real-Look Verification System
function verifyDeposit() {
    const txn = document.getElementById('txnId').value;
    if(txn.length < 5) {
        alert("Please enter a valid Transaction ID or User ID");
        return;
    }

    document.querySelector('.deposit-box').style.display = 'none';
    document.getElementById('verify-loader').style.display = 'block';

    // Simulate Server Verification
    setTimeout(() => {
        // Logic: Here you can connect a real API. For now, it's a simulated "Success"
        isVerified = true;
        document.getElementById('verify-loader').innerHTML = "<p style='color:#00ff88'>DEPOSIT VERIFIED! REDIRECTING...</p>";
        
        setTimeout(() => {
            const frame = document.getElementById('game-frame');
            frame.src = CONFIG.wingoUrl;
            showSignalUI();
        }, 2000);
    }, 4000);
}

// 5. Signal Engine
function showSignalUI() {
    document.getElementById('deposit-view').style.display = 'none';
    document.getElementById('signal-view').style.display = 'block';
    
    startAI();
}

function startAI() {
    setInterval(() => {
        const now = new Date();
        const sec = now.getSeconds();
        const remains = 60 - sec;
        
        // Update Circle Progress
        const offset = 208 - (208 * remains / 60);
        document.getElementById('timer-progress').style.strokeDashoffset = offset;
        document.getElementById('timer-val').innerText = remains;

        if (remains > 55 || remains < 2) {
            document.getElementById('result-text').innerText = "WAITING";
            document.getElementById('lucky-num').innerText = "---";
        } else if (remains === 55) {
            generatePrediction();
        }
    }, 1000);
}

function generatePrediction() {
    const isBig = Math.random() > 0.5;
    const resText = document.getElementById('result-text');
    resText.innerText = isBig ? "BIG" : "SMALL";
    resText.style.color = isBig ? "#00d2ff" : "#ff3e3e";
    
    const nums = isBig ? "5, 6, 7, 8, 9" : "0, 1, 2, 3, 4";
    document.getElementById('lucky-num').innerText = "LUCKY: " + nums;
}

// 6. Draggable Logic
const dragZone = document.getElementById('drag-zone');
const box = document.getElementById('main-box');
let isMoving = false, px = 0, py = 0;

dragZone.onmousedown = (e) => {
    isMoving = true;
    px = e.clientX - box.offsetLeft;
    py = e.clientY - box.offsetTop;
};

document.onmousemove = (e) => {
    if(!isMoving) return;
    box.style.left = (e.clientX - px) + "px";
    box.style.top = (e.clientY - py) + "px";
};

document.onmouseup = () => isMoving = false;
