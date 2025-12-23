-- CreateTable
CREATE TABLE "ClientData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientData_email_key" ON "ClientData"("email");

-- CreateIndex
CREATE INDEX "ClientData_email_idx" ON "ClientData"("email");

-- CreateIndex
CREATE INDEX "ClientData_region_idx" ON "ClientData"("region");

-- CreateIndex
CREATE INDEX "ClientData_createdAt_idx" ON "ClientData"("createdAt");
