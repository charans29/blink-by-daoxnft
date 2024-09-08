import type { NextApiRequest, NextApiResponse } from 'next';
import { Action } from '@dialectlabs/blinks';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).send('Bad Request: Missing or invalid URL');
  }

  try {
    const actionUrl = new URL(url);
    const action = await Action.fetch(actionUrl.href);

    if (!action) {
      return res.status(500).send('Failed to fetch the action');
    }
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json({ action });
  } catch (error) {
    console.error('Failed to fetch action:', error);
    res.status(500).send('Internal Server Error');
  }
}