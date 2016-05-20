/*

	Wrapper class to consume the crawler module.
	This is a simple console Wrapper which handles
	the url and depth of traversal
	It also sets default values for url and traversal depth

*/
var crawler = require("./crawler");

/* 

Set default value for the domain to crawl

*/

var domain = "http://swarnavinash.com";
if(process.argv.length < 3) {
	console.error("Please provide a domain name");
	return;
} else {
	domain = process.argv[2];
}

/* 

Set default value for the max depth of traversal 

*/

var maxLevel = 4;

if(process.argv.length > 3 && parseInt(process.argv[3]) > 0) {
	maxLevel = process.argv[3];
}

crawler.crawl(domain, maxLevel);
