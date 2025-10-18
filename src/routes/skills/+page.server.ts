import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {

        const skillsCategory = await prisma.skillsCategory.findMany({
            where: {
                Skills: {
                    some: {
                        id: {
                            not: undefined
                        }
                    }
                }
            },
            include: {
                Skills: {
                    include: {
                        logo: true,
                        markdown: true
                    }
                }
            }
        })

        return {
            categories: skillsCategory
        }

    } catch (error) {
        
        return {
            categories: []
        }
    }

}