// import SkillsData from '$lib/data/skills';

import { MarkdownContent } from '$lib/data/md/markdown-content.js';
import { prisma } from '$lib/utils/prisma-util.js';

// export function load({ params }: { params: Record<string, string> }) {
// 	if (params.slug) {
// 		const item = SkillsData.items.find((item) => {
// 			return item.slug === params.slug;
// 		});

// 		return { item };
// 	}
// }

export async function load({ params }) {

	try {
		
		const skillId = params.slug;

		if (skillId) {

			const skill = await prisma.skills.findUnique({
				where: {
					id: skillId
				},
				include: {
					markdown: true,
					logo: true,
					skillsCategory: true,
				}
			})

			const experiences = await prisma.experience.findMany({
				include: {
					skills: {
						include: {
							logo: true
						}
					},
					logo: true
				}
			})

			const projects = await prisma.projects.findMany({
				include: {
					skills: {
						include: {
							logo: true
						}
					},
					logo: true
				}
			})

			const url = skill?.markdown?.mediaURL

			if (url) {
				const markdownContent = await new MarkdownContent(url).getContent();
				return {
					skill,
					markdownContent: markdownContent ?? null,
					experiences,
					projects
				}
			}

			return {
				skill,
				experiences,
				projects,
				markdownContent: null
			}

		}

		return {
			skill: null,
			experiences: [],
			projects: [],
			markdownContent: null
		}

	} catch (error) {
		console.error(error);
		return {
			skill: null,
			experiences: [],
			projects: [],
			markdownContent: null
		}
	}

}