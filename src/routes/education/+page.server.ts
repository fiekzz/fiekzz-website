import { prisma } from "$lib/utils/prisma-util";


export async function load() {

    try {
        
        const education = await prisma.education.findMany({
            include: {
                logo: true,
                markdown: true
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