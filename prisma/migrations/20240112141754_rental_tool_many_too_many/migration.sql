/*
  Warnings:

  - You are about to drop the column `toolId` on the `Rental` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_toolId_fkey";

-- AlterTable
ALTER TABLE "Rental" DROP COLUMN "toolId";

-- CreateTable
CREATE TABLE "_RentalToTool" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RentalToTool_AB_unique" ON "_RentalToTool"("A", "B");

-- CreateIndex
CREATE INDEX "_RentalToTool_B_index" ON "_RentalToTool"("B");

-- AddForeignKey
ALTER TABLE "_RentalToTool" ADD CONSTRAINT "_RentalToTool_A_fkey" FOREIGN KEY ("A") REFERENCES "Rental"("rentalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RentalToTool" ADD CONSTRAINT "_RentalToTool_B_fkey" FOREIGN KEY ("B") REFERENCES "Tool"("toolId") ON DELETE CASCADE ON UPDATE CASCADE;
