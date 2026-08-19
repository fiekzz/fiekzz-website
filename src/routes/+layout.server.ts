import { APP_USER_ID } from "$lib/server/outline-env";
import { prisma } from "$lib/utils/prisma-util";

export async function load() {

    try {

        const siteSettings = await prisma.siteSettings.findUnique({
            where: {
                userId: APP_USER_ID
            },
            include: {
                AppMedia: true
            }
        })

        return {
            siteSettings
        }

    } catch (error) {

        return {
            siteSettings: null
        }
    }

}
