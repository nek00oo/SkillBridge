/*
  Warnings:

  - Added the required column `grade` to the `assignments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assignments" ADD COLUMN     "grade" DOUBLE PRECISION NOT NULL;
