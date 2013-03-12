require.config({
	paths: {
		'jquery': 'jquery',
		'bootstrap': 'bootstrap',
		'lightbox': 'lightbox',
		'modernizr': 'modernizr',
		'elastislide': 'jquery.elastislide'
	},
	shim: {
		'bootstrap': {
			deps: ['jquery']
		},
		'lightbox': {
			deps: ['jquery']
		},
		'elastislide': {
			deps: ['jquery', 'modernizr']
		}
	}
});

require(
[
	'jquery',
	'bootstrap',
	'lightbox',
	'elastislide'
],
function($) {
	$(document).ready(function() {
		// init navigation
		var navbar = $('.navbar');
		var brand = navbar.find('a.brand');
		var lang_items = navbar.find('a.lang');
		var menu_items = navbar.find('ul.nav li');
		brand.click(function() {
			menu_items.removeClass('active');
			navbar.find('div.nav-collapse.in.collapse').collapse('hide');
		});
		menu_items.click(function() {
			navbar.find('div.nav-collapse.in.collapse').collapse('hide');
		});

		// init image galleries
		$('ul.elastislide-list').each(function() {
			var elem = $(this);
			var rel = elem.attr('data-rel');
			var set = elem.attr('data-image-set');
			var cnt = parseInt(elem.attr('data-image-count'));
			for (var i = 1; i <= cnt; i++) {
				var title = lang[set + '_title_' + i];
				if (!title) title = '';
				elem.append([
					'<li>',
						'<a title="' + title + '" href="img/' + set + '/' + set + '-' + i + '.jpg" rel="lightbox[' + rel + ']">',
							'<img src="img/' + set + '/thumb/' + set + '-' + i + '.jpg">',
						'</a>',
					'</li>'
				].join(''));
			}
			elem.elastislide({ minItems: 1 });
		});
	});

	// init google map
	$(window).load(function() {
		var map = new google.maps.Map($('#map_canvas')[0], {
			center: new google.maps.LatLng(44.000000, 15.001209),
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			scrollwheel: false,
			zoom: 10
		});
		var markers = [
			{
				pos: [44.075123, 15.001209],
				title: lang.house_marija,
				img: 'img/map/villa.png'
			},
			{
				pos: [44.133685, 14.871704],
				title: lang.sakarun_beach,
				img: 'img/map/palm-tree.png'
			},
			{
				pos: [44.152073, 14.820347],
				title: lang.veli_rat_lighthouse,
				img: 'img/map/lighthouse.png'
			},
			{
				pos: [43.891437, 15.155771],
				title: lang.telascica_nature_park,
				img: 'img/map/fjord.png'
			},
			{
				pos: [43.823118, 15.29726],
				title: lang.kornati_national_park,
				img: 'img/map/shore.png'
			}
		];
		var infowindow = null;
		var map_icons_img = $('<img width="88" height="31" src="img/map/miclogo.gif" alt="">')
			.hide().appendTo(document.body);
		for (var i = 0; i < markers.length; i++) {
			var mopt = markers[i];
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(mopt.pos[0], mopt.pos[1]),
				icon: new google.maps.MarkerImage(mopt.img, new google.maps.Size(32, 37)),
				shadow: {
					url: 'img/map/shadow.png',
					size: new google.maps.Size(51, 37)
				},
				title: mopt.title,
				map: map
			});
			(function(mopt, marker) {
				google.maps.event.addListener(marker, 'click', function() {
					if (infowindow) infowindow.close();
					var content = $([
						'<div style="height:85px">',
							'<div>' + mopt.title + '</div>',
							'<div style="position:absolute;width:88px;right:0px;bottom:0px;text-align:center;">',
								'<span style="font-family:Arial;font-size:12px;line-height:12px;">',
									lang.map_icons_by,
								'</span>',
								'<a href="http://mapicons.nicolasmollet.com" target="_blank"></a>',
							'</div>',
						'</div>'
					].join(''));
					map_icons_img.appendTo(content.find('a')).show();
					infowindow = new google.maps.InfoWindow({
						content: content[0],
						position: marker.getPosition()
					});
					infowindow.open(map);
				});
			})(mopt, marker);
		}
		google.maps.event.addListener(map, 'click', function() {
			if (infowindow) {
				infowindow.close();
				infowindow = null;
			}
		});
	});
});
