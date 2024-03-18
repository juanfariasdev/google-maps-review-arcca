/*
  Warnings:

  - You are about to drop the column `link` on the `establishments` table. All the data in the column will be lost.
  - Added the required column `linkMap` to the `establishments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkReview` to the `establishments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "establishments" DROP COLUMN "link",
ADD COLUMN     "linkMap" TEXT NOT NULL,
ADD COLUMN     "linkReview" TEXT NOT NULL;
