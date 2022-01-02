-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_creatorId_fkey";

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
