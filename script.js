// ========== GLOBAL STATE ==========
let currentScreen = 'loader';
let selectedChoice = null;
let envelopeOpened = false;
const TOTAL_CHAPTERS = 5;

// ========== CANVAS STARS ==========
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let stars = [];
let w, h;

function resizeCanvas() {
    w = bgCanvas.width = window.innerWidth;
    h = bgCanvas.height = window.innerHeight;
}

function initStars() {
    stars = [];
    for (let i = 0; i < 280; i++) {
        stars.push({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.6 + 0.2,
            alpha: Math.random() * 0.7 + 0.1,
            speed: Math.random() * 0.3 + 0.05,
            phase: Math.random() * Math.PI * 2,
            color: Math.random() < 0.3 ? '#d8b4fe' : Math.random() < 0.5 ? '#f9a8d4' : '#ffffff'
        });
    }
}

function animStars(t) {
    if (!bgCtx) return;
    bgCtx.clearRect(0, 0, w, h);
    stars.forEach(s => {
        const a = s.alpha * (0.5 + 0.5 * Math.sin(t * 0.001 * s.speed * 3 + s.phase));
        bgCtx.save();
        bgCtx.globalAlpha = a;
        bgCtx.fillStyle = s.color;
        bgCtx.shadowColor = s.color;
        bgCtx.shadowBlur = s.r * 4;
        bgCtx.beginPath();
        bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
    });
    requestAnimationFrame(animStars);
}

// ========== CONFETTI SYSTEM ==========
const confCanvas = document.getElementById('confettiCanvas');
const confCtx = confCanvas.getContext('2d');
let confParticles = [];
let confRunning = false;

function resizeConf() {
    confCanvas.width = window.innerWidth;
    confCanvas.height = window.innerHeight;
}

function launchConfetti() {
    confRunning = true;
    const colors = ['#c77dff', '#f9a8d4', '#fbbf24', '#ffffff', '#a855f7', '#fce7f3', '#d8b4fe'];
    for (let i = 0; i < 200; i++) {
        setTimeout(() => {
            confParticles.push({
                x: Math.random() * confCanvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8,
                shape: Math.random() < 0.5 ? 'rect' : 'circle',
                alpha: 1,
                decay: Math.random() * 0.008 + 0.003
            });
        }, i * 15);
    }
    animConf();
}

function animConf() {
    if (!confRunning) return;
    confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    confParticles = confParticles.filter(p => p.alpha > 0.01);
    confParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.rotation += p.rotSpeed;
        p.alpha -= p.decay;
        confCtx.save();
        confCtx.globalAlpha = p.alpha;
        confCtx.translate(p.x, p.y);
        confCtx.rotate(p.rotation * Math.PI / 180);
        confCtx.fillStyle = p.color;
        confCtx.shadowColor = p.color;
        confCtx.shadowBlur = 6;
        if (p.shape === 'rect') {
            confCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
            confCtx.beginPath();
            confCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            confCtx.fill();
        }
        confCtx.restore();
    });
    if (confParticles.length > 0) {
        requestAnimationFrame(animConf);
    } else {
        confRunning = false;
        confCtx.clearRect(0, 0, confCanvas.width, confCanvas.height);
    }
}

// ========== CURSOR TRAIL ==========
const cursorColors = ['#d8b4fe', '#f9a8d4', '#a855f7', '#fbbf24'];
let cursorTimeout;
document.addEventListener('mousemove', (e) => {
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => {
        const spark = document.createElement('div');
        spark.className = 'cursor-spark';
        spark.style.left = e.clientX + 'px';
        spark.style.top = e.clientY + 'px';
        spark.style.background = cursorColors[Math.floor(Math.random() * cursorColors.length)];
        spark.style.boxShadow = `0 0 8px ${spark.style.background}`;
        spark.style.opacity = '0.8';
        document.body.appendChild(spark);
        spark.animate([
            { transform: 'scale(1)', opacity: 0.8 },
            { transform: 'scale(2) translateY(-20px)', opacity: 0 }
        ], { duration: 700, easing: 'ease-out' }).onfinish = () => spark.remove();
    }, 16);
});

