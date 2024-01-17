/*
  Warnings:

  - You are about to drop the column `customerId` on the `Rental` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contractorId` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rental" DROP CONSTRAINT "Rental_customerId_fkey";

-- AlterTable
ALTER TABLE "Rental" DROP COLUMN "customerId",
ADD COLUMN     "contractorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Customer";

-- CreateTable
CREATE TABLE "Contractor" (
    "contractorId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,

    CONSTRAINT "Contractor_pkey" PRIMARY KEY ("contractorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contractor_contractorId_key" ON "Contractor"("contractorId");

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "Contractor"("contractorId") ON DELETE RESTRICT ON UPDATE CASCADE;
