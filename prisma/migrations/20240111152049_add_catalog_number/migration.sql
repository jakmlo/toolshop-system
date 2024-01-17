/*
  Warnings:

  - Added the required column `catalogNumber` to the `Tool` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tool" DROP CONSTRAINT "Tool_categoryId_fkey";

-- AlterTable
ALTER TABLE "Tool" ADD COLUMN     "catalogNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_CategoryToTool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTool_AB_unique" ON "_CategoryToTool"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTool_B_index" ON "_CategoryToTool"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToTool" ADD CONSTRAINT "_CategoryToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTool" ADD CONSTRAINT "_CategoryToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("toolId") ON DELETE CASCADE ON UPDATE CASCADE;
