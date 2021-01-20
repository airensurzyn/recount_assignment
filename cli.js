const stdin = process.openStdin();
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const Path = require('path');
const cheerio = require('cheerio');
const { default: Axios } = require('axios');
const extractor = require('phone-number-extractor');

const exec = require('child_process').exec;
console.log('Ready to crawl....');

stdin.addListener('data', async function (url) {
	crawl(url);
});

async function crawl(url) {
	let stringifiedUrl = url + '';
	return await axios
		.get(stringifiedUrl)
		.then((response) => {
			searchForPhoneNumbers(cheerio.load(response.data));
		})
		.catch((error) => {
			error.status = (error.response && error.response.status) || 500;
			throw error;
		});
}

async function searchForPhoneNumbers($) {
	var bodyText = $('html > body').text();
	let regex = /(?:[-+() ]*\d){10,13}/g;

	const array = [...bodyText.matchAll(regex)];
	console.log(array);
}
