-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "plan" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "unitPriceCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "PricingRule_active_plan_period_itemType_idx" ON "PricingRule"("active", "plan", "period", "itemType");

-- CreateIndex
CREATE UNIQUE INDEX "PricingRule_plan_period_itemType_key" ON "PricingRule"("plan", "period", "itemType");
