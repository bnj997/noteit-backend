import { PrismaClient } from ".prisma/client";
import prisma from "../lib/prisma";

export type Context = {
  prisma: PrismaClient;
};

export async function createContext(
  _req: Request,
  _res: Response
): Promise<Context> {
  return {
    prisma,
  };
}
