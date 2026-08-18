import sanitizeHtml from 'sanitize-html';
import { unzipSync, strFromU8 } from 'fflate';
import { setAttachment } from './attachmentCache';

// DOMPurify (incl. isomorphic-dompurify) needs a real `window`/`document` to
// sanitize against, which Cloudflare Workers doesn't provide - and DOM
// polyfills like linkedom are missing enough of the API surface (TreeWalker,
// DOMImplementation) that DOMPurify either silently no-ops or throws. Use a
// parser-based sanitizer instead, which needs no DOM at all.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
	allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
	allowedAttributes: {
		...sanitizeHtml.defaults.allowedAttributes,
		a: ['href', 'name', 'target', 'rel'],
		img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding']
	},
	allowedSchemes: ['http', 'https', 'mailto'],
	transformTags: {
		a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
	}
};

export type OutlineConfig = {
	/** e.g. 'https://app.getoutline.com/api' */
	apiUrl: string;
	apiKey: string;
	/** Route that serves cached attachment bytes. Must match a +server.ts you've added at this path. Defaults to '/api/outline-image'. */
	imageBasePath?: string;
};

export type OutlineDocumentMeta = {
	title: string;
	updatedAt: string;
};

const MIME_TYPES: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	gif: 'image/gif',
	webp: 'image/webp',
	svg: 'image/svg+xml'
};

function mimeTypeFor(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase() ?? '';
	return MIME_TYPES[ext] ?? 'application/octet-stream';
}

/**
 * Outline document URLs look like `.../doc/<slug>-<urlId>`, where urlId is a
 * short id Outline's API also accepts in place of the document's UUID. Pulls
 * that id out of a stored URL; a bare id (already no slashes) passes through.
 */
export function extractOutlineDocId(value: string): string {
	const lastSegment = value.trim().split('/').filter(Boolean).pop() ?? value;
	const match = lastSegment.match(/-([a-zA-Z0-9]{10,15})$/);
	return match ? match[1] : lastSegment;
}

/**
 * Fetches a document's rendered HTML from Outline and sanitizes it.
 *
 * Outline's documents.export endpoint returns plain HTML for text-only
 * documents, but bundles a zip (HTML + attachment files) whenever the
 * document has images. This handles both cases, and rewrites any bundled
 * attachment references to `${imageBasePath}/<id>`, caching the raw bytes
 * via attachmentCache so a matching +server.ts route can serve them.
 *
 * Meant to be called without awaiting immediately in a page's `load`, so
 * SvelteKit can stream the page shell while this (slow) call resolves.
 */
export async function fetchOutlineDocumentHtml(
	documentId: string,
	config: OutlineConfig
): Promise<string> {
	const imageBasePath = config.imageBasePath ?? '/api/outline-image';

	const res = await fetch(`${config.apiUrl}/documents.export`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${config.apiKey}`,
			'Content-Type': 'application/json',
			Accept: 'text/html'
		},
		body: JSON.stringify({ id: documentId }),
		signal: AbortSignal.timeout(60_000)
	});

	if (!res.ok) throw new Error('Document not found');

	let rawHtml: string;

	if (res.headers.get('content-type')?.includes('application/zip')) {
		const files = unzipSync(new Uint8Array(await res.arrayBuffer()));
		const htmlName = Object.keys(files).find((name) => name.endsWith('.html'));
		if (!htmlName) throw new Error('Export bundle missing HTML');

		rawHtml = strFromU8(files[htmlName]);

		for (const [name, data] of Object.entries(files)) {
			if (name === htmlName) continue;
			const id = name.replace(/^attachments\//, '');
			setAttachment(id, data, mimeTypeFor(id));
			rawHtml = rawHtml.split(`attachments/${id}`).join(`${imageBasePath}/${id}`);
		}
	} else {
		rawHtml = await res.text();
	}

	// Defer offscreen images so the initial paint isn't held up by them.
	rawHtml = rawHtml.replace(/<img /g, '<img loading="lazy" decoding="async" ');

	return sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
}

/** Fetches title/updatedAt metadata. Returns null on failure rather than throwing, since this is non-critical. */
export async function fetchOutlineDocumentMeta(
	documentId: string,
	config: OutlineConfig
): Promise<OutlineDocumentMeta | null> {
	try {
		const res = await fetch(`${config.apiUrl}/documents.info`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${config.apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: documentId }),
			signal: AbortSignal.timeout(15_000)
		});

		if (!res.ok) return null;

		const { data } = (await res.json()) as any;
		return { title: data.title, updatedAt: data.updatedAt };
	} catch {
		return null;
	}
}
