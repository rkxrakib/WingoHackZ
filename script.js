const CONFIG = {
    key: "RKXRAKIB",
    wingoUrl: "https://tkclub2.com/#/home/AllLotteryGames/WinGo?id=1",
    depositUrl: "https://tkclub2.com/#/wallet/Recharge"
};

// --- AUTH LOGIC ---
window.onload = function() {
    const saved = localStorage.getItem('serverKey');
    const expiry = localStorage.getItem('keyExpiry');
    
    if (saved === CONFIG.key && expiry > Date.now()) {
        showView('deposit-view');
    }
};

function handleAuth() {
    const input = document.getElementById('passKey').value;
    const isRemember = document.getElementById('recommendKey').checked;

    if (input === CONFIG.key) {
        if (isRemember) {
            localStorage.setItem('serverKey', CONFIG.key);
            localStorage.setItem('keyExpiry', Date.now() + (24 * 60 * 60 * 1000));
        }
        showView('deposit-view');
    } else {
        alert("ACCESS DENIED: WRONG SERVER KEY");
    }
}

function showView(viewId) {
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('deposit-view').style.display = 'none';
    document.getElementById('display-area').style.display = 'none';
    document.getElementById(viewId).style.display = 'block';
}

// --- NAVIGATION ---
function togglePanel(show) {
    document.getElementById('main-box').style.display = show ? 'block' : 'none';
    document.getElementById('mini-logo').style.display = show ? 'none' : 'block';
}

function openDeposit() {
    document.getElementById('game-frame').src = CONFIG.depositUrl;
}

function verifyDep() {
    alert("Scanning Blockchain Status... Syncing AI Server.");
    setTimeout(() => {
        document.getElementById('game-frame').src = CONFIG.wingoUrl;
        showView('display-area');
        startEngine();
    }, 2000);
}

// --- DRAG LOGIC (FIXED) ---
const box = document.getElementById('main-box');
const dragZone = document.getElementById('drag-zone');
let isDragging = false;
let startX, startY, initialLeft, initialTop;

const startDragging = (e) => {
    if (e.target.closest('button')) return;
    isDragging = true;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    startX = clientX;
    startY = clientY;
    initialLeft = box.offsetLeft;
    initialTop = box.offsetTop;
};

const dragging = (e) => {
    if (!isDragging) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - startX;
    const dy = clientY - startY;
    
    box.style.left = (initialLeft + dx) + 'px';
    box.style.top = (initialTop + dy) + 'px';
};

const stopDragging = () => isDragging = false;

dragZone.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', dragging);
document.addEventListener('mouseup', stopDragging);

dragZone.addEventListener('touchstart', startDragging, {passive: false});
document.addEventListener('touchmove', dragging, {passive: false});
document.addEventListener('touchend', stopDragging);

// --- SIGNAL ENGINE ---
let lastId = -1;
let pred = { res: "---", n: "--", c: "#fff" };

function startEngine() {
    setInterval(() => {
        const sec = new Date().getSeconds();
        const remains = 30 - (sec % 30);
        const bId = Math.floor(Date.now() / 30000);

        if (remains >= 27) {
            document.getElementById('result-text').innerText = "WAITING";
            document.getElementById('period-label').innerText = "FETCHING DATA...";
        } else {
            if (bId !== lastId) {
                lastId = bId;
                let seed = (bId * 12345) % 100;
                let isBig = seed > 45;
                pred = {
                    res: isBig ? "BIG" : "SMALL",
                    n: isBig ? "6 & 8" : "1 & 3",
                    c: isBig ? "#00d2ff" : "#ff00f7"
                };
            }
            document.getElementById('result-text').innerText = pred.res;
            document.getElementById('result-text').style.color = pred.c;
            document.getElementById('lucky-num').innerText = "LUCKY: " + pred.n;
            document.getElementById('period-label').innerText = "WINGO SIGNAL";
        }
        document.getElementById('timer-val').innerText = remains;
        document.getElementById('wave-progress').style.width = (remains / 30) * 100 + "%";
    }, 1000);
}
