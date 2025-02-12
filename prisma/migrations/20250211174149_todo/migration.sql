-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "tasks" TEXT[],
    "users" TEXT[],

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
