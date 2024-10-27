import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, userData } = req.body;

    try {
      await adminDb.collection('users').doc(email).set(userData, { merge: true });
      return res.status(200).json({ message: 'User  data updated successfully' });
    } catch (error) {
      console.error("Error updating user data:", error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