// ========== FLOATING PETALS ==========
function spawnPetals() {
    const petals = ['🌸', '✦', '💜', '✧', '🌷', '⭐'];
    for (let i = 0; i < 18; i++) {
        const p = document.createElement('div');
        p.className = 'petal';
        p.textContent = petals[Math.floor(Math.random() * petals.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.fontSize = (Math.random() * 14 + 10) + 'px';
        const dur = Math.random() * 15 + 12;
        p.style.animationDuration = dur + 's';
        p.style.animationDelay = (Math.random() * 20) + 's';
        document.body.appendChild(p);
    }
}

// ========== PROGRESS DOTS ==========
function renderDots(chNum) {
    for (let i = 1; i <= TOTAL_CHAPTERS; i++) {
        const el = document.getElementById('dots' + i);
        if (!el) continue;
        el.innerHTML = '';
        for (let d = 1; d <= TOTAL_CHAPTERS; d++) {
            const dot = document.createElement('div');
            dot.className = 'dot' + (d < chNum ? ' done' : d === chNum ? ' current' : '');
            el.appendChild(dot);
        }
    }
}

// ========== SCREEN TRANSITIONS ==========
const screenMap = {
    loader: 'loader',
    1: 'ch1', 2: 'ch2', 3: 'ch3', 4: 'ch4', 5: 'ch5',
    final: 'finalScreen'
};

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    const el = document.getElementById(id);
    if (el) {
        setTimeout(() => el.classList.add('active'), 50);
    }
}

function wipeTransition(cb) {
    const wipe = document.getElementById('wipe');
    wipe.classList.add('active');
    setTimeout(() => {
        cb();
        setTimeout(() => {
            wipe.classList.remove('active');
            wipe.classList.add('out');
            setTimeout(() => wipe.classList.remove('out'), 600);
        }, 200);
    }, 500);
}

function goTo(num) {
    wipeTransition(() => {
        showScreen(screenMap[num]);
        renderDots(num);
    });
}

function goToFinal() {
    wipeTransition(() => {
        showScreen('finalScreen');
        setTimeout(() => {
            launchConfetti();
            setTimeout(launchConfetti, 1200);
        }, 400);
    });
}

function restartExperience() {
    wipeTransition(() => {
        location.reload();
    });
}

// ========== CHOICE MECHANIC ==========
function selectChoice(el, key) {
    document.querySelectorAll('.choice-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    selectedChoice = key;
    const btn = document.getElementById('ch3Btn');
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'all';
    const spark = document.createElement('div');
    spark.style.cssText = `position:absolute;inset:0;border-radius:18px;background:radial-gradient(circle at center,rgba(168,85,247,0.3),transparent);pointer-events:none;`;
    el.appendChild(spark);
    setTimeout(() => spark.remove(), 600);
}

// ========== ENVELOPE REVEAL ==========
function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;
    const env = document.getElementById('envelope');
    env.classList.add('open');
    document.getElementById('envHint').style.opacity = '0';
    const letter = document.getElementById('letterContent');
    setTimeout(() => {
        letter.classList.add('open');
        setTimeout(() => {
            const btnWrap = document.getElementById('ch4Btn');
            btnWrap.style.opacity = '1';
        }, 1000);
    }, 700);
}

// ========== MUSIC (gentle background) ==========
function startMusic() {
    const frame = document.getElementById('ytFrame');
    frame.src = 'https://www.youtube.com/embed/dNEnzdcnWzE?autoplay=1&loop=1&playlist=dNEnzdcnWzE&start=44&controls=0&rel=0&modestbranding=1&enablejsapi=0';
}

// ========== LOADER ANIMATION ==========
const loadMessages = [
    'Weaving starlight together...',
    'Gathering every warm memory...',
    'Writing the words that matter...',
    'Polishing every little detail...',
    'Wrapping it all in love...',
    'Almost ready for you...',
    'This is going to be beautiful...'
];

function runLoader() {
    const bar = document.getElementById('progressBar');
    const pct = document.getElementById('pct');
    const status = document.getElementById('progressStatus');
    let progress = 0;
    let msgIdx = 0;

    const interval = setInterval(() => {
        const step = Math.random() * 2 + 0.5;
        progress = Math.min(100, progress + step);
        bar.style.width = progress + '%';
        pct.textContent = Math.floor(progress) + '%';

        const newIdx = Math.min(loadMessages.length - 1, Math.floor(progress / 15));
        if (newIdx !== msgIdx) {
            msgIdx = newIdx;
            status.style.opacity = '0';
            setTimeout(() => {
                status.textContent = loadMessages[msgIdx];
                status.style.opacity = '1';
            }, 300);
        }

        if (progress >= 100) {
            clearInterval(interval);
            status.textContent = 'Ready. ✦';
            setTimeout(() => {
                startMusic();
                goTo(1);
            }, 800);
        }
    }, 80);
}

// ========== INITIALIZE ==========
window.addEventListener('resize', () => {
    resizeCanvas();
    resizeConf();
    initStars();
});

window.onload = () => {
    resizeCanvas();
    resizeConf();
    initStars();
    requestAnimationFrame(animStars);
    spawnPetals();
    renderDots(1);
    setTimeout(runLoader, 1800);
};