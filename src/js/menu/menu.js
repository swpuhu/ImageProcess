import util from '../util/util.js';

export default function Open() {
  let obj = {};
  let onchange;
  let doc = util.createElement('div', ['open-btn'])
  let input = util.createElement('input', null, {
    type: 'file'
  });
  doc.innerText = '打开图片';

  doc.onclick = function () {
    input.click();
  }

  input.oninput = function (e) {
    onchange && onchange.call(obj, e);
  }

  Object.defineProperties(obj, {
    ref: {
      get () {
        return doc;
      }
    },
    onchange: {
      get () {
        return onchange;
      },
      set (value) {
        if (util.isFunction(value)) {
          onchange = value;
        }
      }
    }
  })

  return obj;
}