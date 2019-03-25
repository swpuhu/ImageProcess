// import util from '../util/util.js';

onmessage = function (e) {
    let imageData = e.data;
    let M = imageData.width;
    let N = imageData.height;
    let kernal = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    imageData.data = util.convolution(kernal, 3, 3, imageData.data, M, N, 1 / 16);
    console.log(1);
    postMessage(imageData);
}