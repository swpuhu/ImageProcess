import util from '../util/util.js';
/**
 * 
 * @param {Array<Number>} kernal 卷积核
 * @param {Number} kx 卷积核尺寸x
 * @param {Number} ky 卷积核尺寸y
 * @param {Number} co 系数
 * @param {ImageData} data 图像数据
 */
export default function(kernal, kx, ky, co, data) {
    return new Promise((resolve, reject) => {
        let imageData = data;
        let M = imageData.width;
        let N = imageData.height;

        let r = [],
            g = [],
            b = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
            r.push(imageData.data[i]);
            g.push(imageData.data[i + 1]);
            b.push(imageData.data[i + 2]);
        }
        let ar = util.convolution(kernal, kx, ky, r, M, N, co);
        let ag = util.convolution(kernal, kx, ky, g, M, N, co);
        let ab = util.convolution(kernal, kx, ky, b, M, N, co);
        for (let i = 0, j = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = ar[j];
            imageData.data[i + 1] = ag[j];
            imageData.data[i + 2] = ab[j++];
        }
        resolve(imageData);
    });
}