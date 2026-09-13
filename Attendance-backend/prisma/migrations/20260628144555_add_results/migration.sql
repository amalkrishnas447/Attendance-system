-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "marks" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
