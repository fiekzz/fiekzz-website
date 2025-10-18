import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {
        
        const skills = await prisma.skills.findMany({
            include: {
                logo: true
            }
        })

        return {
            skills
        }

    } catch (error) {
        
        return {
            skills: []
        }
    }

}