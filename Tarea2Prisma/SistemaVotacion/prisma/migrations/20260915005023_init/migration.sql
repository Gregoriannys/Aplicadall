-- CreateTable
CREATE TABLE "Encuesta" (
    "id" SERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "opciones" JSONB NOT NULL,

    CONSTRAINT "Encuesta_pkey" PRIMARY KEY ("id")
);
