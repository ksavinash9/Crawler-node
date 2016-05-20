var crawler = require('../crawler');
var mocha = require('mocha');
var chai = require('chai');
var sinonChai = require("sinon-chai");
var sinon = require('sinon');
var fs = require('fs');

chai.use(sinonChai)
var expect = chai.expect;

describe('Test Crawler -', function() {

    beforeEach(function() {
        sinon.spy(console, 'log');
    });

    afterEach(function() {
        console.log.restore();
    });

  it('should log "Crawling"', function(done) {
    crawler.crawl("http://swarnavinash.com",4, function(err) {
        expect(console.log).to.be.called;
        expect( console.log.calledWith('Crawling') ).to.be.true;
        done();
    });
  });

  it('should log the website being crawled "http://swarnavinash.com"', function(done) {
    this.timeout(10000);
    crawler.crawl("http://swarnavinash.com",4, function(err) {
        chai.use(sinonChai);
        expect(console.log).to.be.called;
        expect( console.log.calledWith("http://google.com")).to.be.false;
        done();
    });

  });

  it('should expect a timeout for invalid url', function(done) {
    crawler.crawl("http://somerandomfakesite123.com",4, function(err) {
        expect(console.log).to.have.been.calledWith("request failed: Error: getaddrinfo ENOTFOUND");
        this.timeout(5000);
        setTimeout(done, 5000);
    });
    done();
  });

  it('should check if json site map exists', function(done) {
    this.timeout(10000);
    crawler.crawl("http://google.com",4, function(err) {
        expect(console.log).to.be.called;
        expect(fs.existsSync('google.com.xml')).to.be.true
        done();
    });
  });

  it('should check if xml site map exists', function(done) {
    this.timeout(10000);
    crawler.crawl("http://google.com",4, function(err) {
        expect(console.log).to.be.called;
        expect(fs.existsSync('google.com.xml')).to.be.true
        done();
    });
  });

});
