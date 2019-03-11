import menu from './menu/menu.js'
import Drawer from './console/canvas.js';
import util from './util/util.js';
import gamaProcess from './process/gamaProcess.js';

let header = document.getElementById('header');
let openBtn = menu();
header.appendChild(openBtn.ref);

let originR, originG, originB;
let processR, processG, processB;

let processZone = document.getElementById('processed');
let originZone = document.getElementById('origin');
let originDrawer, processDrawer;

openBtn.onchange = function (e) {
    let file = e.path[0].files[0];
    if (!/\.(jpg|png|bmp)/i.test(file.name)) {
        alert('not supported image type');
        return;
    }
    let originCanvas = document.getElementById('originCanvas');
    originDrawer = new Drawer(originCanvas, openBtn.isGrayMode);


    let processCanvas = document.getElementById('processCanvas');
    processDrawer = new Drawer(processCanvas, openBtn.isGrayMode);

    originR && originR.remove();
    originG && originG.remove();
    originB && originB.remove();
    let url = URL.createObjectURL(file);
    let image = new Image();
    image.src = url;
    image.onload = function () {
        originDrawer.draw(image);
        processDrawer.draw(image);
        [originR, originG, originB] = originDrawer.drawHistogram();
        [processR, processG, processB] = processDrawer.drawHistogram();

        util.appendChildren(originZone, originR, originG, originB);
        util.appendChildren(processZone, processR, processG, processB);
    }
}

let btnGroups = util.createElement('div', ['btn-group']);

let gama = util.createElement('div', ['gama']);
let gamaParamC = util.createElement('div', ['gama-c']);
let gamaParamCInput = util.createElement('input', ['gama-c__input'], {
    type: 'number',
    step: 0.1,
});
gamaParamCInput.value = 1;
let gamaParamCLabel = util.createElement('label', ['gama-c__label']);
gamaParamCLabel.innerText = 'C';
util.appendChildren(gamaParamC, gamaParamCLabel, gamaParamCInput);

let gamaParamR = util.createElement('div', ['gama-r']);
let gamaParamRInput = util.createElement('input', ['gama-r__input'], {
    type: 'number',
    step: 0.1,
});
gamaParamRInput.value = 1;
let gamaParamRLabel = util.createElement('label', ['gama-r__label']);
gamaParamRLabel.innerText = 'R';
util.appendChildren(gamaParamR, gamaParamRLabel, gamaParamRInput);

let gamaProcessBtn = util.createElement('button', ['gama-btn']);
gamaProcessBtn.innerText = '伽马变换';
util.appendChildren(gama, gamaProcessBtn, gamaParamC, gamaParamR);

util.appendChildren(btnGroups, gama);
util.appendChildren(processZone, btnGroups);

gamaProcessBtn.onclick = function (e) {
    let data = originDrawer.getImageData(originCanvas);
    processDrawer.updateHistogram(processR, data, gamaProcess.bind(this, data, +gamaParamCInput.value, +gamaParamRInput.value), 'gray');
}