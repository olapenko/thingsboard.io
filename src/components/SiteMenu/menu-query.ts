/**
 * The width the menu's row shows from, for scripts; keep in step with `$menu-row-from` in
 * `styles/_variables.scss`. A range, so it and the stylesheets' `(width < …)` meet with no gap.
 *
 * A module of its own, with nothing imported: the browser's scripts read it (`SiteMenu`, the bar's
 * swipe in `HeaderContent`), and taken from `menu-model` it brought the whole navigation data into
 * the page's JavaScript with it — and left the dev server's copy of that data stale on an edit.
 */
export const MENU_ROW_QUERY = '(width >= 1281px)';
