export interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  body: any;
  timestamp: string;
  retryCount: number;
}

const QUEUE_KEY = 'smart_rescue_offline_queue';

class OfflineQueueService {
  private getQueue(): QueuedRequest[] {
    const queue = localStorage.getItem(QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  }

  private setQueue(queue: QueuedRequest[]) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }

  enqueue(url: string, method: string, body: any) {
    const queue = this.getQueue();
    queue.push({
      id: Math.random().toString(36).substring(2, 15),
      url,
      method,
      body,
      timestamp: new Date().toISOString(),
      retryCount: 0
    });
    this.setQueue(queue);
    
    // Attempt to flush immediately if online
    if (navigator.onLine) {
      this.flushQueue();
    }
  }

  async flushQueue() {
    if (!navigator.onLine) return;

    const queue = this.getQueue();
    if (queue.length === 0) return;

    const remainingQueue: QueuedRequest[] = [];

    for (const req of queue) {
      try {
        const response = await fetch(req.url, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(req.body)
        });

        if (!response.ok) {
          throw new Error('Server returned error');
        }
        // Successfully sent, so don't add to remainingQueue
      } catch (error) {
        req.retryCount += 1;
        if (req.retryCount < 5) {
          remainingQueue.push(req);
        }
      }
    }

    this.setQueue(remainingQueue);
  }

  getQueueLength() {
    return this.getQueue().length;
  }
}

export const offlineQueueService = new OfflineQueueService();

// Listen for online event to automatically flush queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    offlineQueueService.flushQueue();
  });
}
