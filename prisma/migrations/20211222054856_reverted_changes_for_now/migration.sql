/*
  Warnings:

  - You are about to drop the `CategoriesOnNotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_noteId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_userId_fkey";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "category" TEXT NOT NULL DEFAULT E'hello';

-- DropTable
DROP TABLE "CategoriesOnNotes";

-- DropTable
DROP TABLE "Category";
