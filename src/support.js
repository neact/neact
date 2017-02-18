'use strict';
export var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

export var canUseEventListeners = canUseDOM && !!(window.addEventListener || window.attachEvent);

export var ieVersion = canUseDOM && document && (function() {
    var version = 3,
        div = document.createElement('div'),
        iElems = div.getElementsByTagName('i');

    // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
    while (
        div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
        iElems[0]
    ) {}
    return version > 4 ? version : undefined;
}());

export var isIE = !ieVersion;