'use strict';

exports.__esModule = true;
var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var canUseEventListeners = exports.canUseEventListeners = canUseDOM && !!(window.addEventListener || window.attachEvent);

var ieVersion = exports.ieVersion = canUseDOM && document && function () {
    var version = 3,
        div = document.createElement('div'),
        iElems = div.getElementsByTagName('i');

    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
    while (div.innerHTML = '<!--[if gt IE ' + ++version + ']><i></i><![endif]-->', iElems[0]) {}
    return version > 4 ? version : undefined;
}();

var isIE = exports.isIE = !ieVersion;