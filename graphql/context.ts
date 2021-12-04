import { PrismaClient } from ".prisma/client";
import { Request, Response } from "express";
import { SessionData } from "express-session";
import { Session } from "inspector";

export type Context = {
  prisma: PrismaClient;
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: string };
  };
  res: Response;
};
