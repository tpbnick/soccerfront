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