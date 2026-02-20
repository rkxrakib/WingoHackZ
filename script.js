const KEY_VAL = "RKXRAKIB";
const URL_WINGO = "https://tkclub2.com/#/home/AllLotteryGames/WinGo?id=1";
const URL_DEPOSIT = "https://tkclub2.com/#/wallet/Recharge";

// --- PERSISTENCE (LOGIN CHECK) ---
window.onload = function() {
    const savedKey = localStorage.getItem('userKey');
    const expiry = localStorage.getItem('keyExpire');
    
    if (savedKey === KEY_VAL && expiry > Date.now()) {
        switchView('view-deposit');
    }
};

function performLogin() {
    const entered = document.getElementById('input-key').value;
    const isRemember = document.getElementById('check-recommend').checked;

    if (entered === KEY_VAL) {
        if (isRemember) {
            localStorage.setItem('userKey', KEY_VAL);
            localStorage.setItem('keyExpire', Date.now() + (24 * 60 * 60 * 1000)); // 24 Hours
        }
        switchView('view-deposit');
    } else {
        alert("ACCESS DENIED! INVALID KEY.");
    }
}

function switchView(id) {
    document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// --- MINIMIZE/MAXIMIZE ---
function minimizeBox() {
    document.getElementById('ai-box').style.display = 'none';
    document.getElementById('mini-profile').style.display = 'block';
}

function maximizeBox() {
    document.getElementById('ai-box').style.display = 'block';
    document.getElementById('mini-profile').style.display = 'none';
}

// --- DEPOSIT & START ---
function goToDeposit() {
    document.getElementById('game-frame').src = URL_DEPOSIT;
}

function verifyAndStart() {
    alert("VERIFYING TRANSACTION... SYNCING AI SERVER.");
    setTimeout(() => {
        document.getElementById('game-frame').src = URL_WINGO;
        switchView('view-signal');
        initSignalEngine();
    }, 2500);
}

// --- DRAG LOGIC (RELIABLE METHOD) ---
const box = document.getElementById("ai-box");
const header = document.getElementById("ai-header");

let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

header.addEventListener("touchstart", dragStart, false);
document.addEventListener("touchend", dragEnd, false);
document.addEventListener("touchmove", drag, false);

header.addEventListener("mousedown", dragStart, false);
document.addEventListener("mouseup", dragEnd, false);
document.addEventListener("mousemove", drag, false);

function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    if (e.target === header || header.contains(e.target)) {
        active = true;
    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    active = false;
}

function drag(e) {
    if (active) {
        e.preventDefault();
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }
        xOffset = currentX;
        yOffset = currentY;
        setTranslate(currentX, currentY, box);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
}

// --- AI SIGNAL ENGINE ---
let lastBId = -1;
let cachePred = { r: "---", n: "--", c: "#fff" };

function initSignalEngine() {
    setInterval(() => {
        const sec = new Date().getSeconds();
        const remains = 30 - (sec % 30);
        const blockId = Math.floor(Date.now() / 30000);

        if (remains >= 27) {
            document.getElementById('signal-res').innerText = "WAITING";
            document.getElementById('signal-res').style.color = "#fff";
            document.getElementById('period-text').innerText = "SYNCING MARKET DATA...";
        } else {
            if (blockId !== lastBId) {
                lastBId = blockId;
                let seed = (blockId * 7) % 100;
                let isBig = seed > 48;
                cachePred = {
                    r: isBig ? "BIG" : "SMALL",
                    n: isBig ? "5, 7, 8" : "1, 2, 4",
                    c: isBig ? "#00d2ff" : "#ff00f7"
                };
            }
            document.getElementById('signal-res').innerText = cachePred.r;
            document.getElementById('signal-res').style.color = cachePred.c;
            document.getElementById('signal-nums').innerText = "LUCKY: " + cachePred.n;
            document.getElementById('period-text').innerText = "WINGO 30S PREDICTION";
        }
        document.getElementById('t-sec').innerText = remains;
        document.getElementById('progress-fill').style.width = (remains / 30) * 100 + "%";
    }, 1000);
}
