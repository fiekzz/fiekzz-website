import { MarkdownContent } from '$lib/data/md/markdown-content.js';
import ProjectsData from '$lib/data/projects';
import { prisma } from '$lib/utils/prisma-util.js';

// export function load({ params }: { params: Record<string, string> }) {
// 	if (params.slug) {
// 		const item = ProjectsData.items.find((item) => {
// 			return item.slug === params.slug;
// 		});

// 		return { item };
// 	}
// }

export async function load({ params }) {

	try {
		
		const projectId = params.slug;

		if (projectId) {

			const project = await prisma.projects.findUnique({
				where: {
					id: projectId
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

			const url = project?.markdown?.mediaURL

			if (url) {
				const markdownContent = await new MarkdownContent(url).getContent();
				return {
					project,
					markdownContent: markdownContent ?? null
				}
			}

			return {
				project,
				markdownContent: null
			}
		}

		return {
			project: null,
			markdownContent: null
		}

	} catch (error) {
		
		return {
			project: null,
			markdownContent: null
		}
	}

}
