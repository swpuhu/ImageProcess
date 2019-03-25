export default function (data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker('/ImageProcess/src/js/worker/histogramBalance.js');
        worker.onmessage = function (e) {
            worker.terminate();
            resolve(e.data);
        }
        worker.onerror = function (e) {
            worker.terminate();
        }
        worker.postMessage({
            imageData: data
        });
    })
}