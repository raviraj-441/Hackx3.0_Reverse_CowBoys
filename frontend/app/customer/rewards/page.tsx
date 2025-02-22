'use client';
// app/customer/rewards/page.tsx

import {RewardsPanel} from "../components/RewardsPanel";

export default function RewardsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-4">Your Rewards</h1>
      <RewardsPanel userPoints={250} onRedeemReward={() => {}} />
    </div>
  );
}
