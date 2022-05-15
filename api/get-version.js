"use strict";
exports.__esModule = true;
exports.getVersionOptions = exports.CODE = exports.HOSTNAME = void 0;
exports.HOSTNAME = 'www.bmf-steuerrechner.de';
exports.CODE = '2022eP';
function getVersionOptions(year, month) {
    var hostname = exports.HOSTNAME, version;
    switch (year) {
        case 2011:
        case 2015:
            version = 12 === month ? "".concat(year, "DezVersion1") : "".concat(year, "bisNovVersion1");
            break;
        case 2006:
        case 2007:
        case 2008:
        case 2009:
        case 2010:
        case 2012:
        case 2013:
        case 2014:
        case 2016:
        case 2017:
        case 2018:
        case 2019:
        case 2020:
        case 2021:
        case 2022:
            version = "".concat(year, "Version1");
            break;
        default:
            throw 'version not implemented';
    }
    return {
        hostname: hostname,
        path: "/interface/".concat(version, ".xhtml?")
    };
}
exports.getVersionOptions = getVersionOptions;
