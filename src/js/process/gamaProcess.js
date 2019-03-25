/**
 *
 * @param {ImageData} data
 * @param {Number} coeffecient 伽马变换函数的系数
 * @param {Number} exp 伽马变换函数的幂指数
 */
function gamaProcess(data, coeffecient = 1, exp = 1) {
    return new Promise((resolve, reject) => {
        let worker = new Worker('/ImageProcess/src/js/worker/gama.js');
        console.log(data);
        worker.onmessage = function (e) {
            worker.terminate();
            resolve(e.data);
        }
        worker.postMessage({
            imageData: data,
            params: {
                co: coeffecient,
                exp: exp
            }
        });
    })
}

export default gamaProcess;