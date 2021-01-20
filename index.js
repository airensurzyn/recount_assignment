const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const app = express();
const port = process.env.PORT || 8080;

app.use('/', express.static(path.resolve(__dirname, 'public')));

app.listen(port, () => {
	console.log('Listening on port 8080');
});

const axios = require('axios');

const url = 'https://therecount.github.io/interview-materials/project-a/2.html';
console.log('Visiting page ' + url);

const fetchHtmlFromUrl = async () => {
	return await axios
		.get(url)
		.then((response) => {
			cheerio.load(response.data);
			console.log(response.data);
		})
		.catch((error) => {
			error.status = (error.response && error.response.status) || 500;
			throw error;
		});
};

fetchHtmlFromUrl();
