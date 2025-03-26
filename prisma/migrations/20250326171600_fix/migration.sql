/*
  Warnings:

  - Made the column `content` on table `tutor_cards` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imgUrl` on table `tutor_cards` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tutor_cards" ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "imgUrl" SET NOT NULL;
