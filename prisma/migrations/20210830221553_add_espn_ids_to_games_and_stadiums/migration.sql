/*
  Warnings:

  - A unique constraint covering the columns `[espnGameId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[espnStadiumId]` on the table `Stadium` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `espnGameId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `espnStadiumId` to the `Stadium` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "espnGameId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Stadium" ADD COLUMN     "espnStadiumId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Game.espnGameId_unique" ON "Game"("espnGameId");

-- CreateIndex
CREATE UNIQUE INDEX "Stadium.espnStadiumId_unique" ON "Stadium"("espnStadiumId");
