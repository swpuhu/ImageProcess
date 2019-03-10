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

function isFunction (object) {
  return Object.prototype.toString.call(object) === '[object Function]';
}

function isString(object) {
  return Object.prototype.toString.call(object) === '[object String]';
}

function isHTMLElement(object) {
  return Object.prototype.toString.call(object) === '[object HTMLElement]';
}

export default {
  createElement,
  isArray,
  isObject,
  isFunction,
  isString,
  appendChildren
}