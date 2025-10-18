import Singleton from "./singleton";

export const prisma = Singleton.getInstance().getPrisma()