/*
  Warnings:

  - A unique constraint covering the columns `[toolId]` on the table `Rental` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rental_toolId_key" ON "Rental"("toolId");
