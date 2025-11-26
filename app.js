document.addEventListener('DOMContentLoaded', function() {
	const bg = document.querySelector('.background-container');
	const radioSection = document.querySelector('.radio-anim-container');
	const webSection = document.querySelector('.web-anim-container');

	document.getElementById('nav-web').addEventListener('click', function() {
		bg.classList.remove('background-center', 'background-right');
		bg.classList.add('background-left');
		// Show web, hide radio and projector
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
		// Show radio, hide web and projector
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
		// Animation: fade-in radio and card, then player/menu
		setTimeout(() => {
			radioSection.style.opacity = 1;
			setTimeout(() => {
				document.getElementById('sc-player-wrapper').classList.remove('sc-player-hidden');
				document.getElementById('sc-player-wrapper').classList.add('sc-player-show');
				document.getElementById('mix-cover').style.opacity = 1;
				document.getElementById('sc-player').style.opacity = 1;
				document.getElementById('sc-song-menu').style.opacity = 1;
				document.querySelector('.custom-dropdown').style.opacity = 1;
			}, 2000);
		}, 100);
	});
	document.getElementById('nav-youtube').addEventListener('click', function() {
		bg.classList.remove('background-left', 'background-center');
		bg.classList.add('background-right');
		// Show projector, hide web/radio
		webSection.style.display = 'none';
		radioSection.style.display = 'none';
		const ytSection = document.querySelector('.yt-anim-container');
		const ytImg = document.querySelector('.yt-img');
		ytSection.style.display = 'block';
		ytSection.style.opacity = 0;
		ytImg.style.transform = 'scale(0.7)';
		// Fade-in and scale-up animation exactly like radio
		setTimeout(() => {
			ytSection.style.transition = 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)';
			ytSection.style.opacity = 1;
			ytImg.style.transition = 'transform 0.9s cubic-bezier(0.4,0,0.2,1)';
			ytImg.style.transform = 'scale(1)';
		}, 300);
	});
	// Initially: center
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
			// Filter duplicate titles
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
			// Build menu: only show the latest track
			menu.innerHTML = '';
			// Fill custom dropdown
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
			// Default to first track
			if (tracks.length) setTrack(tracks[0].url, tracks[0].img);
	// Dropdown functionality
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
		}).catch(err => {
			console.error('Failed to load SoundCloud RSS feed:', err);
			// Show user-friendly message in the song menu and dropdown
			try {
				menu.innerHTML = '<div class="sc-error">Songs could not be loaded. Please try again later.</div>';
				const dropdownMenuEl = document.getElementById('dropdown-menu');
				if (dropdownMenuEl) dropdownMenuEl.innerHTML = '<li class="sc-error">Unable to load tracks</li>';
			} catch (e) {
				console.error('Error displaying SoundCloud load error:', e);
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

	// Animation: player only show after card
	setTimeout(() => {
		playerWrapper.classList.remove('sc-player-hidden');
		playerWrapper.classList.add('sc-player-show');
		document.getElementById('mix-cover').style.opacity = 1;
		document.getElementById('sc-player').style.opacity = 1;
		document.getElementById('sc-song-menu').style.opacity = 1;
		document.querySelector('.custom-dropdown').style.opacity = 1;
		// YouTube projector animation reset
		const ytSection = document.querySelector('.yt-anim-container');
		if (ytSection) {
			ytSection.style.display = 'none';
			ytSection.style.opacity = 0;
			const ytImg = document.querySelector('.yt-img');
			if (ytImg) ytImg.style.transform = 'scale(0.7)';
		}
	}, 2000); // after card animation

	// Kim Martini SVG animation
	const pattern = document.getElementById("kimPattern");
	if (pattern) {
		const colors = ["#a259c3", "#f857a6", "#43e7e7", "#ffffff", "#7ec8e3"];
		const columns = 20;
		const segmentHeight = 30;
		for (let i = 0; i < columns; i++) {
			const x = i * 50;
			for (let j = 0; j < 4; j++) {
				const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
				rect.setAttribute("x", x);
				rect.setAttribute("y", j * segmentHeight);
				rect.setAttribute("width", 50);
				rect.setAttribute("height", segmentHeight);
				rect.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
				pattern.appendChild(rect);
				if (window.anime) {
					window.anime({
						targets: rect,
						translateY: [
							{ value: -10 + Math.random() * 20, duration: 100 + Math.random() * 100 },
							{ value: 0, duration: 1000 + Math.random() * 100 }
						],
						easing: 'easeInOutSine',
						loop: true,
						direction: 'alternate',
						delay: Math.random() * 1000
					});
				}
			}
		}
	}
	// Web button click
	const webBtn = document.querySelector('.web-btn');
	if (webBtn) {
		webBtn.addEventListener('click', function() {
			window.open('https://2toml.github.io/Kim_Martini/', '_blank');
		});
	}

	let touchStartX = null;
	let touchEndX = null;
	let ignoreSwipe = false; // when true, global swipe detection is disabled (e.g., when interacting with dropdown)
	function handleSwipe() {
	  if (touchStartX === null || touchEndX === null) return;
	  const diff = touchEndX - touchStartX;
	  if (Math.abs(diff) < 50) return; // ignore small swipes
	  // Get current section
	  const s1 = document.getElementById('s1');
	  const s2 = document.getElementById('s2');
	  const s3 = document.getElementById('s3');
	  if (diff < 0) { // swipe left
	    if (s2.checked) {
	      s3.checked = true;
	      document.getElementById('nav-youtube').click();
	    } else if (s1.checked) {
	      s2.checked = true;
	      document.getElementById('nav-soundcloud').click();
	    }
	  } else { // swipe right
	    if (s2.checked) {
	      s1.checked = true;
	      document.getElementById('nav-web').click();
	    } else if (s3.checked) {
	      s2.checked = true;
	      document.getElementById('nav-soundcloud').click();
	    }
	  }
	  touchStartX = null;
	  touchEndX = null;
	}
	document.addEventListener('touchstart', function(e) {
		// If touch originated within the dropdown menu, ignore global swipe handling
		const target = e.target;
		if (target && target.closest && target.closest('.dropdown-menu')) {
			ignoreSwipe = true;
			return;
		}
		if (e.touches.length === 1) {
			touchStartX = e.touches[0].clientX;
		}
	});
	document.addEventListener('touchend', function(e) {
		// If we were ignoring swipe (touch started in dropdown), reset and don't process
		if (ignoreSwipe) {
			ignoreSwipe = false;
			touchStartX = null;
			touchEndX = null;
			return;
		}
		if (e.changedTouches.length === 1) {
			touchEndX = e.changedTouches[0].clientX;
			handleSwipe();
		}
	});
	// Also guard against touchmove on dropdowns that should scroll vertically
	document.addEventListener('touchmove', function(e) {
		if (ignoreSwipe) return; // do nothing if interacting with dropdown
	});
});
window.addEventListener('DOMContentLoaded', function() {
  if (window.innerWidth > 600) {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = 99999;
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = '#fff';
    overlay.innerHTML = '<h2>This app is optimized for mobile</h2>' +
      '<button id="open-mobile-window" style="padding: 12px 28px; font-size: 1.2em; border-radius: 8px; background: linear-gradient(90deg,#a259c3,#43e7e7); color: #fff; border: none; cursor: pointer; margin-top: 24px;">Open in mobile window</button>';
    document.body.appendChild(overlay);
    document.getElementById('open-mobile-window').onclick = function() {
      window.open(window.location.href, '_blank', 'width=400,height=800');
    };
  }
});
