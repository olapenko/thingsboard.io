import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Every Tabler icon as `{ name: body }`, for the Logos workbench's icon picker. About 2 MB, so it is
 * not in the page: the picker fetches it the first time it opens. Static, built once with the site.
 */
export const GET: APIRoute = () => {
	const set = JSON.parse(readFileSync(join(process.cwd(), 'node_modules/@iconify-json/tabler/icons.json'), 'utf8')) as {
		icons: Record<string, { body: string }>;
	};
	const bodies = Object.fromEntries(Object.entries(set.icons).map(([name, icon]) => [name, icon.body]));
	return new Response(JSON.stringify(bodies), { headers: { 'Content-Type': 'application/json' } });
};
