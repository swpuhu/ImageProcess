function gamaProcess(data) {
    let worker = new Worker('/ImageProcess/src/js/worker/gama.js');
    worker.postMessage(data);
}

export default gamaProcess;