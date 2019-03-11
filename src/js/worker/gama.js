onmessage = function (e) {
    let imageData = e.data.imageData;
    let co = e.data.params.co;
    let exp = e.data.params.exp;
    for (let i = 0; i < imageData.data.length; i++) {
        imageData.data[i] = ~~(co * Math.pow(imageData.data[i], exp));
    }
    postMessage(imageData);
}