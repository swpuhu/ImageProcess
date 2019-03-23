/**
 *
 * @param {String} tagName
 * @param {String} className
 * @param {Object} attribute
 * @return {HTMLElement}
 */
function createElement(tagName, className, attribute) {
    let doc = document.createElement(tagName);
    if (isArray(className)) {
        for (let name of className) {
            doc.classList.add(name);
        }
    } else if (isString(className)) {
        doc.classList.add(className);
    }
    if (attribute) {
        for (let i of Object.keys(attribute)) {
            doc.setAttribute(i, attribute[i]);
        }
    }
    return doc;
}

/**
 *
 * @param {HTMLElement} father
 * @param  {...HTMLElement} children
 */
function appendChildren(father, ...children) {
    for (let i of children) {
        if (!i) {
            continue;
        }
        father.appendChild(i);
    }
}

function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

function isObject(object) {
    return Object.prototype.toString.call(object) === '[object Object]';
}

function isFunction(object) {
    return Object.prototype.toString.call(object) === '[object Function]';
}

function isString(object) {
    return Object.prototype.toString.call(object) === '[object String]';
}

function isHTMLElement(object) {
    return Object.prototype.toString.call(object) === '[object HTMLElement]';
}

/**
 *
 * @param {Array} array
 * @param {Number} m
 * @param {Number} n
 * @param {Number} fm 单边增加的列数
 * @param {Number} fn 单边增加的行数
 */
function fillArray(array, m, n, fm, fn) {
    let M = m + 2 * fm;
    let N = n + 2 * fn;
    let arr = new Array(M * N);
    let k = 0;
    for (let i = 0; i < M; i++) {
        for (let j = 0; j < N; j++) {
            if (i < fm || i >= m + fm) {
                arr[i * M + j] = 0;
            } else if (i >= fm) {
                if (j < fn || j >= n + fn) {
                    arr[i * M + j] = 0;
                } else {
                    arr[i * M + j] = array[k++];
                }
            }
        }
    }
    return [arr, M, N];
}

function trimArray(array, m, n, fm, fn) {
    let M = m - 2 * fm;
    let N = n - 2 * fn;
    let arr = new Array(M * N);
    let k = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i >= fm && i < M + fm &&
                j >= fn && j < N + fn) {
                arr[k++] = array[i * m + j];
            }
        }
    }
    return arr;
}

/**
 *
 * @param {Array} kernal 卷积核
 * @param {Number} kx 卷积核尺寸x
 * @param {Number} ky 卷积核尺寸y
 * @param {Array} data 原图像数据
 * @param {Number} ix 原图像尺寸x
 * @param {Number} iy 原图像尺寸y
 */
function convolution(kernal, kx, ky, data, ix, iy, co = 1) {
    let m = ix;
    let n = iy;
    let M, N;
    [data, M, N] = fillArray(data, m, n, kx - 1, ky - 1);
    // _m, _n 是执行卷积运算后图像的大小
    let _m = M - kx + 1;
    let _n = N - ky + 1;
    let res = [];
    for (let i = 0; i < _n; i++) {
        for (let j = 0; j < _m; j++) {
            let temp = 0;
            for (let k = 0; k < kx * ky; k++) {
                let c = k % kx;
                let r = ~~(k / ky);
                temp += kernal[k] * data[(j + c) + (i + r) * N];
            }
            res.push(temp * co);
        }
    }
    res = trimArray(res, _m, _n, kx - 2, ky - 2);
    return res;
}


export default {
    createElement,
    isArray,
    isObject,
    isFunction,
    isString,
    appendChildren,
    fillArray,
    trimArray,
    convolution
}