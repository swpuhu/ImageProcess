import DIRECTION from '../Enum/direction.js';
import util from '../util/util.js';
/**
 *
 * @param {HTMLCanvasElement} canvas
 */
export default function (canvas, isGray = true) {
  let obj = {};
  let ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  let zone = {
    x: 0,
    y: 0,
    width: width,
    height: height
  }

  /**
   *
   * @param {HTMLImageElement} img
   */
  function draw (img) {
    let direction;
    let originWidth = img.naturalWidth;
    let originHeight = img.naturalHeight;
    let canvasScale = canvas.width / canvas.height;
    let imgScale = originWidth / originHeight;
    ctx.clearRect(0, 0, width, height);
    // 原始图片的长宽比大于canvas的长宽比，以图片的宽度为基准绘制
    if (imgScale > canvasScale) {
      let drawHeight = width / imgScale;
      let offsetY = (height - drawHeight) / 2
      zone.y = offsetY;
      zone.height = drawHeight;
      ctx.drawImage(img, zone.x, zone.y, zone.width, zone.height);
    } else {
      let drawWidth = height * imgScale;
      let offsetX = (width - drawWidth) / 2;
      zone.x = offsetX;
      zone.width = drawWidth;
      ctx.drawImage(img, zone.x, zone.y, zone.width, zone.height);
    }
    if (isGray) {
      let data = ctx.getImageData(zone.x, zone.y, zone.width, zone.height);
      for (let i = 0; i < data.data.length; i += 4) {
        let m = ~~((data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3);
        data.data[i] = data.data[i + 1] = data.data[i + 2] = m;
      }
      ctx.putImageData(data, zone.x, zone.y);
    }
  }

  function drawHistogram() {
    let imageData = ctx.getImageData(zone.x, zone.y, zone.width, zone.height);
    let canvasR = util.createElement('canvas', 'histogram-r');
    let canvasG = util.createElement('canvas', 'histogram-g');
    let canvasB = util.createElement('canvas', 'histogram-b');
    let data = imageData.data;
    let dataR = new Uint8ClampedArray(data.length / 4);
    let dataG = new Uint8ClampedArray(data.length / 4);
    let dataB = new Uint8ClampedArray(data.length / 4);
    if (isGray) {
      for (let i = 0, r = 0, g = 0, b = 0; i < data.length; i += 4) {
        dataR[r++] = data[i];
      }
    } else {
      for (let i = 0, r = 0, g = 0, b = 0; i < data.length; i += 4) {
        dataR[r++] = data[i];
        dataG[g++] = data[i + 1];
        dataB[b++] = data[i + 2];
      }
    }

    if (isGray) {
      drawSingleHistogram(dataR, canvasR, 'gray');
      return [canvasR];
    } else {
      drawSingleHistogram(dataR, canvasR, 'r');
      drawSingleHistogram(dataG, canvasG, 'g');
      drawSingleHistogram(dataB, canvasB, 'b');
      return [canvasR, canvasG, canvasB];
    }
  }
  /**
   *
   * @param {Array} data
   * @param {HTMLCanvasElement} canvas
   */
  function drawSingleHistogram(data, canvas, type = 'r') {
    canvas.width = 256;
    canvas.height = 150;
    let ctx = canvas.getContext('2d');
    let histogramData = new Array(256);

    for (let i = 0; i < histogramData.length; i++) {
      histogramData[i] = 0;
    }

    for (let i = 0; i < data.length; i++) {
      histogramData[data[i]] = histogramData[data[i]] + 1 / data.length;
      // (++histogramData[data[i]]) / data.length;
    }

    let max = histogramData[0];
    for (let i = 1; i < histogramData.length; i++) {
      if (histogramData[i] > max) {
        max = histogramData[i];
      }
    }

    let hStep = ~~(canvas.width / histogramData.length);
    let vStep = canvas.height / max;

    let magnifyScale = 15;
    for (let i = 0; i < histogramData.length; i++) {
      ctx.rect(i * hStep, canvas.height - magnifyScale * canvas.height * histogramData[i], hStep, magnifyScale * canvas.height * histogramData[i]);
    }
    if (type === 'r') {
      ctx.fillStyle = '#d818188a';
    } else if (type === 'g') {
      ctx.fillStyle = '#1bd8188a';
    } else if (type === 'b') {
      ctx.fillStyle = '#1877d88a';
    } else if (type === 'gray') {
      ctx.fillStyle = '#afafaf8a';
    }
    ctx.fill();
  }

  obj.draw = draw;
  obj.drawHistogram = drawHistogram;

  return obj;
}

