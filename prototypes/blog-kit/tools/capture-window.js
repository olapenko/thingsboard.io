// Bookmarklet: open the current page in a chrome-free window sized for a capture.
//
// Make a bookmark whose URL is "javascript:" followed by the one-line form of this file
// (tools/capture-window.js, minified by hand is fine: remove the comments and newlines).
// Click it on the ThingsBoard page you want to shoot. A popup window has no tabs, no
// bookmarks bar and only a thin address strip, and this sizes its viewport to 1280 × 800
// (the guide's whole-screen viewport). What it cannot do: set the zoom or the device pixel
// ratio. Set the zoom with ⌘+ / ⌘- to the level the guide's table asks for, and for a 2x file
// on a 1x display use DevTools device mode (guide, 1.1) instead of this window.
(function () {
	var w = 1280, h = 800;
	var win = window.open(location.href, 'tb-capture', 'popup=yes,width=' + w + ',height=' + h);
	if (!win) { alert('Popup blocked: allow popups for this site and click again.'); return; }
	// the first size is the outer window; correct it once the page has a viewport
	setTimeout(function () {
		try { win.resizeBy(w - win.innerWidth, h - win.innerHeight); } catch (e) {}
	}, 800);
})();
