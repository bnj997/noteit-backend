-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategoriesOnNotes" DROP CONSTRAINT "CategoriesOnNotes_noteId_fkey";

-- AddForeignKey
ALTER TABLE "CategoriesOnNotes" ADD CONSTRAINT "CategoriesOnNotes_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnNotes" ADD CONSTRAINT "CategoriesOnNotes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
