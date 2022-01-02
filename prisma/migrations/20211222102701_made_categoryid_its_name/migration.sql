/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "name",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT E'default category',
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "CategoriesOnNotes" ADD CONSTRAINT "CategoriesOnNotes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
