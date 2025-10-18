import ExperienceData from '$lib/data/experience';
import { MarkdownContent } from '$lib/data/md/markdown-content.js';
import { prisma } from '$lib/utils/prisma-util.js';

export async function load({ params }) {

	if (params.slug) {

		try {
			
			const experience = await prisma.experience.findUnique({
				where: {
					id: params.slug
				},
				include: {
					markdown: true,
					logo: true,
					skills: {
						include: {
							logo: true
						}
					},
					links: true
				}
			})

			const url = experience?.markdown?.mediaURL

			if (url) {
				const markdownContent = await new MarkdownContent(url).getContent();
				return {
					experience,
					markdownContent: markdownContent ?? null
				}
			}

			return {
				experience,
				markdownContent: null
			}

		} catch (error) {
			
			return {
				experience: null,
				markdownContent: null
			}

		}
	}

	return {
		experience: null
	}
}
