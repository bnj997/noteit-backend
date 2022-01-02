/*
  Warnings:

  - The primary key for the `CategoriesOnNotes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `CategoriesOnNotes` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_userId_fkey";

-- AlterTable
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_pkey",
DROP COLUMN "userId",
ADD CONSTRAINT "CategoriesOnNotes_pkey" PRIMARY KEY ("noteId", "categoryId");

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
