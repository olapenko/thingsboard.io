import type { AstroIntegration } from 'astro';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { logoCreateSchema, logoSaveSchema } from '../../src/models/logo-room';
import { markArtPath, markPath, newMarkRecord, writeProposal } from '../../src/util/logo-room-records';

/**
 * The Logo Room's Save to repo, on the dev server only: `POST /__logo-room/save` with one mark's
 * proposal writes it into that mark's record, and `POST /__logo-room/create` with a mark drafted in the
 * Studio writes its record and its artwork, both for a pull request. Nothing of it reaches a build.
 *
 * Only this machine's pages may call it: the request must be JSON (so another site's page cannot send
 * it without a preflight, which this does not answer) from the dev server's own origin.
 */
export const ROUTE = '/__logo-room/save';
export const CREATE_ROUTE = '/__logo-room/create';

/** An artwork the room may draw: an SVG with a viewBox, and nothing that runs. */
const safeSvg = (svg: string) =>
	/^<svg\b[^>]*\bviewBox="[^"]+"/.test(svg.trim()) &&
	!/<script\b|<foreignObject\b|\son\w+\s*=|javascript:|<iframe\b|<!ENTITY/i.test(svg);

const send = (res: ServerResponse, status: number, body: object) => {
	res.statusCode = status;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify(body));
};

const readBody = (req: IncomingMessage) =>
	new Promise<string>((resolve, reject) => {
		let body = '';
		req.on('data', (chunk: Buffer) => {
			body += chunk;
			if (body.length > 256_000) reject(new Error('Too large'));
		});
		req.on('end', () => resolve(body));
		req.on('error', reject);
	});

export const logoRoomSave = () =>
	({
		name: 'logo-room-save',
		hooks: {
			'astro:server:setup'({ server, logger }) {
				const root = server.config.root;
				server.middlewares.use(ROUTE, async (req, res) => {
					if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
					const origin = req.headers.origin;
					if (!origin || new URL(origin).host !== req.headers.host)
						return send(res, 403, { error: 'From the dev server’s own pages only' });
					if (!req.headers['content-type']?.startsWith('application/json'))
						return send(res, 415, { error: 'JSON only' });
					try {
						const parsed = logoSaveSchema.safeParse(JSON.parse(await readBody(req)));
						if (!parsed.success) return send(res, 400, { error: parsed.error.issues[0]?.message ?? 'Invalid' });
						const { mark, treatments, colours, label, remove, notes } = parsed.data;
						const path = markPath(mark);
						const file = join(root, path);
						if (!existsSync(file)) return send(res, 404, { error: `No record ${path}` });
						const before = readFileSync(file, 'utf8');
						const after = writeProposal(before, { treatments, colours, label, remove, notes });
						if (after !== before) writeFileSync(file, after);
						logger.info(`${after === before ? 'unchanged' : 'saved'} ${path}`);
						return send(res, 200, { path, changed: after !== before });
					} catch (e) {
						return send(res, 500, { error: e instanceof Error ? e.message : 'Failed' });
					}
				});
				server.middlewares.use(CREATE_ROUTE, async (req, res) => {
					if (req.method !== 'POST') return send(res, 405, { error: 'POST only' });
					const origin = req.headers.origin;
					if (!origin || new URL(origin).host !== req.headers.host)
						return send(res, 403, { error: 'From the dev server’s own pages only' });
					if (!req.headers['content-type']?.startsWith('application/json'))
						return send(res, 415, { error: 'JSON only' });
					try {
						const parsed = logoCreateSchema.safeParse(JSON.parse(await readBody(req)));
						if (!parsed.success) return send(res, 400, { error: parsed.error.issues[0]?.message ?? 'Invalid' });
						const { mark, svg, ...fields } = parsed.data;
						const path = markPath(mark);
						if (existsSync(join(root, path))) return send(res, 409, { error: `${path} exists already` });
						if (!safeSvg(svg)) return send(res, 400, { error: 'The artwork needs a viewBox, and nothing that runs' });
						const art = markArtPath(mark);
						mkdirSync(dirname(join(root, art)), { recursive: true });
						writeFileSync(join(root, art), svg.endsWith('\n') ? svg : `${svg}\n`);
						writeFileSync(join(root, path), newMarkRecord({ id: mark, ...fields }));
						logger.info(`created ${path} and ${art}`);
						return send(res, 200, { path, art });
					} catch (e) {
						return send(res, 500, { error: e instanceof Error ? e.message : 'Failed' });
					}
				});
			},
		},
	}) satisfies AstroIntegration;
