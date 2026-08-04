// javascript personalizzato

$(function () {

	// abilito i tooltip
	$('[data-toggle="tooltip"]').tooltip()
});

jQuery(document).ready(function($) {

	// tooltip

	$('.mostraTooltip').hover( function() {
		/* Stuff to do when the mouse enters the element */
		$('div.simulazioniTooltip').css('display', 'flex');
	}, function(){
		$('div.simulazioniTooltip').css('display', 'none');
	});


	// effetto menu
	let hamburger = $( ".link-list li" ).first();

	hamburger.click(function(event) {
		event.preventDefault();

		hamburger.fadeOut('slow', function() {
			$('div.sidebar-wrapper').css('width', '14em');
			$('.link-list-wrapper p').css('display', 'block');
			$('.link-list-wrapper ul li a span').css('display', 'inline-block');
			$('#frecciaVerde').css('display', 'inline-block');
			$('.logo').css('width', '6em').css('marginLeft', '0');
		});

		$('#frecciaVerde a').click(function() {
			$('.link-list-wrapper p').css('display', 'none');
			$('.link-list-wrapper ul li a span').css('display', 'none');
			$('div.sidebar-wrapper').css('width', '80px');
			$('#frecciaVerde').css('display', 'none');
			$('.logo').css('width', '3em').css('marginLeft', '-6px');
			hamburger.css('display', 'block');
		});

	});




});
