// --- CONFIGURATION ---
const CONFIG = {
    key: "RKXRAKIB",
    depositUrl: "https://tkclub2.com/#/wallet/Recharge",
    wingo1m: "https://tkclub2.com/#/home/AllLotteryGames/WinGo?id=1",
    inviteCode: "84445206479"
};

let isAuthorized = false;
let currentMode = 30; // Default 30s
let lastBlockId = -1;

// --- SECURITY: PREVENT STEALING ---
document.addEventListener('keydown', function(e) {
    if(e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'i')) e.preventDefault();
    if(e.key === 'F12') e.preventDefault();
});

// --- DRAGGABLE BOX ---
const box = document.getElementById('main-box');
let isDragging = false, offset = [0,0];

box.onmousedown = (e) => {
    if(e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
    isDragging = true;
    offset = [box.offsetLeft - e.clientX, box.offsetTop - e.clientY];
};

document.onmousemove = (e) => {
    if(!isDragging) return;
    box.style.left = (e.clientX + offset[0]) + 'px';
    box.style.top = (e.clientY + offset[1]) + 'px';
    box.style.transform = 'none';
};
document.onmouseup = () => isDragging = false;

// --- APP LOGIC ---

function handleLogin() {
    const key = document.getElementById('passKey').value;
    if(key === CONFIG.key) {
        // Step 1: Check if user is on WinGo page
        checkUrlAndProgress();
    } else {
        alert("INVALID SERVER KEY!");
    }
}

function checkUrlAndProgress() {
    // Note: Browser security limits reading iframe URL if domain is different.
    // In a real environment, this would be injected or run via a browser extension.
    // We simulate the detection here.
    
    document.getElementById('login-view').style.display = 'none';
    
    // Redirect to Deposit if balance "not found"
    document.getElementById('deposit-view').style.display = 'block';
}

function redirectToDeposit() {
    window.open(CONFIG.depositUrl, '_blank');
    // After clicking deposit, we allow them to see signals (Simulating activation)
    setTimeout(() => {
        activateSignalUI();
    }, 2000);
}

function activateSignalUI() {
    document.getElementById('deposit-view').style.display = 'none';
    document.getElementById('display-area').style.display = 'block';
    isAuthorized = true;
    startSignalEngine();
}

function startSignalEngine() {
    setInterval(() => {
        if(!isAuthorized) return;

        const now = new Date();
        const seconds = now.getSeconds();
        
        // Logic to switch between 30s and 60s
        // We simulate detection based on current URL (manual toggle or auto)
        let timeframe = (window.location.href.includes("id=1")) ? 60 : 30;
        currentMode = timeframe;
        document.getElementById('game-mode').innerText = "WINGO " + currentMode + "S MODE";

        const remains = currentMode - (seconds % currentMode);
        const blockId = Math.floor(now.getTime() / (currentMode * 1000));

        if (remains <= 5) {
            document.getElementById('result-text').innerText = "WAITING";
            document.getElementById('result-text').style.color = "#aaa";
        } else {
            if (blockId !== lastBlockId) {
                lastBlockId = blockId;
                generateSmartSignal(blockId);
            }
        }

        document.getElementById('timer-val').innerText = remains.toString().padStart(2, '0');
        const progress = (remains / currentMode) * 100;
        document.getElementById('wave-progress').style.width = progress + "%";

    }, 1000);
}

function generateSmartSignal(id) {
    const resText = document.getElementById('result-text');
    const luckyNum = document.getElementById('lucky-num');
    
    // AI Algorithm
    const seed = (id * 9301 + 49297) % 233280;
    const rand = seed / 233280;
    
    const isBig = rand > 0.5;
    resText.innerText = isBig ? "BIG" : "SMALL";
    resText.style.color = isBig ? "#00f2ff" : "#ff00f7";
    
    if(isBig) {
        luckyNum.innerText = "5, 7, 8, 9";
    } else {
        luckyNum.innerText = "0, 1, 2, 4";
    }
}
