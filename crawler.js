var fs = require('fs');
var js2xmlparser = require("js2xmlparser");

var request = require('request'),
    cheerio = require('cheerio'),
    async = require('async'),
    format = require('util').format;

var domain = "";
/*
    map variable for storing the sitemap
    json datastructure which handles the sitemap
    sitemap can be written in json or xml format
*/

var root = { };
/* 
    variable which is used as a Queue
    linkQueue stores the next links to visit. 
    linkQueue handles the link in FIFO order
    linkQueue help to handle the conditions of depth
*/

var linkQueue = [];
/* 
    variable for storing
    number of links visited 
*/
var numVisited = 0;
/* 
    variable which is used as a set
    visitedUrl stores the set of links which have been visited. 
    visitedUrl handles the case of cycles
    visitedUrl handles the case of not repeated the same link again
*/
var visitedUrls = {};

/*
    variable for storing the depth of child from root
    curLevel handles the case of traversing only till max depth
    curLevel handles the infinite traversal case
*/
var curLevel = 0;


/**
    Crawls the page and log the sitemap in console
    
    @author Swarn Avinash
    @param domainToCrawl, maxLevel, callback
    @chainable

    @example - crawl("http://google.com", 4, function(err))
*/

var crawl = function(domainToCrawl, maxLevel, callback){
    
    domain = domainToCrawl;
    root = {
        linkText: "Index page for " + domain,
        linkUrl: ""
    };
    linkQueue = [];
    visitedUrls = {};
    curLevel = 0;
    numVisited = 0;
    linkQueue.push(root);

    async.doWhilst(
        function(callback){
            getLinks(callback);
            curLevel++;
        },
        function(){
            return linkQueue.length > numVisited  && curLevel < maxLevel;
        },
        function(err){
            console.log("Crawling")
            xml_data = js2xmlparser("sitemap", root)
            xml_file_name = domainToCrawl.split("//")[1]+".xml"
            json_file_name = domainToCrawl.split("//")[1]+".json"
            fs.writeFile(xml_file_name, xml_data, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The xml file " + xml_file_name + " was saved!");
            }); 
            fs.writeFile(json_file_name, JSON.stringify(root, null, 4), function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The json file " + json_file_name + " was saved!");
            }); 
            console.log(JSON.stringify(root, null, 4));
            if(callback)
                callback(root);
        }
    );
}


/**
    Returns the next set of child links to crawl.
    
    @author Swarn Avinash
    @param callback
    @return next set of links

    @example - getlink(cb)
*/

var getLinks = function(callback){
    /* Get he next set of unvisited links from queue */
    var links = linkQueue.slice(numVisited);
    return async.eachLimit(links, 10, function(link, callback){
        /* make sure link is available in closure */
        var link = link;
        console.warn("%s: Requesing %s", numVisited, domain + link.linkUrl);
        request(domain + link.linkUrl, function(err, response, body){
            if(err) {
                // Throw Error if link not found
                console.error('request failed: %s', err);
                return;
            }
            numVisited++;
            
            /* Load the entire body in Cheerio */
            var $ = cheerio.load(body);
            /* Parse the Body and push the child links in LinkQueue */
            $("a").each(function(){
                var childlink = {
                    linkText: $(this).text().trim(),
                    linkUrl: trimUrl($(this).attr('href'))
                };
                
                if(urlIsValid(childlink.linkUrl)){
                    if(!link.childlinks)
                        link.childlinks = [];
                    link.childlinks.push(childlink);
                    linkQueue.push(childlink);
                    visitedUrls[childlink.linkUrl] = link;
                }
            });
            /* Parse the static assets */
            $("img, link, script").each(function(){
                if($(this).attr("src")){
                    if(!link.assets)
                        link.assets = [];
                    link.assets.push($(this).attr("src"));

                }
            });
            callback();
        });
    },
    function(err){
        callback();
    });
};

/**
    Utility function to check the relativeness of url
    isRelativeUrl handle the case of http/https/HTTP etc. 
    
    @author Swarn Avinash
    @param url
    @chainable

    @example - isRelativeUrl("http://example.com")
*/

var isRelativeUrl = function(url){
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return !r.test(url);
}

/**
    Utility function to remove the query parameter and hashes
    trimUrl maintains the uniqueness of URLs
    
    @author Swarn Avinash
    @param url
    @chainable

    @example - trimUrl("http://example.com")
*/
var trimUrl = function(url) {
    if(url)
        url = url.split("#").pop();
    if(url)
        url = url.split('?').pop();
    if(url)
        url = "/" + url.substring(url.lastIndexOf('/') + 1);
    return url;
}

/**
    Utility function to check the url validity
    urlIsValid handles the case of visited url
    urlIsValid handles the case of email
    urlIsValid handles the relativensss of url

    @author Swarn Avinash
    @param url
    @chainable

    @example - urlIsValid("http://example.com")
*/

var urlIsValid = function(url){
    return url && visitedUrls[url] == null && url.indexOf("mailto") == -1 && isRelativeUrl(url)
}

module.exports = {
    crawl: crawl
};
