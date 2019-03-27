import util from '../util/util.js';

/**
 * @description 卷积核输入界面
 * @author Oliver
 * @param {Number} n 卷积核的大小
 * @returns {{value: value, ref: ref, remove: remove, update: update}}
 */
export default function (n) {
    let obj = {};
    /**
     * @type Array<HTMLElement>
     */
    let units = [];
    let doc = util.createElement('div', ['matrix']);
    doc.onselectstart = function (e) {
        e.stopPropagation();
        return true;
    };

    if (n % 2 === 0) {
        throw new Error('not supported even number');
    }
    for (let i = 0; i < n * n; ++i) {
        let unit = util.createElement('div', ['matrix-unit']);
        unit.contentEditable = true;
        units.push(unit);
        if (i % n === 0) {
            unit.classList.add('first-col');
        }
        if (i / n < 1) {
            unit.classList.add('first-row');
        }
        util.appendChildren(doc, unit);
    }

    doc.onkeydown = function (e) {
        // TODO: 事件委托 校验输入字符
    }


    function remove() {
        doc.remove();
    }

    /**
     *
     * @param {Number} nn 新卷积核大小
     */
    function update (nn) {
        if (n % 2 === 0) {
            throw new Error('not supported even number');
        }
        for (let i = 0; i < units.length; ++i) {
            units[i].innerText = '';
        }
        let diff = nn * nn - n * n;
        if (diff < 0) {
            let del = units.splice(diff);
            for (let d of del) {
                d.remove();
            }

        } else if (diff > 0) {
            let unit = util.createElement('div', ['matrix-unit']);
            unit.contentEditable = true;
            units.push(unit);
            util.appendChildren(doc, unit);
        }

    }

    Object.defineProperties(obj, {
        value: {
            get () {
                let arr = [];
                for (let u of units) {
                    arr.push(+u.innerText);
                }
                return arr;
            },
            set (value) {
                if (util.isArray(value)) {
                    if (value.length === units.length) {
                        for (let i = 0; i < units.length; ++i) {
                            units[i].innerText = value[i];
                        }
                    }
                } else {
                    throw new Error('type error');
                }
            }
        },
        ref: {
            get () {
                return doc;
            }
        },
        remove: {
            value: remove
        },
        update: {
            value: update
        }
    });

    return obj;

}