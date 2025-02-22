// RewardsPanel.tsx
'use client';

import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RewardItem } from '../types';
import { rewards } from '../data';

interface RewardsPanelProps {
  userPoints: number;
  onRedeemReward: (reward: RewardItem) => void;
}

export function RewardsPanel({ userPoints, onRedeemReward }: RewardsPanelProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Gift className="h-6 w-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Available Rewards</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rewards.map((reward) => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group"
          >
            <div className="relative h-48 rounded-t-2xl overflow-hidden">
              <img
                src={reward.image}
                alt={reward.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-xl font-bold text-white mb-1">{reward.name}</h3>
                <p className="text-sm text-gray-300">{reward.description}</p>
              </div>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl p-4 rounded-b-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-purple-400">{reward.pointsCost} points</span>
                <Button
                  variant="secondary"
                  onClick={() => onRedeemReward(reward)}
                  disabled={userPoints < reward.pointsCost}
                  className={userPoints >= reward.pointsCost ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
                >
                  Redeem
                </Button>
              </div>
              {userPoints < reward.pointsCost && (
                <p className="text-sm text-gray-400">
                  You need {reward.pointsCost - userPoints} more points to redeem this reward
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}