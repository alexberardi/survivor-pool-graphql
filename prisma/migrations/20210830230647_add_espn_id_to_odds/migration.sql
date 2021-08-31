/*
  Warnings:

  - A unique constraint covering the columns `[espnGameId]` on the table `Odds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `espnGameId` to the `Odds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Odds" ADD COLUMN     "espnGameId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Odds.espnGameId_unique" ON "Odds"("espnGameId");
