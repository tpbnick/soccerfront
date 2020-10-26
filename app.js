/* api-football key a2994c55ccmsh52c97e939e28026p1ac42djsn3342553e6cbb
https://rapidapi.com/api-sports/api/api-football-beta
*/

const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) =>{
	res.render('home')

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});


})

app.listen(3000, () => {
	console.log('Serving on port 3000')
})