const expect  = require('chai').expect;
const mockery = require('mockery');
const sinon   = require('sinon');

describe('Index unit tests', function () {
    let subject;
    const getParametersStub = sinon.stub();
    let event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        const awsSdkStub = {
            SSM: function () {
                this.getParameters = getParametersStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        getParametersStub.reset();
        getParametersStub.yields(null, {
            Parameters: [
                { Name: '/foo/path', Value: 'foo-value' },
                { Name: '/bar/path', Value: 'bar-value' }
            ]
        });

        event = {
            ResourceProperties: {
                Parameters: [
                    ['FooName', '/foo/path'],
                    ['BarName', '/bar/path']
                ]
            }
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
        it('should fail if Parameters is not set', function (done) {
            delete event.ResourceProperties.Parameters;

            function fn() {
                subject.validate(event);
            }

            expect(fn).to.throw(/Missing required property Parameters/);
            done();
        });
        it('should fail if Parameters is not an array', function (done) {
            event.ResourceProperties.Parameters = 'non-array';

            function fn() {
                subject.validate(event);
            }

            expect(fn).to.throw(/Property Parameters must be an array/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(response).to.be.an('object');
                expect(response.FooName).to.equal('foo-value');
                expect(response.BarName).to.equal('bar-value');
                expect(getParametersStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should fail due to putParameters error', function (done) {
            getParametersStub.yields('putParametersStub');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('putParametersStub');
                expect(response).to.equal(undefined);
                expect(getParametersStub.calledOnce).to.equal(true);
                done();
            });
        });
    });

    describe('update', function () {
        it('should succeed', function (done) {
            subject.update(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(response).to.be.an('object');
                expect(getParametersStub.calledOnce).to.equal(true);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            subject.delete(event, {}, function (error, response) {
                expect(error).to.equal(undefined);
                expect(response).to.equal(undefined);
                expect(getParametersStub.called).to.equal(false);
                done();
            });
        });
    });
});
