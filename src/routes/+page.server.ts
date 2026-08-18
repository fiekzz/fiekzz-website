import { APP_USER_ID } from "$lib/server/outline-env";
import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {

        const skills = await prisma.skills.findMany({
            where: {
                userId: APP_USER_ID
            },
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