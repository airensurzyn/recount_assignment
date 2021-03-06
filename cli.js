const stdin = process.openStdin();
const axios = require('axios');
require('dotenv').config();
const cheerio = require('cheerio');
const URL = require('url-parse');

console.log('Ready to crawl....');

stdin.addListener('data', async function (url) {
	crawl(url);
});

let phoneNumberList = [];
const pagesToVisit = [];
const visitedPages = {};
var urlObject = null;
var baseUrl = '';
let workingDirectory = '';

function getUrlDetails(stringifiedUrl) {
	urlObject = new URL(stringifiedUrl);
	baseUrl = urlObject.protocol + '//' + urlObject.hostname;
	workingDirectory = getCurrentWorkingDirectory(urlObject);
}

function getCurrentWorkingDirectory(parsedUrl) {
	let pathName = parsedUrl.pathname;
	return pathName.substring(0, pathName.lastIndexOf('/'));
}

function createUrlFromRelativePath(relativePath) {
	return baseUrl + relativePath;
}

async function crawl(url) {
	let stringifiedUrl = url + '';
	getUrlDetails(stringifiedUrl);
	pagesToVisit.push(stringifiedUrl);

	while (pagesToVisit.length > 0) {
		let currentUrl = pagesToVisit.shift();
		if (currentUrl in visitedPages) {
			continue;
		} else {
			visitedPages[currentUrl] = true;
			try {
				await axios
					.get(currentUrl)
					.then((response) => {
						let $ = cheerio.load(response.data);
						getRelativeLinksFromPage($);
						searchForPhoneNumbers($);
					})
					.catch((error) => {
						error.status = (error.response && error.response.status) || 500;
						throw error;
					});
				visitedPages[currentUrl] = currentUrl;
			} catch (e) {
				//console.log(e);
				visitedPages[currentUrl] = currentUrl;
			}
		}
	}
	console.log(phoneNumberList);
	console.log('Complete!');
}

async function searchForPhoneNumbers($) {
	var bodyText = $('html > body').text();
	// phone number expression
	let regex = /(?:[-+() ]*\d){10,13}/g;

	const array = [...bodyText.matchAll(regex)];
	for (let i = 0; i < array.length; i++) {
		phoneNumberList.push(array[i][0]);
	}
}

function getRelativeLinksFromPage($) {
	let relativeLinks = $('a[href]');
	relativeLinks.each(function () {
		let token = $(this).attr('href');
		if (token[0] !== '/') {
			token = workingDirectory + '/' + token;
		}
		pagesToVisit.push(baseUrl + token);
	});
}

/**
 * https://therecount.github.io/interview-materials/project-a/1.html
 * https://therecount.github.io/interview-materials/project-a/2.html
 *  - 2.html
 * https://therecount.github.io/interview-materials/project-a/3.html
 *  - /interview-materials/project-a/3.html
 */
