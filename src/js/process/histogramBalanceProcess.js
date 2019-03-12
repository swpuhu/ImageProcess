export default function (data) {
    return new Promise((resolve, reject) => {
        let worker = new Worker('/ImageProcess/src/js/worker/histogramBalance.js');
        worker.onmessage = function (e) {
            worker.terminate();
            console.log(e.data);
            resolve(e.data);
        }
        worker.onerror = function (e) {
            console.log(e.lineno + ': ' + e.message);
            worker.terminate();
        }

        console.log(data);
        worker.postMessage({
            imageData: data
        });
    })
}