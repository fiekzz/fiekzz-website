import { extractOutlineDocId, fetchOutlineDocumentHtml } from '$lib/server/outline';
import { APP_USER_ID, outlineConfig } from '$lib/server/outline-env';
import { prisma } from '$lib/utils/prisma-util.js';

export async function load({ params }) {

	try {

		const projectId = params.slug;

		if (projectId) {

			const project = await prisma.projects.findFirst({
				where: {
					id: projectId,
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

			const outlineHtml = project?.outlineDocUrl
				? fetchOutlineDocumentHtml(extractOutlineDocId(project.outlineDocUrl), outlineConfig)
				: null;

			return {
				project,
				outlineHtml
			}
		}

		return {
			project: null,
			outlineHtml: null
		}

	} catch (error) {

		return {
			project: null,
			outlineHtml: null
		}
	}

}
