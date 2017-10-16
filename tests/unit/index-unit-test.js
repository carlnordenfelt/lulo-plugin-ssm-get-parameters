'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var getParametersStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            SSM: function () {
                this.getParameters = getParametersStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        getParametersStub.reset().resetBehavior();
        getParametersStub.yields(null, { Parameters: [{ Name: 'foo', Value: 'bar' }, { Name: 'baz', Value: 'buz' }] });

        event = {
            ResourceProperties: { Names: ['foo', 'baz'] }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if Names is not set', function (done) {
            delete event.ResourceProperties.Names;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property Names/);
            done();
        });
        it('should fail if Names is not an array', function (done) {
            event.ResourceProperties.Names = 'non-array';
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Property Names must be an array/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(response).to.be.an('object');
                expect(response.foo).to.equal('bar');
                expect(response.baz).to.equal('buz');
                done();
            });
        });
        it('should succeed with prefix', function (done) {
            event = {
                ResourceProperties: {
                    Names: ['Test-foo', 'Test-baz'],
                    Prefix: 'Test-'
                }
            };
            getParametersStub.yields(null, { Parameters: [{ Name: 'Test-foo', Value: 'bar' }, { Name: 'Test-baz', Value: 'buz' }] });
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(response).to.be.an('object');
                expect(response.foo).to.equal('bar');
                expect(response.baz).to.equal('buz');
                done();
            });
        });
        it('should fail due to putParameters error', function (done) {
            getParametersStub.yields('putParametersStub');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('putParametersStub');
                expect(response).to.equal(undefined);
                done();
            });
        });
    });

    describe('update', function () {
        it('should succeed', function (done) {
            subject.update(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(response).to.be.an('object');
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });
});
