/* ThingsBoard blog visual kit — kit.js
 * Four behaviours, all progressive: the page is complete and readable without them.
 *   1. loading   — images fade in when they land (the wrapper shows its surface until then)
 *   2. lightbox  — every .shot image opens at natural size (or data-full); same markup as the
 *                  blog template's .blog-lightbox so the site keeps one implementation
 *   3. .compare  — before/after slider (same logic as src/components/UseCase/ImageComparison.astro)
 *   4. .video    — looped clips pause off-screen; with prefers-reduced-motion they show the poster
 *                  and a play button instead of autoplaying. The .video wrapper is the frame,
 *                  on its own or inside a .panel.
 * In Astro, each block goes into its component's <script>; nothing here is page-specific.
 */
(function () {
	'use strict';
	document.documentElement.classList.add('kit-js');

	// ── loading ───────────────────────────────────────────────────────────────
	document.querySelectorAll('.shot > img, .compare img').forEach(function (img) {
		var done = function () { img.classList.add('is-loaded'); };
		if (img.complete && img.naturalWidth) { done(); return; }
		img.addEventListener('load', done, { once: true });
		img.addEventListener('error', done, { once: true });   // never leave a hole; alt text shows
	});

	// ── lightbox ──────────────────────────────────────────────────────────────
	// data-no-lightbox on the image or on any ancestor opts it out; on <html> or .blog-content it
	// switches the lightbox off for the whole page
	var shots = Array.prototype.filter.call(document.querySelectorAll('.shot > img'), function (img) { return !img.closest('[data-no-lightbox]'); });
	if (shots.length) {
		var overlay = document.createElement('div');
		overlay.className = 'blog-lightbox print:hidden';
		overlay.setAttribute('role', 'dialog');
		overlay.setAttribute('aria-modal', 'true');
		overlay.innerHTML = '<img alt="" /><button type="button" class="blog-lightbox__close" aria-label="Close">&times;</button>';
		document.body.appendChild(overlay);
		var lbImg = overlay.querySelector('img');
		var closeBtn = overlay.querySelector('.blog-lightbox__close');
		var opener = null;
		var open = function (img) {
			opener = img;
			lbImg.src = img.dataset.full || img.currentSrc || img.src;   // currentSrc is empty until a lazy image starts loading
			lbImg.alt = img.alt;
			overlay.classList.add('active');
			document.documentElement.style.overflow = 'hidden';
			closeBtn.focus();
		};
		var close = function () {
			overlay.classList.remove('active');
			overlay.classList.add('closing');
			setTimeout(function () { overlay.classList.remove('closing'); }, 300);   // after the fade
			document.documentElement.style.overflow = '';
			if (opener) { opener.focus({ preventScroll: true }); opener = null; }
		};
		shots.forEach(function (img) {
			img.tabIndex = 0;   // reachable by keyboard, like a link
			img.addEventListener('click', function () { open(img); });
			img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
		});
		overlay.addEventListener('click', function (e) { if (e.target !== lbImg) close(); });
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && overlay.classList.contains('active')) close(); });
	}

	// ── .compare ──────────────────────────────────────────────────────────────
	document.querySelectorAll('.compare').forEach(function (c) {
		var overlay = c.querySelector('.compare__overlay');
		var handle = c.querySelector('.compare__handle');
		if (!overlay || !handle) return;
		var dragging = false;
		var vertical = c.classList.contains('compare--vertical');
		function update(e) {
			var r = c.getBoundingClientRect();
			var pos = vertical ? ((e.clientY - r.top) / r.height) * 100 : ((e.clientX - r.left) / r.width) * 100;
			pos = Math.max(0, Math.min(100, pos));
			overlay.style.clipPath = vertical ? 'inset(0 0 ' + (100 - pos) + '% 0)' : 'inset(0 ' + (100 - pos) + '% 0 0)';
			handle.style[vertical ? 'top' : 'left'] = pos + '%';
		}
		c.addEventListener('pointerdown', function (e) { dragging = true; c.setPointerCapture(e.pointerId); update(e); });
		c.addEventListener('pointermove', function (e) { if (!dragging) return; e.preventDefault(); update(e); });
		c.addEventListener('pointerup', function () { dragging = false; });
		c.addEventListener('pointercancel', function () { dragging = false; });
	});

	// ── .video ────────────────────────────────────────────────────────────────
	var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	var videos = document.querySelectorAll('.video video');
	if (!videos.length) return;

	videos.forEach(function (v) {
		if (!reduce) return;
		var box = v.closest('.video');   // positioned, so the play button sits over the clip
		v.removeAttribute('autoplay');
		v.pause();
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'video__play';
		btn.setAttribute('aria-label', 'Play');
		btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
		box.appendChild(btn);
		box.classList.add('video--paused');
		btn.addEventListener('click', function () {
			btn.remove();
			box.classList.remove('video--paused');
			v.play();
		});
	});

	if (reduce || !('IntersectionObserver' in window)) return;
	var io = new IntersectionObserver(function (entries) {
		entries.forEach(function (e) {
			var v = e.target;
			if (e.isIntersecting) { v.play().catch(function () {}); } else { v.pause(); }
		});
	}, { threshold: 0.25 });
	videos.forEach(function (v) { io.observe(v); });
})();
