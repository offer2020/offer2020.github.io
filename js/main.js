function setViewport() {
	if (document.querySelector) {
		var viewport = document.querySelector("meta[name=viewport]");
		if (window.innerHeight >= window.innerWidth) { // portrait
			var w = screen.width;
		} else { // landscape
			var w = screen.height;
		}
		if (w > 1100) {
			contentWidth = 1100;
		} else {
			var contentWidth = (((w+50)/100)|0) * 100;
			if (contentWidth < 400) {
				contentWidth = 400;
			}
		}
		viewport.setAttribute('content', 'width='+contentWidth+', initial-scale='+(w/contentWidth)); // device width/content width
		document.body.style.backgroundColor = document.body.style.backgroundColor; // forces full screen redraw. (iOS has problems with clearing the frame buffer when changing content width on orientationchange)
	}
}

function setupNav() {
	$('nav.navbar').each(function() {
		var nav = this;
		$(this).find('.navbar-toggle').each(function() {
			var toggle = this;
			$(this).on('click', function() {
				$(nav).toggleClass('open');
			});
		});
	});
}

$(function() {
	if (window.addEventListener) {
		setViewport();
		window.addEventListener('orientationchange', setViewport);
	}
	setupNav();
});