-- AlterTable
ALTER TABLE "UserMessage" ALTER COLUMN "read" SET DEFAULT false;

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "homeTeamId" TEXT NOT NULL,
    "homeTeamScore" INTEGER NOT NULL,
    "awayTeamId" TEXT NOT NULL,
    "awayTeamScore" INTEGER NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "gameDate" TIMESTAMP(3) NOT NULL,
    "quarter" TEXT NOT NULL,
    "quarterTime" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "started" BOOLEAN NOT NULL DEFAULT false,
    "stadiumId" TEXT NOT NULL,
    "oddsId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "League" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "leagueTypeId" TEXT NOT NULL,
    "startWeek" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "season" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeagueType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NflTeam" (
    "id" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "division" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayerTeam" (
    "id" TEXT NOT NULL,
    "leagueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "streak" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Odds" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "overUnder" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pick" (
    "id" TEXT NOT NULL,
    "playerTeamId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "week" INTEGER NOT NULL,
    "nflTeamId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stadium" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "roof" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Game" ADD FOREIGN KEY ("homeTeamId") REFERENCES "NflTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD FOREIGN KEY ("awayTeamId") REFERENCES "NflTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD FOREIGN KEY ("stadiumId") REFERENCES "Stadium"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD FOREIGN KEY ("oddsId") REFERENCES "Odds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "League" ADD FOREIGN KEY ("leagueTypeId") REFERENCES "LeagueType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTeam" ADD FOREIGN KEY ("leagueId") REFERENCES "League"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerTeam" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pick" ADD FOREIGN KEY ("playerTeamId") REFERENCES "PlayerTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pick" ADD FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pick" ADD FOREIGN KEY ("nflTeamId") REFERENCES "NflTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
