import { APP_USER_ID } from "$lib/server/outline-env";
import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {

        const education = await prisma.education.findMany({
            where: {
                userId: APP_USER_ID
            },
            include: {
                logo: true
            }
        })

        return {
            education
        }

    } catch (error) {
        
        return {
            education: []
        }
        
    }

}