import { prisma } from "$lib/utils/prisma-util";

export async function load() {

    try {
        
        const projects = await prisma.projects.findMany({
            include: {
                logo: true,
                skills: {
                    include: {
                        logo: true,
                        skillsCategory: true,
                        markdown: true
                    }
                },
                links: true,
                markdown: true
            }
        })

        const skills = await prisma.skills.findMany({
            include: {
                markdown: true,
                logo: true
            }
        })

        return {
            projects,
            skills
        }

    } catch (error) {
        
        return {
            projects: [],
            skills: []
        }
    }

}