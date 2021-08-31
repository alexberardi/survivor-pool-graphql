/*
  Warnings:

  - You are about to drop the column `conference` on the `NflTeam` table. All the data in the column will be lost.
  - You are about to drop the column `division` on the `NflTeam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NflTeam" DROP COLUMN "conference",
DROP COLUMN "division";
