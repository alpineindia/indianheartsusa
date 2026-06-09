-- CreateTable
CREATE TABLE "FamilyManager" (
    "id" TEXT NOT NULL,
    "managerUserId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyManager_managerUserId_memberId_key" ON "FamilyManager"("managerUserId", "memberId");

-- AddForeignKey
ALTER TABLE "FamilyManager" ADD CONSTRAINT "FamilyManager_managerUserId_fkey" FOREIGN KEY ("managerUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyManager" ADD CONSTRAINT "FamilyManager_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
