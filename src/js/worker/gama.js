onmessage = function (e) {
    let imageData = e.data.imageData;
    let co = e.data.params.co;
    let exp = e.data.params.exp;
    for (let i = 0; i < imageData.data.length; i++) {
        imageData.data[i] = Math.round(co * Math.pow(imageData.data[i] / 255, exp) * 255);
    }
    postMessage(imageData);
}