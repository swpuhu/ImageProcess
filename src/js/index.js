import menu from './menu/menu.js'
import Drawer from './console/canvas.js';
import util from './util/util.js';
import gamaProcess from './process/gamaProcess.js';
import balanceProcess from './process/histogramBalanceProcess.js';
import smoothProcess from './process/smoothProcess.js';
import PlainBox from './components/plainBox.js';
window.util = util;

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

    processR && processR.remove();
    processG && processG.remove();
    processB && processB.remove();

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


let histogramBalance = util.createElement('div', ['histogram-balance']);
let histogramBalanceBtn = util.createElement('button', ['hist-balance__btn']);
histogramBalanceBtn.innerText = '直方图均衡';
util.appendChildren(histogramBalance, histogramBalanceBtn);


let smoothProcessDiv = util.createElement('div', ['smooth-process']);
let smoothProcessBtn = util.createElement('button', ['smooth-process__btn']);
smoothProcessBtn.innerText = '平滑处理';


let convolution = util.createElement('div', ['convolution-process']);
let convolutionBtn = util.createElement('button', ['convolution-process__btn']);
convolutionBtn.innerText = '卷积';
util.appendChildren(convolution, convolutionBtn);


util.appendChildren(smoothProcessDiv, smoothProcessBtn);
util.appendChildren(btnGroups, gama, histogramBalance, smoothProcessDiv, convolution);
util.appendChildren(processZone, btnGroups);

gamaProcessBtn.onclick = function (e) {
    let data = originDrawer.getImageData(originCanvas);
    if (openBtn.isGrayMode) {
        processDrawer.updateHistogram(processR, data, gamaProcess.bind(this, data, +gamaParamCInput.value, +gamaParamRInput.value), 'gray');
    } else {
        processDrawer.updateHistogram(processR, data, gamaProcess.bind(this, data, +gamaParamCInput.value, +gamaParamRInput.value), 'r');
        processDrawer.updateHistogram(processG, data, gamaProcess.bind(this, data, +gamaParamCInput.value, +gamaParamRInput.value), 'g');
        processDrawer.updateHistogram(processB, data, gamaProcess.bind(this, data, +gamaParamCInput.value, +gamaParamRInput.value), 'b');
    }
}

histogramBalanceBtn.onclick = function (e) {
    let data = originDrawer.getImageData(originCanvas);
    if (openBtn.isGrayMode) {
        processDrawer.updateHistogram(processR, data, balanceProcess.bind(this, data), 'gray');
    } else {
        processDrawer.updateHistogram(processR, data, balanceProcess.bind(this, data), 'r');
        processDrawer.updateHistogram(processG, data, balanceProcess.bind(this, data), 'g');
        processDrawer.updateHistogram(processB, data, balanceProcess.bind(this, data), 'b');
    }
}


smoothProcessBtn.onclick = function (e) {
    let data = originDrawer.getImageData(originCanvas);
    if (openBtn.isGrayMode) {
        processDrawer.updateHistogram(processR, data, smoothProcess.bind(this, data), 'gray');
    } else {
        processDrawer.updateHistogram(processR, data, smoothProcess.bind(this, data), 'r');
        processDrawer.updateHistogram(processG, data, smoothProcess.bind(this, data), 'g');
        processDrawer.updateHistogram(processB, data, smoothProcess.bind(this, data), 'b');
    }

}


convolutionBtn.onclick = function () {
    let plainBox = PlainBox('卷积', 'convolution');
    document.body.appendChild(plainBox.ref);
}