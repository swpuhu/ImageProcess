import DIRECTION from '../Enum/direction.js';
import util from '../util/util.js';
/**
 *
 * @param {HTMLCanvasElement} canvas
 */
export default function (canvas, isGray = true) {
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
    function draw(img) {
        let ctx = canvas.getContext('2d');
        canvas.width = 640;
        canvas.height = 360;
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
            canvas.height = drawHeight;
            // ctx.drawImage(img, zone.x, zone.y, zone.width, zone.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else {
            let drawWidth = height * imgScale;
            let offsetX = (width - drawWidth) / 2;
            zone.x = offsetX;
            zone.width = drawWidth;
            canvas.width = drawWidth;
            // ctx.drawImage(img, zone.x, zone.y, zone.width, zone.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
        if (isGray) {
            // let data = ctx.getImageData(zone.x, zone.y, zone.width, zone.height);
            let data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < data.data.length; i += 4) {
                let m = ~~((data.data[i] + data.data[i + 1] + data.data[i + 2]) / 3);
                data.data[i] = data.data[i + 1] = data.data[i + 2] = m;
            }
            // ctx.putImageData(data, zone.x, zone.y);
            ctx.putImageData(data, 0, 0);
        }
    }

    function getImageData(canvas) {
        let _ctx = canvas.getContext('2d');
        // return _ctx.getImageData(zone.x, zone.y, zone.width, zone.height);
        return _ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    /**
     *
     * @param {ImageData} imageData
     */
    function putImageData(canvas, imageData) {
        let _ctx = canvas.getContext('2d');
        _ctx.clearRect(0, 0, canvas.width, canvas.height);
        _ctx.putImageData(imageData, 0, 0);
    }


    function drawHistogram() {
        let ctx = canvas.getContext('2d');
        // let imageData = ctx.getImageData(zone.x, zone.y, zone.width, zone.height);
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let histogramData = new Array(256);

        // 初始化数组
        for (let i = 0; i < histogramData.length; i++) {
            histogramData[i] = 0;
        }

        // 统计像素信息
        for (let i = 0; i < data.length; i++) {
            // histogramData[data[i]] = histogramData[data[i]] + 1 / data.length;
            ++histogramData[data[i]]
        }

        // 找到哪个像素值最多
        let max = histogramData[0];
        for (let i = 1; i < histogramData.length; i++) {
            if (histogramData[i] > max) {
                max = histogramData[i];
            }
            // if (histogramData[i] === 0) {
            //     console.log(i);
            // }
        }

        // 确定绘制步长
        let hStep = ~~(canvas.width / histogramData.length);
        let vStep = canvas.height / max;

        // 绘制
        for (let i = 0; i < histogramData.length; i++) {
            ctx.rect(i * hStep, canvas.height - vStep * histogramData[i], hStep, vStep * histogramData[i]);
        }

        // 根据类型确定绘制颜色
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

    /**
     *
     * @param {HTMLCanvasElement} canvas
     * @param {ImageData} data
     * @param {Function} fn 异步
     */
    async function updateHistogram(hisCanvas, data, fn, type = 'gray') {
        let res = await fn();
        putImageData(canvas ,res);

        let histogramData = new Array(res.data.length / 4);
        if (type === 'gray' || type === 'r') {
            for (let i = 0, j = 0; i < res.data.length; i += 4) {
                histogramData[j++] = res.data[i];
            }
        } else if (type === 'g') {
            for (let i = 0, j = 0; i < res.data.length; i += 4) {
                histogramData[j++] = res.data[i + 1];
            }
        } else if (type === 'b') {
            for (let i = 0, j = 0; i < res.data.length; i += 4) {
                histogramData[j++] = res.data[i + 2];
            }
        }
        drawSingleHistogram(histogramData, hisCanvas, type);
    }
    return {
        draw,
        drawHistogram,
        getImageData,
        putImageData,
        updateHistogram
    }
}