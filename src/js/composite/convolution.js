import util from '../util/util.js';
import PlainBox from '../components/plainBox.js';
import Matrix from '../components/matrix.js';
import convolutionProcess from '../process/convolutionProcess.js';


export default (function () {
    let cachedPr, cachedPg, cachedPb, ret;
    return function (originDrawer, processDrawer, isGray, pr, pg, pb) {
        if (cachedPr === pr &&
            cachedPg === pg &&
            cachedPb === pb && ret) {
                return ret;
        } else {
            cachedPr = pr;
            cachedPg = pg;
            cachedPb = pb;
            let confirmCallback = function (e) {
                let data = originDrawer.getImageData(originCanvas);
                let kernal = matrix.value;
                let kx = matrix.x;
                let ky = matrix.y;
                if (isGray) {
                    processDrawer.updateHistogram(pr, data, convolutionProcess.bind(this, kernal, kx, ky, 1, data), 'gray');
                } else {
                    processDrawer.updateHistogram(pr, data, convolutionProcess.bind(this, kernal, kx, ky, 1, data), 'r');
                    processDrawer.updateHistogram(pg, data, convolutionProcess.bind(this, kernal, kx, ky, 1, data), 'g');
                    processDrawer.updateHistogram(pb, data, convolutionProcess.bind(this, kernal, kx, ky, 1, data), 'b');
                }
            };
        
            let cancelCallback = function () {
        
            };
        
            let plainBox = PlainBox('设置卷积核', 'convolution', null, confirmCallback, cancelCallback);
            let matrix = Matrix(3);
            plainBox.appendChildren(matrix.ref);
        
            return ret = plainBox;
    
        }
    };
}());