-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('TRANSFER', 'SUBSCRIPTION', 'CARD_PAYMENT');

-- CreateEnum
CREATE TYPE "MovementStatus" AS ENUM ('COMPLETED', 'PENDING', 'REJECTED');

-- Operation numbers have nine digits, like a bank receipt's. Same sequence
-- name Prisma uses for autoincrement(), so the schema still matches.
CREATE SEQUENCE "movements_operationNumber_seq" AS INTEGER START WITH 100000001;

-- AlterTable. Type and status start empty so the existing rows can be filled
-- in before they become required.
ALTER TABLE "movements" ADD COLUMN     "operationNumber" INTEGER NOT NULL DEFAULT nextval('"movements_operationNumber_seq"'),
ADD COLUMN     "operationType" "OperationType",
ADD COLUMN     "status" "MovementStatus",
ADD COLUMN     "taxId" CHAR(11);

ALTER SEQUENCE "movements_operationNumber_seq" OWNED BY "movements"."operationNumber";

-- Existing movements already went through, and only subscriptions aren't
-- transfers. They have no CUIT/CUIL; the seed brings it.
UPDATE "movements"
SET "operationType" = CASE WHEN "type" = 'SUBSCRIPTION' THEN 'SUBSCRIPTION'::"OperationType" ELSE 'TRANSFER'::"OperationType" END,
    "status" = 'COMPLETED';

ALTER TABLE "movements" ALTER COLUMN "operationType" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "movements_operationNumber_key" ON "movements"("operationNumber");

-- Rules Prisma can't express. The operation type has to fit the movement:
-- a subscription is always one, money in always arrives by transfer.
ALTER TABLE "movements" ADD CONSTRAINT "movements_operationType_check" CHECK (
  ("type" = 'SUBSCRIPTION' AND "operationType" = 'SUBSCRIPTION')
  OR ("type" = 'CASH_IN' AND "operationType" = 'TRANSFER')
  OR ("type" = 'CASH_OUT' AND "operationType" IN ('TRANSFER', 'CARD_PAYMENT'))
);

-- A CUIT/CUIL is 11 digits and only transfers carry one.
ALTER TABLE "movements" ADD CONSTRAINT "movements_taxId_check" CHECK (
  "taxId" IS NULL OR ("taxId" ~ '^[0-9]{11}$' AND "operationType" = 'TRANSFER')
);
