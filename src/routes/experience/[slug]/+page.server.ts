import { extractOutlineDocId, fetchOutlineDocumentHtml } from '$lib/server/outline';
import { APP_USER_ID, outlineConfig } from '$lib/server/outline-env';
import { prisma } from '$lib/utils/prisma-util.js';

export async function load({ params }) {

	if (params.slug) {

		try {

			const experience = await prisma.experience.findFirst({
				where: {
					id: params.slug,
					userId: APP_USER_ID
				},
				include: {
					logo: true,
					skills: {
						include: {
							logo: true
						}
					},
					links: true
				}
			})

			const outlineHtml = experience?.outlineDocUrl
				? fetchOutlineDocumentHtml(extractOutlineDocId(experience.outlineDocUrl), outlineConfig)
				: null;

			return {
				experience,
				outlineHtml
			}

		} catch (error) {

			return {
				experience: null,
				outlineHtml: null
			}

		}
	}

	return {
		experience: null,
		outlineHtml: null
	}
}
