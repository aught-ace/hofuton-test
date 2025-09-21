'use strict';

// 要素
const element = {
    ukenagasu: document.querySelector('#ukenagasu'),
    taeru: document.querySelector('#taeru'),
    sub: document.querySelector('#hp-sub-gage'),
    main: document.querySelector('#hp-main-gage'),
    percent: document.querySelector('#percent'),
    message: document.querySelector('#message'),
};

// パラメータ
const param = {
    sub: 0,
    main: 100,
    percent: 0,
    squeezed: '',
    count: 0,
};

// 値の表示更新
const update = () => {
    if(param.percent >= 100 && param.squeezed === '') param.squeezed = 'percent';
    if(param.main <= 0 && param.sub <= 0 && param.squeezed === '') param.squeezed = 'hp';

    else if(param.squeezed === 'hp') element.message.textContent = 'HPゼロ、捕布団が満足できなくてLvしぼる！';
    if(param.squeezed === 'percent') element.message.textContent = '%カンスト、もうだめ、捕布団にLvしぼられる！';

    param.sub = Math.max(0, Math.min(100, param.sub));
    param.main = Math.max(0, Math.min(100, param.main));
    param.percent = Math.max(0, Math.min(100, param.percent));

    const sub = param.sub * 10;
    const main = param.main * 10;

    element.main.style.gridColumnStart = Math.ceil(1001 - (main + sub));
    element.main.style.gridColumnEnd =   Math.ceil(1001 - sub);
    element.sub.style.gridColumnStart =  Math.ceil(1001 - sub);

    element.percent.textContent = Math.floor(param.percent);

    element.sub.style.display = param.sub > 0 ? 'block': 'none';
    element.main.style.display = param.main > 0 ? 'block': 'none';
};

let prevTimestamp = 0; // 前回フレームのタイムスタンプ
// フレーム
const frame = (timestamp) => {
    requestAnimationFrame(frame);
    const deltaTime = (timestamp - prevTimestamp) / 1000;

    if(param.squeezed === '') {
        param.sub -= param.sub * 0.05 * deltaTime;
        param.percent -= param.percent * 0.01 * deltaTime;
    }

    update();

    prevTimestamp = timestamp;
}
requestAnimationFrame(frame);

// 耐えるボタンを押した
element.taeru.addEventListener('pointerdown', (e) => {
    if(e.target.className === '') e.target.className = 'down';
    if(param.squeezed !== '') return;

    param.percent += 1;

    let damage = (param.percent + 1) / 64;
    param.main -= damage;
    if(param.main < 0) damage = param.main;
    param.sub += damage;

    param.count++;

    update();
});
// 受け流すボタンを押した
element.ukenagasu.addEventListener('pointerdown', (e) => {
    if(e.target.className === '') e.target.className = 'down';
    if(param.squeezed !== '') return;

    param.percent += 0.25;

    let damage = (param.percent + 1) / 64;
    param.sub -= damage;
    if(param.sub < 0) damage = -param.sub;
    else damage /= 4;
    param.main -= damage;

    param.count++;

    update();
});

// ボタンを離した
element.ukenagasu.addEventListener('pointerup', (e) => {
    if(e.target.className === 'down') e.target.className = '';
});
element.taeru.addEventListener('pointerup', (e) => {
    if(e.target.className === 'down') e.target.className = '';
});