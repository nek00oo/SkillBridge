-- DropForeignKey
ALTER TABLE "subject_category" DROP CONSTRAINT "subject_category_tutor_id_fkey";

-- AddForeignKey
ALTER TABLE "subject_category" ADD CONSTRAINT "subject_category_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;
