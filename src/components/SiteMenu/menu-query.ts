/**
 * The widths the menu changes shape at, for scripts; keep in step with `$menu-row-from`,
 * `$menu-split-from` and `$menu-split-min-height` in `styles/_variables.scss`. Ranges, so they and
 * the stylesheets' `(width < …)` meet with no gap.
 *
 * A module of its own, with nothing imported: the browser's scripts read it (`SiteMenu`, the bar's
 * swipe in `HeaderContent`), and taken from `menu-model` it brought the whole navigation data into
 * the page's JavaScript with it — and left the dev server's copy of that data stale on an edit.
 */

/** The row and its panel; under it, the Menu button and the sheet. */
export const MENU_ROW_QUERY = '(width >= 1200px)';

/** The sheet split: the list as a sidebar beside the open section. Only matters under the row. */
export const MENU_SPLIT_QUERY = '(width >= 720px) and (height >= 540px)';
