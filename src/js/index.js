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
        util.appendChildren(originZone, originR, originG, originB);
    }
}

let btnGroups = util.createElement('div', ['btn-group']);
let gamaProcessBtn = util.createElement('button', ['gama']);
gamaProcessBtn.innerText = '伽马变换';
util.appendChildren(btnGroups, gamaProcessBtn);
util.appendChildren(processZone, btnGroups);

gamaProcessBtn.onclick = function (e) {
    let data = processDrawer.getImageData();
    gamaProcess(data);
}