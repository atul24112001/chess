-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "message" TEXT NOT NULL DEFAULT 'Checkmate';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 1000;
