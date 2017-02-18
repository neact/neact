'use strict';

exports.__esModule = true;
exports.shorthandPropertyExpansions = exports.styleFloatAccessor = exports.hasShorthandPropertyBug = exports.probablyKebabProps = exports.dehyphenProps = exports.skipProps = exports.isUnitlessNumber = exports.namespaces = exports.booleanProps = exports.strictProps = exports.svgNS = exports.xmlNS = exports.xlinkNS = undefined;
exports.kebabize = kebabize;

var _support = require('../support');

function constructDefaults(string, object, value) {
    var r = string.split(',');
    for (var i = 0; i < r.length; i++) {
        object[r[i]] = value;
    }
}

var xlinkNS = exports.xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = exports.xmlNS = 'http://www.w3.org/XML/1998/namespace';
var svgNS = exports.svgNS = 'http://www.w3.org/2000/svg';
var strictProps = exports.strictProps = {};
var booleanProps = exports.booleanProps = {};
var namespaces = exports.namespaces = {};
var isUnitlessNumber = exports.isUnitlessNumber = {};
var skipProps = exports.skipProps = {};
var dehyphenProps = exports.dehyphenProps = {
    acceptCharset: 'accept-charset',
    httpEquiv: 'http-equiv',
    acceptCharset: 'accept-charset'
};
var probablyKebabProps = exports.probablyKebabProps = /^(accentH|arabicF|capH|font[FSVW]|glyph[NO]|horiz[AO]|panose1|renderingI|strikethrough[PT]|underline[PT]|v[AHIM]|vert[AO]|xH|alignmentB|baselineS|clip[PR]|color[IPR]|dominantB|enableB|fill[OR]|flood[COF]|imageR|letterS|lightingC|marker[EMS]|pointerE|shapeR|stop[CO]|stroke[DLMOW]|text[ADR]|unicodeB|wordS|writingM).*/;

function kebabize(str, smallLetter, largeLetter) {
    return smallLetter + '-' + largeLetter.toLowerCase();
}

constructDefaults('xlink:href,xlink:arcrole,xlink:actuate,xlink:role,xlink:titlef,xlink:type', namespaces, xlinkNS);
constructDefaults('xml:base,xml:lang,xml:space', namespaces, xmlNS);
constructDefaults('volume,defaultValue,value', strictProps, true);
constructDefaults('children,ref,key', skipProps, true);

constructDefaults('muted,scoped,loop,open,checked,multiple,defaultChecked,selected,default,capture,disabled,readOnly,required,autoplay,controls,seamless,reversed,allowfullscreen,novalidate', booleanProps, true);

constructDefaults('animationIterationCount,borderImageOutset,borderImageSlice,borderImageWidth,boxFlex,boxFlexGroup,boxOrdinalGroup,columnCount,flex,flexGrow,flexPositive,flexShrink,flexNegative,flexOrder,gridRow,gridColumn,fontWeight,lineClamp,lineHeight,opacity,order,orphans,tabSize,widows,zIndex,zoom,fillOpacity,floodOpacity,stopOpacity,strokeDasharray,strokeDashoffset,strokeMiterlimit,strokeOpacity,strokeWidth,', isUnitlessNumber, true);

var hasShorthandPropertyBug = false;
var styleFloatAccessor = 'cssFloat';

if (_support.canUseDOM) {
    var tempStyle = document.createElement('div').style;
    try {
        // IE8 throws "Invalid argument." if resetting shorthand style properties.
        tempStyle.font = '';
    } catch (e) {
        exports.hasShorthandPropertyBug = hasShorthandPropertyBug = true;
    }
    // IE8 only supports accessing cssFloat (standard) as styleFloat
    if (document.documentElement.style.cssFloat === undefined) {
        exports.styleFloatAccessor = styleFloatAccessor = 'styleFloat';
    }
}
exports.hasShorthandPropertyBug = hasShorthandPropertyBug;
exports.styleFloatAccessor = styleFloatAccessor;

/**
 * Most style properties can be unset by doing .style[prop] = '' but IE8
 * doesn't like doing that with shorthand properties so for the properties that
 * IE8 breaks on, which are listed here, we instead unset each of the
 * individual properties. See http://bugs.jquery.com/ticket/12385.
 * The 4-value 'clock' properties like margin, padding, border-width seem to
 * behave without any problems. Curiously, list-style works too without any
 * special prodding.
 */

var shorthandPropertyExpansions = exports.shorthandPropertyExpansions = {
    background: {
        backgroundAttachment: true,
        backgroundColor: true,
        backgroundImage: true,
        backgroundPositionX: true,
        backgroundPositionY: true,
        backgroundRepeat: true
    },
    backgroundPosition: {
        backgroundPositionX: true,
        backgroundPositionY: true
    },
    border: {
        borderWidth: true,
        borderStyle: true,
        borderColor: true
    },
    borderBottom: {
        borderBottomWidth: true,
        borderBottomStyle: true,
        borderBottomColor: true
    },
    borderLeft: {
        borderLeftWidth: true,
        borderLeftStyle: true,
        borderLeftColor: true
    },
    borderRight: {
        borderRightWidth: true,
        borderRightStyle: true,
        borderRightColor: true
    },
    borderTop: {
        borderTopWidth: true,
        borderTopStyle: true,
        borderTopColor: true
    },
    font: {
        fontStyle: true,
        fontVariant: true,
        fontWeight: true,
        fontSize: true,
        lineHeight: true,
        fontFamily: true
    },
    outline: {
        outlineWidth: true,
        outlineStyle: true,
        outlineColor: true
    }
};