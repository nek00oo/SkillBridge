/*
  Warnings:

  - You are about to drop the column `tutor_id` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `card_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_tutor_id_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "tutor_id",
ADD COLUMN     "card_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "tutor_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
