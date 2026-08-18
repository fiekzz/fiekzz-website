import { APP_USER_ID } from "$lib/server/outline-env";
import { prisma } from "$lib/utils/prisma-util";


export async function load() {
    try {

        const resume = await prisma.resume.findFirst({
            where: {
                isActive: true,
                userId: APP_USER_ID
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                AppMedia: true
            }
        })

        return {
            resume
        }

    } catch (error) {
        
        console.error("Error fetching resume:", error);

        return {
            resume: null
        }
    }
}