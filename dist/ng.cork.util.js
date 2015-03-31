/**
 * ng.cork.util - v0.0.2 - 2015-03-31
 * https://github.com/cork-labs/ng.cork.util
 *
 * Copyright (c) 2015 Cork Labs <http://cork-labs.org>
 * License: MIT <http://cork-labs.mit-license.org/2015>
 */
(function (angular) {
    'use strict';

    var module = angular.module('ng.cork.util', []);

    var copy = angular.copy;

    var isString = angular.isString;
    var isDate = angular.isDate;
    var isFunction = angular.isFunction;
    var isObject = angular.isObject;
    var isArray = angular.isArray;

    function isObjectObject(value) {
        return value !== null && angular.isObject(value) && !angular.isArray(value);
    }

    function isRegExp(value) {
        return window.toString.call(value) === '[object RegExp]';
    }

    function isPromise(value) {
        return value && isFunction(value.then);
    }

    /**
     * @param {object} destination
     * @param {object} source
     * @return {object}
     */
    function extend(destination, source) {
        // bailout
        if (destination !== source) {
            // handles dates and regexps
            if (isDate(source)) {
                destination = new Date(source.getTime());
            } else if (isRegExp(source)) {
                destination = new RegExp(source.source, source.toString().match(/[^\/]*$/)[0]);
                destination.lastIndex = source.lastIndex;
            }
            // if source is object (or array) go recursive
            else if (isObject(source)) {
                // initialize as (or smash to) destination property to Array
                if (isArray(source)) {
                    if (!isArray(destination)) {
                        destination = [];
                    }
                }
                // initialize as (or smash to) destination property to Object
                else if (!isObject(destination) || isArray(destination)) {
                    destination = {};
                }
                for (var key in source) {
                    destination[key] = extend(destination[key], source[key]);
                }
            } else if (typeof source !== 'undefined') {
                destination = source;
            }
        }
        return destination;
    }

    /**
     * @ngdoc service
     * @name ng.cork.util.corkUtil
     *
     * @description
     * Provides a few util functions.
     */
    module.service('corkUtil', [

        function corkUtilFactory() {

            var serviceApi = {

                /**
                 * @ngdoc function
                 * @name extend
                 * @methodOf ng.cork.util.corkUtil
                 *
                 * @description
                 * Static deep merge utility function.
                 *
                 * @param {*} destination The object to extend. If a scalar value is provided and `source` is object or an
                 *   array you will get a new object returned, otherwise the destination is modified and you can ignore the return value.
                 * @param {*} source The source object.
                 * @returns {object} The extended object.
                 */
                extend: extend,

                /**
                 * @ngdoc function
                 * @name isObjectObject
                 * @methodOf ng.cork.util.corkUtil
                 *
                 * @description
                 * Checks if value is an object but not null or an Array.
                 *
                 * @param {*} value Check
                 * @returns {boolean} True if the provided value is an object but not null or an Array.
                 */
                isObjectObject: isObjectObject,

                /**
                 * @ngdoc function
                 * @name isRegExp
                 * @methodOf ng.cork.util.corkUtil
                 *
                 * @description
                 * Checks if value is a RegExp
                 *
                 * @param {*} value Check
                 * @returns {boolean} True if the provided value is a RegExp
                 */
                isRegExp: isRegExp,

                /**
                 * @ngdoc function
                 * @name isPromise
                 * @methodOf ng.cork.util.corkUtil
                 *
                 * @description
                 * Checks if value is promise like.
                 *
                 * @param {*} value Check
                 * @returns {boolean} True if the provided value is promise like.
                 */
                isPromise: isPromise
            };

            return serviceApi;
        }
    ]);

})(angular);
