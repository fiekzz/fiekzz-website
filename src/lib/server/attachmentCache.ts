type CachedAttachment = { data: Uint8Array; contentType: string };

const cache = new Map<string, CachedAttachment>();

export function setAttachment(id: string, data: Uint8Array, contentType: string) {
	cache.set(id, { data, contentType });
}

export function getAttachment(id: string): CachedAttachment | undefined {
	return cache.get(id);
}
