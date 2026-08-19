import { APP_USER_ID } from "$lib/server/outline-env";
import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {

        const [skills, socialLinks] = await Promise.all([
            prisma.skills.findMany({
                where: {
                    userId: APP_USER_ID
                },
                include: {
                    logo: true
                }
            }),
            prisma.socialLinks.findMany({
                where: {
                    userId: APP_USER_ID,
                    enabled: true
                },
                include: {
                    AppMedia: true
                }
            })
        ])

        return {
            skills,
            socialLinks
        }

    } catch (error) {

        return {
            skills: [],
            socialLinks: []
        }
    }

}
