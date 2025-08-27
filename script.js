const container = document.querySelector('.container');
const face = document.querySelector('.face-slider');
const btnHappy = document.querySelector('.button-happy');
const btnUnhappy = document.querySelector('.button-unhappy');
const title = document.querySelector('.title');
const subtitle = document.querySelector('.subtitle');
const begModal = document.getElementById('begModal');
const btnReject = document.querySelector('.button-reject');
const btnAgree = document.querySelector('.button-agree');

const nameVerifyModal = document.getElementById('nameVerifyModal');
const verifyInput = document.querySelector('.verify-input');
const verifyBtn = document.querySelector('.button-verify');
const nameRetryModal = document.getElementById('nameRetryModal');
const retryInput = document.querySelector('.retry-input');
const retryBtn = document.querySelector('.button-retry');

const backButtons = document.querySelectorAll('.button-back');

const config = {
    maxUnhappyCount: 1,
    animationSpeed: 0.1,
    newPageUrl: 'newPage.html',
    states: {
        normal: {
            face: { happiness: 0.9, derp: 1, px: 0.5, py: 0.5 },
            ui: {
                btnHappyText: '愿意',
                btnUnhappyText: '不愿意',
                titleText: '刘欢',
                subtitleText: '你愿意做我女朋友吗'
            }
        },
        happy: {
            face: { happiness: 1, derp: 0, px: 0.5, py: 0.5 },
        },
        unhappy: {
            face: { happiness: 0.2, derp: 0.8, px: 0.5, py: 0.5 },
            ui: {
                titleText: '就答应我吧',
                subtitleText: '不然我会难过的'
            }
        }
    }
};

const state = {
    rejectCount: 0,
    animationId: null,
    current: { ...config.states.normal.face },
    target: { ...config.states.normal.face }
};

function updateFaceCSS() {
    Object.entries(state.current).forEach(([prop, value]) => {
        face.style.setProperty(`--${prop}`, value);
    });
}

function transitionToState(stateType, hideButton = null) {
    const targetState = config.states[stateType];
    if (targetState.face) Object.assign(state.current, targetState.face);
    if (targetState.ui) {
        const { btnHappyText, btnUnhappyText, titleText, subtitleText } = targetState.ui;
        if (btnHappyText) btnHappy.innerHTML = btnHappyText;
        if (btnUnhappyText) btnUnhappy.innerHTML = btnUnhappyText;
        if (titleText) title.innerHTML = titleText;
        if (subtitleText) subtitle.innerHTML = subtitleText;
    }
    if (hideButton) hideButton.style.visibility = 'hidden';
    else {
        btnHappy.style.visibility = 'visible';
        btnUnhappy.style.visibility = 'visible';
        btnUnhappy.style.position = 'static';
        btnUnhappy.style.left = '';
        btnUnhappy.style.top = '';
        btnHappy.style.transform = 'scale(1)';
    }
    updateFaceCSS();
}

function stopAnimation() {
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
}

function startAnimation() {
    function updateFace() {
        let needsUpdate = false;
        for (const prop in state.target) {
            if (state.target[prop] === state.current[prop]) continue;
            needsUpdate = true;
            if (Math.abs(state.target[prop] - state.current[prop]) < 0.01) {
                state.current[prop] = state.target[prop];
            } else {
                state.current[prop] += (state.target[prop] - state.current[prop]) * config.animationSpeed;
            }
        }
        if (needsUpdate) updateFaceCSS();
        state.animationId = requestAnimationFrame(updateFace);
    }
    updateFace();
}

function hideModal() {
    begModal.style.display = 'none';
    nameVerifyModal.style.display = 'none';
    nameRetryModal.style.display = 'none';
    startAnimation();
}

function goToNewPage() {
    window.location.href = config.newPageUrl;
}

function goToHomePage() {
    // 关闭所有弹窗 + 重置页面状态
    hideModal();
    state.rejectCount = 0;
    transitionToState('normal');
    startAnimation();
    window.location.href = 'index.html';
}

function handleVerifySubmit() {
    const inputName = verifyInput.value.trim(); 
    if (inputName === 'sxc') {
        nameVerifyModal.style.display = 'none';
        goToNewPage();
    } else {
        nameVerifyModal.style.display = 'none';
        nameRetryModal.style.display = 'flex';
        retryInput.value = '';
        retryInput.focus();
    }
}

function handleRetrySubmit() {
    const inputName = retryInput.value.trim();
    if (inputName === 'sxc') {
        nameRetryModal.style.display = 'none';
        goToNewPage();
    } else {
        retryInput.value = '';
        retryInput.focus();
        retryInput.classList.add('shake');
        setTimeout(() => retryInput.classList.remove('shake'), 500);
    }
}

container.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    const unhappyRect = btnUnhappy.getBoundingClientRect();
    const happyRect = btnHappy.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const dx1 = x - (unhappyRect.x + unhappyRect.width * 0.5);
    const dy1 = y - (unhappyRect.y + unhappyRect.height * 0.5);
    const dx2 = x - (happyRect.x + happyRect.width * 0.5);
    const dy2 = y - (happyRect.y + happyRect.height * 0.5);

    const px = (x - containerRect.x) / containerRect.width;
    const py = (y - containerRect.y) / containerRect.height;

    const distUnhappy = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const distHappy = Math.sqrt(dx2 * dx2 + dy2 * dy2);
    const happiness = Math.pow(distUnhappy / (distHappy + distUnhappy), 0.75);

    state.target = { ...state.target, happiness, derp: 0, px, py };
});

container.addEventListener('mouseleave', () => {
    state.target = { ...config.states.normal.face };
});

btnHappy.addEventListener('click', () => {
    if (state.animationId) {
        btnHappy.style.transform = 'scale(1)';
        stopAnimation();
        transitionToState('happy', btnUnhappy);
    } else {
        state.rejectCount = 0;
        transitionToState('normal');
        startAnimation();
    }
    hideModal();
    nameVerifyModal.style.display = 'flex';
    verifyInput.value = '';
    verifyInput.focus();
});

btnUnhappy.addEventListener('click', () => {
    if (state.animationId) {
        state.rejectCount++;
        if (state.rejectCount >= config.maxUnhappyCount) {
            stopAnimation();
            transitionToState('unhappy', btnHappy);
        } else {
            btnUnhappy.style.position = 'absolute';
            btnUnhappy.style.left = `${Math.random() * 80}%`;
            btnUnhappy.style.top = `${Math.random() * 80}%`;
            state.target.happiness = Math.max(0.1, state.target.happiness - 0.1);
            btnHappy.style.transform = `scale(${1 + state.rejectCount * 0.1})`;
        }
    } else {
        state.rejectCount = 0;
        transitionToState('normal');
        startAnimation();
    }
    showModal();
});

btnReject.addEventListener('click', () => {
    hideModal();
    setTimeout(showModal, 100);
});

btnAgree.addEventListener('click', () => {
    hideModal();
    nameVerifyModal.style.display = 'flex';
    verifyInput.value = '';
    verifyInput.focus();
});

verifyBtn.addEventListener('click', handleVerifySubmit);

retryBtn.addEventListener('click', handleRetrySubmit);

verifyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleVerifySubmit();
});

retryInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleRetrySubmit();
});

backButtons.forEach(button => {
    button.addEventListener('click', goToHomePage);
});

startAnimation();

function showModal() {
    begModal.style.display = 'flex';
    stopAnimation();
}
