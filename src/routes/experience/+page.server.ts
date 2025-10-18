import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {
        
        const experience = await prisma.experience.findMany({
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
                logo: true,
                markdown: true
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