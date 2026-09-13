-- CreateTable
CREATE TABLE "Timetable" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id")
);
