/*
  Warnings:

  - A unique constraint covering the columns `[espnTeamId]` on the table `NflTeam` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `espnTeamId` to the `NflTeam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NflTeam" ADD COLUMN     "espnTeamId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "NflTeam.espnTeamId_unique" ON "NflTeam"("espnTeamId");
