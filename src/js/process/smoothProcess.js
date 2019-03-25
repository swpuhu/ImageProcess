import util from '../util/util.js';
export default function (data) {
    return new Promise((resolve, reject) => {
        let imageData = data;
        let M = imageData.width;
        let N = imageData.height;
        let kernal = new Array(25);
        for (let i = 0; i < kernal.length; i++) {
            kernal[i] = 1;
        }
        let r = [], g = [], b = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
            r.push(imageData.data[i]);
            g.push(imageData.data[i + 1]);
            b.push(imageData.data[i + 2]);
        }
        // let ar = util.convolution(kernal, 5, 5, r, M, N, 1 / 25);
        // let ag = util.convolution(kernal, 5, 5, g, M, N, 1 / 25);
        // let ab = util.convolution(kernal, 5, 5, b, M, N, 1 / 25);
        let ar = util.fillArray(imageData.data, M * 4, N, 2, 2)[0];
        ar = util.trimArray(ar, M * 4 + 4, N + 4, 2 ,2);
        for (let i = 0, j = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = ar[i];
            // j += 4;
            // imageData.data[i + 1] = ag[j];
            // imageData.data[i + 2] = ab[j++];
        }
        resolve(imageData);
    });
}