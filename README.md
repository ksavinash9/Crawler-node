Simple Node.js Crawler
===================

This cli app that crawls a single domain to generate a sitemap for given domain in XML and JSON files. 

## Usage

Installation
-----------
```sh
$ npm install
```

Running
-----------
```sh
$ node crawl.js http://gocardless.com 4
$ node crawl.js http://gocardless.com 4 > gocardless.com.json
```

Testing
-----------
```sh
$ mocha test
```

## Specs

- [x] should only parse a single domain, ie. ignore outgoing links.
- [x] cli tool with a two argument - a seed url, depth of traversal
- [x] should output a site map in console log
- [x] should output site map in XML format - [site_name].xml
- [x] should output site map in JSON format - [site_name].json
- [x] for each page display which static assets each page depends on: images, css, js, video, etc.
- [x] prevent infinite loops/cycles
- [x] focus on the speed and asynchronous nature of the crawler
- [x] handle the case when the same page has different urls - http/https etc. 
- [x] Properly tested with mocha, chai, sinon, nock. 


The sitemap is returned as a JSON file in this format:

	{
		linkText: "Text of the Gocardless tag",
		linkUrl: "/this/url",
		assets:[
			'/assets/gocardless.jpg',
			...
		],
		childLinks:{[
			{
				linkText:'...',
				linkUrl: '...'
			}
			....
		]}
	}

The sitemap is returned as a XML file in this format:

	<?xml version="1.0" encoding="UTF-8"?>
	<sitemap>
		<linkText>Index page for http://gocardless.com</linkText>
		<linkUrl></linkUrl>
		<childlinks>
			<linkText>GOCardLess</linkText>
			<linkUrl>/top</linkUrl>
			...
		</childlinks>
		<childlinks>
		...
	</sitemap>

## References
1. [Architecture of Web Crawler](http://research.microsoft.com/pubs/102936/eds-webcrawlerarchitecture.pdf)