// import EducationData from '$lib/data/education';

import { MarkdownContent } from '$lib/data/md/markdown-content';
import { prisma } from '$lib/utils/prisma-util';

// export function load({ params }: { params: Record<string, string> }) {
// 	if (params.slug) {
// 		const item = EducationData.items.find((item) => {
// 			return item.slug === params.slug;
// 		});

// 		return { item };
// 	}
// }

export async function load({ params }) {

	try {
		
		const educationId = params.slug;

		if (educationId) {
			const education = await prisma.education.findUnique({
				where: {
					id: educationId
				},
				include: {
					markdown: true,
					logo: true,
				}
			})

			const url = education?.markdown?.mediaURL

			if (url) {
				const markdownContent = await new MarkdownContent(url).getContent();
				return {
					education,
					markdownContent: markdownContent ?? null
				}
			}

			return {
				education,
				markdownContent: null
			}
		}

	} catch (error) {
		
		return {
			education: null,
			markdownContent: null
		}
	}

}
