-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'EXCHANGE_NEW_MESSAGE';

-- AlterTable
ALTER TABLE "InboxMessageNotification" ALTER COLUMN "message_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ExchangeMessageNotification" (
    "notification_id" TEXT NOT NULL,
    "message_id" TEXT,
    "exchange_id" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeMessageNotification_notification_id_key" ON "ExchangeMessageNotification"("notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeMessageNotification_message_id_notification_id_key" ON "ExchangeMessageNotification"("message_id", "notification_id");

-- AddForeignKey
ALTER TABLE "ExchangeMessageNotification" ADD CONSTRAINT "ExchangeMessageNotification_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeMessageNotification" ADD CONSTRAINT "ExchangeMessageNotification_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeMessageNotification" ADD CONSTRAINT "ExchangeMessageNotification_exchange_id_fkey" FOREIGN KEY ("exchange_id") REFERENCES "Exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;
