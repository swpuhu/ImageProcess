import util from '../util/util.js';

/**
 * 
 * @param {String} title 窗口名字
 * @param {String|Array<String>} className 额外添加的类名
 * @param {HTMLElement|Array<HTMLElement>} elements 窗口内的元素
 */
export default function (title, className, elements, confirmCallback, cancelCallback) {
  let obj = {};
  let doc = util.createElement('div', ['plain-box']);
  let header, body, footer
  if (util.isArray(className)) {
    for (let c of className) {
      doc.classList.add(c);
    }
  } else if (util.isString(className)) {
    doc.classList.add(className);
  }


  header = util.createElement('div', ['header']);
  let caption = util.createElement('div', ['caption']);
  caption.innerText = title;
  let closeIcon = util.createElement('div', ['close-icon']);
  util.appendChildren(header, caption, closeIcon);

  closeIcon.addEventListener('click', function () {
    cancelCallback && cancelCallback.call(obj);
    remove();
  })

  body = util.createElement('div', ['body']);
  if (util.isArray(elements)) {
    util.appendChildren(body, ...elements);
  } else {
    util.appendChildren(body, elements);
  }


  if (confirmCallback || cancelCallback) {
    let confirmBtn = util.createElement('button', ['footer-confirm__btn']);
    confirmBtn.innerText = '确定';
    let cancelBtn = util.createElement('button', ['footer-cancel__btn']);
    cancelBtn.innerText = '取消';
    footer = util.createElement('div', ['footer']);
    if (confirmBtn) {
      util.appendChildren(footer, confirmBtn);
      confirmBtn.addEventListener('click', function (e) {
        confirmCallback.call(obj);
        remove();
      });
    }
    if (cancelBtn) {
      util.appendChildren(footer, cancelBtn);
      cancelBtn.addEventListener('click', function () {
        cancelCallback.call(obj);
        remove();
      })
    }
  }

  util.appendChildren(doc, header, body, footer);

  function appendChildren(...children) {
    util.appendChildren(body, ...children);
  }

  function remove() {
    doc.remove();
  }

  Object.defineProperties(obj, {
    ref: {
      get() {
        return doc;
      }
    },
    remove: {
      value: remove
    },
    appendChildren: {
      value: appendChildren
    }
  });

  return obj;
}