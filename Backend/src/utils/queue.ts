import Bull from 'bull';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

export const fileQueue = new Bull('file-processing', {
  redis: redisUrl,
});

export function startFileWorker(processFn: (job: any) => Promise<void>) {
  fileQueue.process('process-file', async (job: any) => {
    try {
      await processFn(job);
    } catch (err) {
      console.error('File worker error', err);
      throw err;
    }
  });
}

export async function enqueueFileProcess(data: any) {
  await fileQueue.add('process-file', data, { attempts: 3, backoff: { type: 'exponential', delay: 1000 } });
}
