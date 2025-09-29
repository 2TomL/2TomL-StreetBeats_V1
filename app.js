document.addEventListener('DOMContentLoaded', function() {
	const bg = document.querySelector('.background-container');
	const radioSection = document.querySelector('.radio-anim-container');
	const webSection = document.querySelector('.web-anim-container');

	document.getElementById('nav-web').addEventListener('click', function() {
		bg.classList.remove('background-center', 'background-right');
		bg.classList.add('background-left');
		// Toon web, verberg radio en projector
		radioSection.style.display = 'none';
		webSection.style.display = 'flex';
		const ytSection = document.querySelector('.yt-anim-container');
		if (ytSection) {
			ytSection.style.display = 'none';
			ytSection.style.opacity = 0;
		}
		setTimeout(() => {
			webSection.style.opacity = 1;
		}, 100);
	});
	document.getElementById('nav-soundcloud').addEventListener('click', function() {
		bg.classList.remove('background-left', 'background-right');
		bg.classList.add('background-center');
		// Toon radio, verberg web en projector
		webSection.style.display = 'none';
		radioSection.style.display = 'flex';
		radioSection.style.opacity = 0;
		// Reset player, cover, menu, dropdown
		document.getElementById('sc-player-wrapper').classList.add('sc-player-hidden');
		document.getElementById('sc-player-wrapper').classList.remove('sc-player-show');
		document.getElementById('mix-cover').style.opacity = 0;
		document.getElementById('sc-player').style.opacity = 0;
		document.getElementById('sc-song-menu').style.opacity = 0;
		document.querySelector('.custom-dropdown').style.opacity = 0;
		const ytSection = document.querySelector('.yt-anim-container');
		if (ytSection) {
			ytSection.style.display = 'none';
			ytSection.style.opacity = 0;
		}
		// Animatie: fade-in radio en card, daarna player/menu
		setTimeout(() => {
			radioSection.style.opacity = 1;
			setTimeout(() => {
				document.getElementById('sc-player-wrapper').classList.remove('sc-player-hidden');
				document.getElementById('sc-player-wrapper').classList.add('sc-player-show');
				document.getElementById('mix-cover').style.opacity = 1;
				document.getElementById('sc-player').style.opacity = 1;
				document.getElementById('sc-song-menu').style.opacity = 1;
				document.querySelector('.custom-dropdown').style.opacity = 1;
			}, 900);
		}, 100);
	});
	document.getElementById('nav-youtube').addEventListener('click', function() {
		bg.classList.remove('background-left', 'background-center');
		bg.classList.add('background-right');
		// Toon projector, verberg web/radio
		webSection.style.display = 'none';
		radioSection.style.display = 'none';
		const ytSection = document.querySelector('.yt-anim-container');
		const ytImg = document.querySelector('.yt-img');
		ytSection.style.display = 'block';
		ytSection.style.opacity = 0;
		ytImg.style.transform = 'scale(0.7)';
		// Fade-in en scale-up animatie exact als radio
		setTimeout(() => {
			ytSection.style.transition = 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)';
			ytSection.style.opacity = 1;
			ytImg.style.transition = 'transform 0.9s cubic-bezier(0.4,0,0.2,1)';
			ytImg.style.transform = 'scale(1)';
		}, 300);
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
			// Vul custom dropdown
			let dropdownMenuEl = document.getElementById('dropdown-menu');
			dropdownMenuEl.innerHTML = '';
			tracks.forEach((track, i) => {
				const li = document.createElement('li');
				li.textContent = track.title;
				li.onclick = () => {
					setTrack(track.url, track.img);
					closeDropdown();
				};
				dropdownMenuEl.appendChild(li);
			});
			// Standaard eerste track
			if (tracks.length) setTrack(tracks[0].url, tracks[0].img);
	// Dropdown functionaliteit
	const dropdownBtn = document.getElementById('dropdown-btn');
	const dropdownMenu = document.getElementById('dropdown-menu');
	dropdownBtn.addEventListener('click', function(e) {
		e.stopPropagation();
		dropdownBtn.classList.toggle('active');
		dropdownMenu.classList.toggle('show');
	});
	function closeDropdown() {
		dropdownBtn.classList.remove('active');
		dropdownMenu.classList.remove('show');
	}
	document.addEventListener('click', function(e) {
		if (!dropdownBtn.contains(e.target)) closeDropdown();
	});
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
		document.getElementById('mix-cover').style.opacity = 1;
		document.getElementById('sc-player').style.opacity = 1;
		document.getElementById('sc-song-menu').style.opacity = 1;
		document.querySelector('.custom-dropdown').style.opacity = 1;
		// YouTube projector animatie resetten
		const ytSection = document.querySelector('.yt-anim-container');
		if (ytSection) {
			ytSection.style.display = 'none';
			ytSection.style.opacity = 0;
			const ytImg = document.querySelector('.yt-img');
			if (ytImg) ytImg.style.transform = 'scale(0.7)';
		}
	}, 2200); // na card-animatie
});
