-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "displayPicture" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "expectations" TEXT,
ADD COLUMN     "foodPreference" TEXT,
ADD COLUMN     "medicalConcerns" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "salary" TEXT,
ADD COLUMN     "willingToRelocate" BOOLEAN NOT NULL DEFAULT true;
