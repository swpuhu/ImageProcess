onmessage = function (e) {
    let imageData = e.data.imageData;
    let mode = e.data.mode;
    let M = imageData.width;
    let N = imageData.height;

    let histogramDataR = new Array(256);
    let histogramDataG = new Array(256);
    let histogramDataB = new Array(256);
    let maxR = histogramDataR[0];
    let maxG = histogramDataG[0];
    let maxB = histogramDataB[0];
    for (let i = 0; i < histogramDataR.length; i++) {
        histogramDataR[i] = {value: 0, pr: 0};
        histogramDataG[i] = {value: 0, pr: 0};
        histogramDataB[i] = {value: 0, pr: 0};
    }
    for (let i = 0; i < imageData.data.length; i += 4) {
            ++histogramDataR[imageData.data[i]].value;
            ++histogramDataG[imageData.data[i + 1]].value;
            ++histogramDataB[imageData.data[i + 2]].value;
    }
    let accumR = 0,
        accumG = 0,
        accumB = 0;

    for (let i = 1; i < histogramDataR.length; i++) {
        if (histogramDataR[i] > maxR) {
            maxR = histogramDataR[i];
        }
        if (histogramDataG[i] > maxG) {
            maxG = histogramDataG[i];
        }
        if (histogramDataB[i] > maxB) {
            maxB = histogramDataB[i];
        }

        accumR += histogramDataR[i].value;
        accumG += histogramDataG[i].value;
        accumB += histogramDataB[i].value;

        histogramDataR[i].pr = Math.round(256 * accumR / (M * N));
        histogramDataG[i].pr = Math.round(256 * accumG / (M * N));
        histogramDataB[i].pr = Math.round(256 * accumB / (M * N));
    }

    for (let i = 0; i < imageData.data.length; i += 4) {
        imageData.data[i] = histogramDataR[imageData.data[i]].pr;
        imageData.data[i + 1] = histogramDataG[imageData.data[i + 1]].pr;
        imageData.data[i + 2] = histogramDataB[imageData.data[i + 2]].pr;
    }
    postMessage(imageData);
}