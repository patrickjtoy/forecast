(function($) {
	$.fn.forecast = function() {
		// set variables:
		// - location is an array with two values; city and state
		// - unit is either imperial (default) or metric
		// - delay is an integer used to control:
		// -- the length an alert should display for
		// -- when the promise in updatePage() fires
		// - openWeatherMapAPI uses city and state, passed to function
		// - now holds a date object
		// - weekdays holds an array of the days of the week
		// - day is a counter, incremented on line 88
		// - forecast is an empty object, initialized to hold the weather data
		var location = $(".location").val().split(","),
				city = location[0],
				state = location[1],
				unit = $(".unit:checked").val(),
				delay = 500,
				openWeatherMapAPI = "http://api.openweathermap.org/data/2.5/forecast/daily?q="+ city +","+ state +"&units="+ unit +"&cnt=5",
				now = new Date(),
				weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				day = 0,
				forecast = {};

		// set forecast arrays to hold data for each day of the 5 day forecast
		forecast.high = [];
		forecast.low = [];
		forecast.desc = [];
		forecast.img = [];

		// check if data entered is valid:
		// if the location array has more than one value:
		if(location.length > 1) {
			// fade out existing forecast and hide the element from the DOM
			$(".forecast").addClass("animated fadeOutDown").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).addClass("hidden");
				$(this).removeClass("animated fadeOutDown");
			});
			// fetch new data
			$(".forecast").promise().done(function() {
				getData();
			});
		}	else {
				// alert the user that they've used an incorrect format
				showAlert("warning", "<strong>Uh oh!</strong> Please enter location in the format: City, State", 5);
			}

		// handle alerts
		function showAlert(type, msg, mod) {
			$("#system-message-container").hide().html('<div class="alert-box ' + type +' text-center">'+ msg +'</div>').slideDown("slow");
			window.setTimeout(function() {
				$(".alert-box").fadeTo("fast", 0).slideUp("slow");
			}, (delay)*(mod));
		}

		// retrieve json data from the openweathermap API
		function getData() {
			$.getJSON(openWeatherMapAPI, {
				format: "json"
			}).done(function(data) {
				// good data returned
				if(data.cod === "200") {
					// let the user know the retrieval was successful
					showAlert("success", "<strong>Success!</strong> Retrieving forecast...", 4);
					// process the data feed
					forecast = processFeed(data);
					// update the DOM
					updatePage(forecast);
				} else {
					// alert the user that the location could not be found
					showAlert("warning", "<strong>Uh oh!</strong> The location you entered could not be found", 5);
				}
			});
		}

		// process the json data from the openweathermap API
		function processFeed(data) {
			$.each(data.list, function(i, item) {
				forecast.high[i] = Math.round(data.list[i].temp.max);
				forecast.low[i] = Math.round(data.list[i].temp.min);
				forecast.desc[i] = data.list[i].weather[0].description.capitalize();
				forecast.img[i] = data.list[i].weather[0].icon;
			});

			return forecast;
		}

		// update the DOM with requested forecast data
		function updatePage(forecast) {
			$.each($(".day"), function(i) {
				$(this).delay((delay)*i);
				$(this).children(".weekday").html(weekdays[now.getDay() + i] || weekdays[day++]);
				$(this).children(".high").html("High: " + forecast.high[i] + "&deg; F");
				$(this).children(".low").html("Low: " + forecast.low[i] + "&deg; F");
				$(this).children(".desc").html(forecast.desc[i]);
				$(this).children(".img").html('<img src="http://openweathermap.org/img/w/' + forecast.img[i] + '.png" />');
			});

			$(".day").promise().done(function() {
				$(this).syncHeight({'updateOnResize': true});
				$(".forecast").removeClass("hidden");
				$(this).addClass("animated fadeInUp").one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					$(this).removeClass("animated fadeInUp");
				});
			});
		}

		// capitalize the first character of a string
		String.prototype.capitalize = function() {
			return this.charAt(0).toUpperCase() + this.slice(1);
		}

		// return object for chaining
		return this;
	}
})(jQuery);