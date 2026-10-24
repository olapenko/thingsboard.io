/*
 * The snapshot's shell, run before the room's own script. An artifact's links keep only a plain
 * #anchor, never a query, and the room keeps its set in the query (?m=…&ground=…, ?mark=…, ?start=…).
 * So a link to another page of the room hands its query over in sessionStorage, and the page it
 * opens puts it back as its own query before the room reads it. Within a page the room rewrites its
 * address with history.replaceState, which the artifact's frame allows.
 */
/* global document, location, history, Element */
(function () {
	var KEY = 'logo-room:carry';
	try {
		var carried = sessionStorage.getItem(KEY);
		if (carried !== null) {
			sessionStorage.removeItem(KEY);
			if (!location.search && carried)
				history.replaceState(null, '', location.pathname + '?' + carried + location.hash);
		}
	} catch {
		// No storage (a private window): the page opens on its defaults.
	}

	// After the room's own link handlers (the room tabs add the set's query): take the query off the
	// link and keep it for the next page.
	document.addEventListener('click', function (e) {
		var a = e.target instanceof Element ? e.target.closest('a[href]') : null;
		if (!a || e.defaultPrevented) return;
		var url = new URL(a.href, location.href);
		if (url.origin !== location.origin || !/\.html$/.test(url.pathname) || !url.search) return;
		try {
			sessionStorage.setItem(KEY, url.search.slice(1));
		} catch {
			// Without storage the next page opens on its defaults.
		}
		a.href = url.pathname + url.hash;
	});
})();
