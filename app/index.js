
var express = require('express');
var app = express();
var request = require('request');

var i = 1;
var weatherKey = process.env['WEATHER_API_KEY'];
var particleKey = process.env['PARTICLE_ACCESS_TOKEN'];


var daily = 'http://api.wunderground.com/api/'+ weatherKey +'/forecast/q/NY/Brooklyn.json';

app.get('/', function (req, res) {

	request(daily, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var tempToday = JSON.parse(body)['forecast']['simpleforecast']['forecastday'][0]['high']['fahrenheit'];
	    var tempTomorrow = JSON.parse(body)['forecast']['simpleforecast']['forecastday'][1]['high']['fahrenheit'];
		
		var difference = tempTomorrow - tempToday;

		if(difference < 0) {
			command = 'colder';
		}
		else if(difference > 0) {
			command = 'warmer';
		}
		console.log('the difference in temp is ' + difference);
		// callParticle;

		res.send(body);
		request.post({url: 'https://api.particle.io/v1/devices/2b0039000947343432313031/temp?access_token=' + particleKey, args:command}, function(error, res, body){
			console.log("success?");
			console.log(res);
		} )
	  }
	})
	
	// res.sendFile(__dirname + '/index.html');
})


	
// 	function callParticle(command) {

// 		$.post( 'https://api.particle.io/v1/devices/2b0039000947343432313031/temp?access_token=' + particleKey,
// 			{ args: command },
// 			function( data ) {
// 				console.log( data );
// 				console.log( data );
// 			})
// 		.done(function() {
// 			console.log("called Particle");
// 		})

// 	}
	
// 	$('#btn2').click(function(){
// 		getForecast();
// 	})
// });




app.listen(3000, function() {
	console.log('listening on port 3000');
})