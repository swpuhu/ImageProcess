import util from '../util/util.js';
export default function (data) {
    return new Promise((resolve, reject) => {
        let imageData = data;
        let M = imageData.width;
        let N = imageData.height;
        let kernal = new Array(49);
        for (let i = 0; i < kernal.length; i++) {
            kernal[i] = 1;
        }
        let r = [], g = [], b = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
            r.push(imageData.data[i]);
            g.push(imageData.data[i + 1]);
            b.push(imageData.data[i + 2]);
        }
        let ar = util.convolution(kernal, 7, 7, r, M, N, 1 / 49);
        let ag = util.convolution(kernal, 7, 7, g, M, N, 1 / 49);
        let ab = util.convolution(kernal, 7, 7, b, M, N, 1 / 49);
        for (let i = 0, j = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = ar[j];
            imageData.data[i + 1] = ag[j];
            imageData.data[i + 2] = ab[j++];
        }
        resolve(imageData);
    });
}