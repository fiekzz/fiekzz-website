import { APP_USER_ID } from "$lib/server/outline-env";
import { prisma } from "$lib/utils/prisma-util";

export async function load() {

    try {

        const projects = await prisma.projects.findMany({
            where: {
                userId: APP_USER_ID
            },
            include: {
                logo: true,
                skills: {
                    include: {
                        logo: true,
                        skillsCategory: true,
                        markdown: true
                    }
                },
                links: true
            }
        })

        const skills = await prisma.skills.findMany({
            where: {
                userId: APP_USER_ID
            },
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