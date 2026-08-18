import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { getAttachment } from '$lib/server/attachmentCache';

export const GET: RequestHandler = async ({ params }) => {
	const cached = getAttachment(params.id);

	if (!cached) {
		throw error(404, 'Image not found');
	}

	return new Response(new Blob([Uint8Array.from(cached.data)], { type: cached.contentType }), {
		headers: {
			'Content-Type': cached.contentType,
			'Cache-Control': 'public, max-age=31536000, immutable'
		}
	});
};
