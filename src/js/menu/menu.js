import util from '../util/util.js';

export default function Open() {
    let obj = {};
    let onchange;
    let wrapper = util.createElement('div', ['wrapper']);

    let checkBox = util.createElement('div', ['check-box']);
    let check = util.createElement('input', ['check'], {
        type: 'checkbox'
    });
    check.checked = true;
    let label = util.createElement('label', ['label']);
    util.appendChildren(checkBox, check, label);
    label.innerText = '灰度模式'

    let doc = util.createElement('div', ['open-btn'])
    let input = util.createElement('input', null, {
        type: 'file'
    });
    doc.innerText = '打开图片';

    util.appendChildren(wrapper, doc, checkBox);
    doc.onclick = function () {
        input.click();
    }

    input.oninput = function (e) {
        onchange && onchange.call(obj, e);
    }

    Object.defineProperties(obj, {
        ref: {
            get() {
                return wrapper;
            }
        },
        onchange: {
            get() {
                return onchange;
            },
            set(value) {
                if (util.isFunction(value)) {
                    onchange = value;
                }
            }
        },
        isGrayMode: {
            get () {
                return check.checked;
            }
        }
    })

    return obj;
}