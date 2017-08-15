import WebFont from 'webfontloader';

(function() {
	WebFont.load({
		async: true,
		google: {
			families: [
				'Open Sans:400,700,800',
			]
		},
		timeout: 2000,
		active: function() {
			sessionStorage.fonts = true;
		},
		fontactive: function(familyName, fvd) {
			switch(familyName) {
				case 'Open Sans':
					switch(fvd) {
						case 'n4':
							sessionStorage.fontsOpenSansN4 = true;
							break;

						case 'n7':
							sessionStorage.fontsOpenSansN7 = true;
							break;

						case 'n8':
							sessionStorage.fontsOpenSansN8 = true;
							break;
					}

					break;
			}
		}
	});

	/**
	 * Add classes to <html> for each font that is available in session storage.
	 */
	if (sessionStorage.fonts) {
		document.documentElement.classList.add('wf-active');
	}
	if (sessionStorage.fontsOpenSansN4) {
		document.documentElement.classList.add('wf-open-sans-n4-active');
	}
	if (sessionStorage.fontsOpenSansN7) {
		document.documentElement.classList.add('wf-open-sans-n7-active');
	}
	if (sessionStorage.fontsOpenSansN8) {
		document.documentElement.classList.add('wf-open-sans-n8-active');
	}
})();
