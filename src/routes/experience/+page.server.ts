import { APP_USER_ID } from "$lib/server/outline-env";
import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {

        const experience = await prisma.experience.findMany({
            where: {
                userId: APP_USER_ID
            },
            orderBy: {
                periodTo: 'desc'
            },
            include: {
                skills: {
                    include: {
                        logo: true,
                        markdown: true,
                        skillsCategory: true
                    }
                },
                links: true,
                logo: true
            }
        })

        return {
            experience
        }

    } catch (error) {
        
        return {
            experience: []
        }
    }

}