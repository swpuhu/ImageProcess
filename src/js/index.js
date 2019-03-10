import menu from './menu/menu.js'
import Drawer from './console/canvas.js';
import util from './util/util.js';

let header = document.getElementById('header');
let openBtn = menu();

let originZone = document.getElementById('origin');
let originCanvas = document.getElementById('originCanvas');
let originDrawer = new Drawer(originCanvas);
let processZone = document.getElementById('processed');
let processCanvas = document.getElementById('processCanvas');
let processDrawer = new Drawer(processCanvas);
let originR, originG, originB;
let processR, processG, processB;

openBtn.onchange = function (e) {
  originR && originR.remove();
  originG && originG.remove();
  originB && originB.remove();
  let file = e.path[0].files[0];
  if (!/\.(jpg|png|bmp)/i.test(file.name)) {
    alert('not supported image type');
    return;
  }
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
header.appendChild(openBtn.ref);