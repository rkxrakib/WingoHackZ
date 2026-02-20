const CONFIG = {
    key: "RKXRAKIB",
    wingoUrl: "https://tkclub2.com/#/home/AllLotteryGames/WinGo?id=1",
    depositUrl: "https://tkclub2.com/#/wallet/Recharge"
};

// 1. Persistence Logic (Remember Key)
window.onload = () => {
    const savedKey = localStorage.getItem('serverKey');
    const expiry = localStorage.getItem('keyExpiry');
    
    if (savedKey === CONFIG.key && expiry > Date.now()) {
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('deposit-view').style.display = 'block';
    }
};

function handleAuth() {
    const keyInput = document.getElementById('passKey').value;
    const isRemember = document.getElementById('recommendKey').checked;

    if (keyInput === CONFIG.key) {
        if (isRemember) {
            localStorage.setItem('serverKey', CONFIG.key);
            localStorage.setItem('keyExpiry', Date.now() + (24 * 60 * 60 * 1000)); // 24 Hours
        }
        document.getElementById('login-view').style.display = 'none';
        document.getElementById('deposit-view').style.display = 'block';
    } else {
        alert("ACCESS DENIED!");
    }
}

// 2. Navigation & UI
function togglePanel(show) {
    document.getElementById('main-box').style.display = show ? 'block' : 'none';
    document.getElementById('mini-logo').style.display = show ? 'none' : 'block';
}

function openDeposit() {
    document.getElementById('game-frame').src = CONFIG.depositUrl;
}

function verifyDep() {
    alert("Scanning Blockchain... Please wait 3 seconds.");
    setTimeout(() => {
        document.getElementById('game-frame').src = CONFIG.wingoUrl;
        document.getElementById('deposit-view').style.display = 'none';
        document.getElementById('display-area').style.display = 'block';
        initAIServer();
    }, 3000);
}

// 3. Original Signal Engine (30s Logic)
let lastBlockId = -1;
let currentPrediction = { res: "---", nums: "--", color: "#fff" };

function initAIServer() {
    setInterval(() => {
        const now = new Date();
        const sec = now.getSeconds();
        const timeframe = 30; // 30s original logic
        const remains = timeframe - (sec % timeframe);
        const blockId = Math.floor(now.getTime() / (timeframe * 1000));

        const resultText = document.getElementById('result-text');
        
        if (remains >= 27) {
            resultText.innerText = "WAITING";
            document.getElementById('period-label').innerText = "SCANNING DATA";
        } else {
            if (blockId !== lastBlockId) {
                lastBlockId = blockId;
                runAnalysis(blockId);
            }
            resultText.innerText = currentPrediction.res;
            resultText.style.color = currentPrediction.color;
            document.getElementById('lucky-num').innerText = currentPrediction.nums;
            document.getElementById('period-label').innerText = "WINGO SIGNAL";
        }

        document.getElementById('timer-val').innerText = remains;
        document.getElementById('wave-progress').style.width = (remains / timeframe) * 100 + "%";
    }, 1000);
}

function runAnalysis(blockId) {
    let seed = (blockId * 0x7FFFFFFF) % 1234567;
    let res = (seed % 10) > 4 ? "BIG" : "SMALL";
    
    currentPrediction.res = res;
    if (res === "BIG") {
        currentPrediction.color = "#00d2ff";
        currentPrediction.nums = (5 + (seed % 5)) + " & " + (5 + ((seed+2) % 5));
    } else {
        currentPrediction.color = "#ff00f7";
        currentPrediction.nums = (seed % 5) + " & " + ((seed+3) % 5);
    }
}

// 4. Compact Drag Logic
const box = document.getElementById('main-box');
const handle = document.getElementById('drag-handle');
let isDrag = false, offset = [0,0];

handle.onmousedown = (e) => {
    isDrag = true;
    offset = [box.offsetLeft - e.clientX, box.offsetTop - e.clientY];
};
document.onmousemove = (e) => {
    if (!isDrag) return;
    box.style.left = (e.clientX + offset[0]) + 'px';
    box.style.top = (e.clientY + offset[1]) + 'px';
    box.style.transform = 'none';
};
document.onmouseup = () => isDrag = false;

// Touch for Mobile
handle.ontouchstart = (e) => {
    isDrag = true;
    offset = [box.offsetLeft - e.touches[0].clientX, box.offsetTop - e.touches[0].clientY];
};
document.ontouchmove = (e) => {
    if (!isDrag) return;
    box.style.left = (e.touches[0].clientX + offset[0]) + 'px';
    box.style.top = (e.touches[0].clientY + offset[1]) + 'px';
};
document.ontouchend = () => isDrag = false;
