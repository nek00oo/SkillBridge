/*
  Warnings:

  - You are about to drop the column `turor_id` on the `mentorship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_id,tutor_id]` on the table `mentorship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tutor_id` to the `mentorship` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "mentorship" DROP CONSTRAINT "mentorship_turor_id_fkey";

-- DropIndex
DROP INDEX "mentorship_student_id_turor_id_key";

-- AlterTable
ALTER TABLE "mentorship" DROP COLUMN "turor_id",
ADD COLUMN     "tutor_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "mentorship_student_id_tutor_id_key" ON "mentorship"("student_id", "tutor_id");

-- AddForeignKey
ALTER TABLE "mentorship" ADD CONSTRAINT "mentorship_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
