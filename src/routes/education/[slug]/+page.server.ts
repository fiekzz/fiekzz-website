import { extractOutlineDocId, fetchOutlineDocumentHtml } from '$lib/server/outline';
import { APP_USER_ID, outlineConfig } from '$lib/server/outline-env';
import { prisma } from '$lib/utils/prisma-util';

export async function load({ params }) {

	if (!params.slug) {
		return {
			education: null,
			outlineHtml: null
		}
	}

	try {

		const education = await prisma.education.findFirst({
			where: {
				id: params.slug,
				userId: APP_USER_ID
			},
			include: {
				logo: true,
			}
		})

		const outlineHtml = education?.outlineDocUrl
			? fetchOutlineDocumentHtml(extractOutlineDocId(education.outlineDocUrl), outlineConfig)
			: null;

		return {
			education,
			outlineHtml
		}

	} catch (error) {

		return {
			education: null,
			outlineHtml: null
		}
	}

}
