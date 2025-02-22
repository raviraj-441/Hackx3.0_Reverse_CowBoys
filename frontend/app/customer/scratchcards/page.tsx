// app/customer/scratchcards/page.tsx
"use client";

import { useState, useEffect } from "react";
import {ScratchCard} from "../components/ScratchCard";
import { dailyScratchCard } from "../data";

export default function ScratchCardsPage() {
  const [scratchCard, setScratchCard] = useState(null);

  useEffect(() => {
    setScratchCard(dailyScratchCard); // Get daily scratch card
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Your Daily Scratch Card</h1>
      {scratchCard ? (
        <ScratchCard card={scratchCard} onClaim={() => {}} />
      ) : (
        <p className="text-gray-400 text-center">No scratch cards available today.</p>
      )}
    </div>
  );
}
