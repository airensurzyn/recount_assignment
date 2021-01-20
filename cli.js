const stdin = process.openStdin();
const fs = require('fs');
const axios = require('axios');
require('dotenv').config();
const Path = require('path');
const cheerio = require('cheerio');
const { default: Axios } = require('axios');

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
			let cheerio_data = cheerio.load(response.data);
			searchForPhoneNumbers(cheerio_data);
			//console.log(response.data);
		})
		.catch((error) => {
			error.status = (error.response && error.response.status) || 500;
			throw error;
		});
}

async function searchForPhoneNumbers(data) {
	var bodyText = data('html > body').text().toLowerCase();
	console.log(data.html());
	/*console.log(bodyText);
	var phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	for (let i = 0; i < bodyText.length; i++) {
		if (parseInt(bodyText[i]) >= '0' || parseInt(bodyText[i]) <= '9') {
			console.log(bodyText[i]);
			console.log(bodyText.substring(i, i + 11).match(phoneNumberRegex));
		}
	}
	console.log(bodyText.match(phoneNumberRegex));*/
}

/**
 * ^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$
 */
