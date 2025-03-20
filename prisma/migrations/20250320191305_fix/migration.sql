/*
  Warnings:

  - Made the column `content` on table `assignments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "assignments" ALTER COLUMN "content" SET NOT NULL;
