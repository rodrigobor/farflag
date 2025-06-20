// src/components/RankingScreen.tsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';

interface RankingEntry {
  username: string;
  score: number;
}

export const RankingScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [rankings, setRankings] = useState<RankingEntry[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const q = query(
        collection(db, 'rankings'),
        orderBy('score', 'desc'),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const data: RankingEntry[] = [];
      snapshot.forEach((doc) => {
        data.push(doc.data() as RankingEntry);
      });
      setRankings(data);
    };
    fetchRanking();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-6">
      <h1 className="text-3xl font-bold mb-6">🏆 Top 10 Players</h1>
      <ul className="w-full max-w-md space-y-3">
        {rankings.map((entry, index) => (
          <li
            key={index}
            className="flex justify-between p-3 bg-gray-100 rounded-lg shadow-sm"
          >
            <span>
              #{index + 1} <strong>@{entry.username}</strong>
            </span>
            <span>{entry.score} pts</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onBack}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold"
      >
        Back
      </button>
    </div>
  );
};
