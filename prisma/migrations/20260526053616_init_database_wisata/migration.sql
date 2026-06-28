-- CreateTable
CREATE TABLE "Ruang" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "kodeAkses" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BUKA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "namaAnggota" TEXT NOT NULL,
    "pilihan" TEXT NOT NULL,
    "ruangId" TEXT NOT NULL,
    "waktuVote" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vote_ruangId_fkey" FOREIGN KEY ("ruangId") REFERENCES "Ruang" ("kodeAkses") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Ruang_kodeAkses_key" ON "Ruang"("kodeAkses");
