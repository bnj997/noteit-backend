/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_categoryId_fkey";

-- DropIndex
DROP INDEX "Category_name_key";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("name");

-- AddForeignKey
ALTER TABLE "CategoriesOnNotes" ADD CONSTRAINT "CategoriesOnNotes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("name") ON DELETE CASCADE ON UPDATE CASCADE;
