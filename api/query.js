"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.query = void 0;
var https_1 = require("https");
var querystring_1 = require("querystring");
var get_version_1 = require("./get-version");
function query(options, input) {
    var parameters = __assign({ code: get_version_1.CODE }, input);
    options.path = options.path + (0, querystring_1.stringify)(parameters);
    return new Promise(function (resolve, reject) {
        (0, https_1.get)(options, function (response) {
            if (200 !== response.statusCode) {
                reject(response.statusCode);
                response.resume();
                return;
            }
            var data = '';
            response.setEncoding('utf8');
            response.on('error', reject);
            response.on('data', function (chunk) { return data += chunk; });
            response.on('end', function () { return resolve(data); });
        })
            .on('error', function (err) { return reject(err); });
    });
}
exports.query = query;
;
