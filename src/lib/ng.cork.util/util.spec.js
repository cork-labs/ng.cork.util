describe('ng.cork.util', function () {
    'use strict';

    beforeEach(module('ng.cork.util'));

    describe('corkUtil', function () {

        describe('extend', function () {

            describe('when the same object is provided as source and destination', function () {

                it('should NOT modify destination.', inject(function (corkUtil)  {

                    var data = {
                        foo: 'bar',
                        baz: 'qux'
                    };
                    var copy = angular.copy(data);

                    corkUtil.extend(data, data);

                    expect(data).toEqual(copy);
                }));
            });

            describe('when two different objects are provided', function () {

                it('should merge/override data with the provided properties.', inject(function (corkUtil)  {

                    var data = {
                        foo: 'bar',
                        baz: 'qux'
                    };
                    var extend = {
                        foo: 'quux',
                        quuux: 'corge'
                    };

                    corkUtil.extend(data, extend);

                    expect(data.foo).toBe('quux');
                    expect(data.baz).toBe('qux');
                    expect(data.quuux).toBe('corge');
                }));

                it('modifying the source data after extending should NOT affect the destination object.', inject(function (corkUtil) {

                    var data = {};
                    var extend = {
                        id: 42,
                        foo: 'bar',
                        baz: {
                            qux: 'quux' // makes sure it is a deep copy
                        }
                    };

                    corkUtil.extend(data, extend);

                    extend.id++;
                    extend.foo = 'baz';
                    extend.baz = 'quux';

                    expect(data.id).toBe(42);
                    expect(data.foo).toBe('bar');
                    expect(data.baz.qux).toBe('quux');
                }));

                it('should re-initialize existing non-object properties of the instance if overriding those with Object values.', inject(function (corkUtil) {

                    var data = {
                        foo: ''
                    };
                    var extend = {
                        id: 42,
                        foo: {
                            bar: 'baz'
                        }
                    };

                    corkUtil.extend(data, extend);

                    expect(data.id).toBe(42);
                    expect(angular.isObject(data.foo)).toBeTruthy();
                    expect(angular.isArray(data.foo)).toBeFalsy();
                    expect(data.foo.bar).toBe('baz');
                }));

                it('should copy Date properties.', inject(function (corkUtil) {

                    var data = {
                        foo: ''
                    };
                    var extend = {
                        date: new Date()
                    };

                    corkUtil.extend(data, extend);

                    expect(data.date).toEqual(extend.date);
                    expect(data.date).not.toBe(extend.date);
                }));

                it('should copy Regexp properties.', inject(function (corkUtil) {

                    var data = {
                        foo: ''
                    };
                    var extend = {
                        regexp: /foobar/g
                    };

                    corkUtil.extend(data, extend);

                    expect(data.regexp).toEqual(extend.regexp);
                    expect(data.regexp).not.toBe(extend.regexp);
                }));

                it('should re-initialize existing non-object properties of the instance if overriding those with Array values.', inject(function (corkUtil) {

                    var data = {
                        foo: ''
                    };
                    var extend = {
                        id: 42,
                        foo: [
                            'bar'
                        ]
                    };

                    corkUtil.extend(data, extend);

                    expect(data.id).toBe(42);
                    expect(angular.isArray(data.foo)).toBeTruthy();
                    expect(data.foo).toEqual(['bar']);
                }));

                it('should re-initialize existing Array properties of the instance if overriding then with Object values.', inject(function (corkUtil) {

                    var data = {
                        foo: []
                    };
                    var extend = {
                        id: 42,
                        foo: {
                            bar: 'baz'
                        }
                    };

                    corkUtil.extend(data, extend);

                    expect(data.id).toBe(42);
                    expect(angular.isObject(data.foo)).toBeTruthy();
                    expect(angular.isArray(data.foo)).toBeFalsy();
                    expect(data.foo.bar).toBe('baz');
                }));

                it('should re-initialize existing Object properties of the instance if overriding then with Array values.', inject(function (corkUtil) {

                    var data = {
                        foo: {}
                    };
                    var extend = {
                        id: 42,
                        foo: [
                            'bar'
                        ]
                    };

                    corkUtil.extend(data, extend);

                    expect(data.id).toBe(42);
                    expect(angular.isArray(data.foo)).toBeTruthy();
                    expect(data.foo).toEqual(['bar']);
                }));
            });
        });

        describe('isObjectObject', function () {

            it('should return TRUE if value is an object, not an array and not null.', inject(function (corkUtil)  {

                expect(corkUtil.isObjectObject({})).toBe(true);
            }));

            it('should return TRUE if value is a RegExp or a Date.', inject(function (corkUtil)  {

                expect(corkUtil.isObjectObject(/a/g)).toBe(true);
                expect(corkUtil.isObjectObject(new Date())).toBe(true);
            }));

            it('should return FALSE if value is null.', inject(function (corkUtil)  {

                expect(corkUtil.isObjectObject(null)).toBe(false);
            }));

            it('should return FALE if value is an array.', inject(function (corkUtil)  {

                expect(corkUtil.isObjectObject([])).toBe(false);
            }));

            it('should return FALSE if value of any other type.', inject(function (corkUtil)  {

                expect(corkUtil.isObjectObject(false)).toBe(false);
                expect(corkUtil.isObjectObject('')).toBe(false);
                expect(corkUtil.isObjectObject(123)).toBe(false);
            }));
        });

        describe('isRegExp', function () {

            it('should return TRUE if value is an RegExp.', inject(function (corkUtil)  {

                expect(corkUtil.isRegExp(/a/g)).toBe(true);
            }));

            it('should return FALSE if value any other type of object.', inject(function (corkUtil)  {

                expect(corkUtil.isRegExp({})).toBe(false);
                expect(corkUtil.isRegExp([])).toBe(false);
                expect(corkUtil.isRegExp(null)).toBe(false);
            }));

            it('should return FALSE if value of any other type.', inject(function (corkUtil)  {

                expect(corkUtil.isRegExp(false)).toBe(false);
                expect(corkUtil.isRegExp('')).toBe(false);
                expect(corkUtil.isRegExp(123)).toBe(false);
            }));
        });

        describe('isPromise', function () {

            it('should return TRUE if value is promise like.', inject(function (corkUtil)  {

                var promiseLike = {
                    then: function () {}
                };

                expect(corkUtil.isPromise(promiseLike)).toBe(true);
            }));

            it('should return FALSE if value is object but not promiseLike.', inject(function (corkUtil)  {

                expect(corkUtil.isPromise({})).toBe(false);
            }));

            it('should return FALSE if value of any other type.', inject(function (corkUtil)  {

                expect(corkUtil.isRegExp(false)).toBe(false);
                expect(corkUtil.isRegExp('')).toBe(false);
                expect(corkUtil.isRegExp(123)).toBe(false);
            }));
        });
    });
});
