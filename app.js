document.addEventListener('DOMContentLoaded', function() {
	const bg = document.querySelector('.background-container');
	document.getElementById('nav-web').addEventListener('click', function() {
		bg.classList.remove('background-center', 'background-right');
		bg.classList.add('background-left');
	});
	document.getElementById('nav-soundcloud').addEventListener('click', function() {
		bg.classList.remove('background-left', 'background-right');
		bg.classList.add('background-center');
	});
	document.getElementById('nav-instagram').addEventListener('click', function() {
		bg.classList.remove('background-left', 'background-center');
		bg.classList.add('background-right');
	});
	// Initieel: center
	bg.classList.add('background-center');

	// SoundCloud player logic
	const rssUrl = "https://feeds.soundcloud.com/users/soundcloud:users:1593052395/sounds.rss";
	const corsProxy = "https://api.allorigins.win/raw?url=";
	const playerWrapper = document.getElementById('sc-player-wrapper');
	const player = document.getElementById('sc-player');
	const menu = document.getElementById('sc-song-menu');

	// Helper: get SoundCloud track ID from RSS item
	function getTrackIdFromUrl(url) {
		const match = url.match(/soundcloud.com\/[^\/]+\/[^\/]+/);
		return match ? match[0] : null;
	}

	// Fetch RSS and build menu
	fetch(corsProxy + encodeURIComponent(rssUrl))
		.then(res => res.text())
		.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
		.then(data => {
			const items = Array.from(data.querySelectorAll('item'));
			// Filter dubbele titels
			const seen = new Set();
			const tracks = items.map(item => ({
				title: item.querySelector('title').textContent,
				url: item.querySelector('link').textContent,
				img: item.querySelector('itunes\\:image, image')?.getAttribute('href') || ''
			})).filter(track => {
				if (seen.has(track.title)) return false;
				seen.add(track.title);
				return true;
			});
			// Build menu: alleen de nieuwste track tonen
			menu.innerHTML = '';
			if (tracks.length) {
				const track = tracks[0];
				const btn = document.createElement('button');
				btn.textContent = track.title;
				btn.onclick = () => setTrack(track.url, track.img);
				menu.appendChild(btn);
				setTrack(track.url, track.img);
			}
		});

	// Set SoundCloud player src
	function setTrack(url, img) {
		// Use SoundCloud embed format
		player.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false`;
		const cover = document.getElementById('mix-cover');
		if (img && img.length > 0) {
			cover.src = img;
		} else {
			cover.src = 'assets/photo_icon.png';
		}
		cover.style.display = 'block';
	}

	// Animatie: player pas tonen na card
	setTimeout(() => {
		playerWrapper.classList.remove('sc-player-hidden');
		playerWrapper.classList.add('sc-player-show');
	}, 2200); // na card-animatie
});
