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
});
