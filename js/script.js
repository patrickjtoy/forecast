// attach listener on form submit
$("#getForecast").on("submit", function(event) {
	// prevent the form from performing a normal submit
	event.preventDefault();
	// call the forecast plugin
	$(".forecast").forecast();
});
