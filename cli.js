const stdin = process.openStdin();
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const Path = require('path');
const cheerio = require('cheerio');

console.log('Ready to crawl....');

stdin.addListener('data', async function (url) {
	crawl(url);
});

const visitedLinks = [];

async function crawl(url) {
	let stringifiedUrl = url + '';
	return await axios
		.get(stringifiedUrl)
		.then((response) => {
			let $ = cheerio.load(response.data);
			getRelativeLinksFromPage($);
			searchForPhoneNumbers($);
		})
		.catch((error) => {
			error.status = (error.response && error.response.status) || 500;
			throw error;
		});
}

async function searchForPhoneNumbers($) {
	var bodyText = $('html > body').text();
	// phone number expression
	let regex = /(?:[-+() ]*\d){10,13}/g;

	const array = [...bodyText.matchAll(regex)];
	//console.log(array);
}

function getRelativeLinksFromPage($) {
	let relativeLinks = $('a[href]');
	relativeLinks.each(function () {
		console.log($(this).attr('href'));
	});
}
