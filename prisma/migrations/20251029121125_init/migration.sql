-- CreateEnum
CREATE TYPE "ActivityLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'DEBUG');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "companyName" VARCHAR(150),
    "phone" VARCHAR(50),
    "email" VARCHAR(150) NOT NULL,
    "passwordHash" VARCHAR(255) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" VARCHAR(255),
    "passwordResetToken" VARCHAR(255),
    "passwordResetExpiry" TIMESTAMP(3),
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockoutUntil" TIMESTAMP(3),
    "countryId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userType" "UserType" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "level" "ActivityLevel" NOT NULL,
    "message" TEXT,
    "data" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GemType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GemType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shape" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Shape_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clarity" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Clarity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CutPolish" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CutPolish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Saturation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Saturation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CuttingStyle" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CuttingStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Effect" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Effect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transparency" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Transparency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Texture" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Texture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fluorescence" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Fluorescence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Origin" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Origin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appellation" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Appellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BuyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabReport" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "LabReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GemMaster" (
    "id" SERIAL NOT NULL,
    "gemTypeId" INTEGER NOT NULL,
    "shapeId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,
    "clarityId" INTEGER NOT NULL,
    "cutPolishId" INTEGER NOT NULL,
    "saturationId" INTEGER NOT NULL,
    "treatmentId" INTEGER NOT NULL,
    "cuttingStyleId" INTEGER NOT NULL,
    "effectId" INTEGER NOT NULL,
    "transparencyId" INTEGER NOT NULL,
    "textureId" INTEGER NOT NULL,
    "fluorescenceId" INTEGER NOT NULL,
    "originId" INTEGER NOT NULL,
    "appellationId" INTEGER NOT NULL,
    "buyerCountryId" INTEGER NOT NULL,
    "labReportId" INTEGER NOT NULL,
    "calibrated" BOOLEAN,
    "weight" DECIMAL(65,30),
    "length" DECIMAL(65,30),
    "width" DECIMAL(65,30),
    "budget" DECIMAL(65,30),
    "quantity" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GemMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GemRequest" (
    "id" SERIAL NOT NULL,
    "buyerId" INTEGER NOT NULL,
    "gemTypeId" INTEGER NOT NULL,
    "shapeId" INTEGER,
    "colorId" INTEGER,
    "clarityId" INTEGER,
    "cutPolishId" INTEGER,
    "saturationId" INTEGER,
    "treatmentId" INTEGER,
    "cuttingStyleId" INTEGER,
    "effectId" INTEGER,
    "transparencyId" INTEGER,
    "textureId" INTEGER,
    "fluorescenceId" INTEGER,
    "originId" INTEGER,
    "appellationId" INTEGER,
    "buyerCountryId" INTEGER NOT NULL,
    "labReportId" INTEGER,
    "calibrated" BOOLEAN,
    "cuttingQuality" TEXT,
    "weightFrom" DECIMAL(65,30),
    "weightTo" DECIMAL(65,30),
    "lengthFrom" DECIMAL(65,30),
    "lengthTo" DECIMAL(65,30),
    "widthFrom" DECIMAL(65,30),
    "widthTo" DECIMAL(65,30),
    "budgetFrom" DECIMAL(65,30),
    "budgetTo" DECIMAL(65,30),
    "quantity" INTEGER,
    "buyTypeId" INTEGER NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedBy" INTEGER,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GemRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_gemTypeId_fkey" FOREIGN KEY ("gemTypeId") REFERENCES "GemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_clarityId_fkey" FOREIGN KEY ("clarityId") REFERENCES "Clarity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_cutPolishId_fkey" FOREIGN KEY ("cutPolishId") REFERENCES "CutPolish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_saturationId_fkey" FOREIGN KEY ("saturationId") REFERENCES "Saturation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_cuttingStyleId_fkey" FOREIGN KEY ("cuttingStyleId") REFERENCES "CuttingStyle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_effectId_fkey" FOREIGN KEY ("effectId") REFERENCES "Effect"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_transparencyId_fkey" FOREIGN KEY ("transparencyId") REFERENCES "Transparency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_textureId_fkey" FOREIGN KEY ("textureId") REFERENCES "Texture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_fluorescenceId_fkey" FOREIGN KEY ("fluorescenceId") REFERENCES "Fluorescence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_appellationId_fkey" FOREIGN KEY ("appellationId") REFERENCES "Appellation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_buyerCountryId_fkey" FOREIGN KEY ("buyerCountryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_labReportId_fkey" FOREIGN KEY ("labReportId") REFERENCES "LabReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemMaster" ADD CONSTRAINT "GemMaster_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_gemTypeId_fkey" FOREIGN KEY ("gemTypeId") REFERENCES "GemType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_shapeId_fkey" FOREIGN KEY ("shapeId") REFERENCES "Shape"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_clarityId_fkey" FOREIGN KEY ("clarityId") REFERENCES "Clarity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_cutPolishId_fkey" FOREIGN KEY ("cutPolishId") REFERENCES "CutPolish"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_saturationId_fkey" FOREIGN KEY ("saturationId") REFERENCES "Saturation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_cuttingStyleId_fkey" FOREIGN KEY ("cuttingStyleId") REFERENCES "CuttingStyle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_effectId_fkey" FOREIGN KEY ("effectId") REFERENCES "Effect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_transparencyId_fkey" FOREIGN KEY ("transparencyId") REFERENCES "Transparency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_textureId_fkey" FOREIGN KEY ("textureId") REFERENCES "Texture"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_fluorescenceId_fkey" FOREIGN KEY ("fluorescenceId") REFERENCES "Fluorescence"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_appellationId_fkey" FOREIGN KEY ("appellationId") REFERENCES "Appellation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_buyerCountryId_fkey" FOREIGN KEY ("buyerCountryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_labReportId_fkey" FOREIGN KEY ("labReportId") REFERENCES "LabReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GemRequest" ADD CONSTRAINT "GemRequest_buyTypeId_fkey" FOREIGN KEY ("buyTypeId") REFERENCES "BuyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
