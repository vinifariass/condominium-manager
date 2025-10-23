/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `condominiums` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."CondominiumStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE');

-- AlterTable
ALTER TABLE "public"."condominiums" ADD COLUMN     "city" TEXT,
ADD COLUMN     "manager" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" "public"."CondominiumStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalBlocks" INTEGER DEFAULT 0,
ADD COLUMN     "totalUnits" INTEGER DEFAULT 0,
ADD COLUMN     "zipCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_cnpj_key" ON "public"."condominiums"("cnpj");
