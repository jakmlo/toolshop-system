-- CreateTable
CREATE TABLE "Tool" (
    "ToolID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "CategoryID" TEXT NOT NULL,
    "Availability" BOOLEAN NOT NULL,

    CONSTRAINT "Tool_pkey" PRIMARY KEY ("ToolID")
);

-- CreateTable
CREATE TABLE "Category" (
    "CategoryID" TEXT NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "Customer" (
    "CustomerID" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "LastName" TEXT NOT NULL,
    "Address" TEXT NOT NULL,
    "PhoneNumber" TEXT NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("CustomerID")
);

-- CreateTable
CREATE TABLE "Rental" (
    "RentalID" TEXT NOT NULL,
    "ToolID" TEXT NOT NULL,
    "CustomerID" TEXT NOT NULL,
    "RentalDate" TIMESTAMP(3) NOT NULL,
    "ReturnDate" TIMESTAMP(3),
    "Status" TEXT NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("RentalID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tool_ToolID_key" ON "Tool"("ToolID");

-- CreateIndex
CREATE UNIQUE INDEX "Category_CategoryID_key" ON "Category"("CategoryID");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_CustomerID_key" ON "Customer"("CustomerID");

-- CreateIndex
CREATE UNIQUE INDEX "Rental_RentalID_key" ON "Rental"("RentalID");

-- AddForeignKey
ALTER TABLE "Tool" ADD CONSTRAINT "Tool_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_ToolID_fkey" FOREIGN KEY ("ToolID") REFERENCES "Tool"("ToolID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_CustomerID_fkey" FOREIGN KEY ("CustomerID") REFERENCES "Customer"("CustomerID") ON DELETE RESTRICT ON UPDATE CASCADE;
