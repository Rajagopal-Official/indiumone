import { Injectable } from '@angular/core';
import { QueueServiceClient, QueueClient } from '@azure/storage-queue';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private queueName = 'loginlogs';
  private queueServiceClient: QueueServiceClient;

  constructor() {
    const connectionString = 'YOUR_AZURE_STORAGE_CONNECTION_STRING';//Replace Actual String 
    this.queueServiceClient = QueueServiceClient.fromConnectionString(connectionString);
  }

  async logLogin(username: string|undefined, timestamp: string) {
    const queueClient: QueueClient = this.queueServiceClient.getQueueClient(this.queueName);
    const logEntry = JSON.stringify({ username, timestamp });
    await queueClient.sendMessage(logEntry);
  }
}