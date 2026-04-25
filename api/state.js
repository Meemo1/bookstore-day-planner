import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const STATE_KEY = 'ibd2026:state';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const state = await redis.get(STATE_KEY);
    return res.status(200).json(state || null);
  }
  if (req.method === 'POST') {
    await redis.set(STATE_KEY, req.body);
    return res.status(200).json({ ok: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
