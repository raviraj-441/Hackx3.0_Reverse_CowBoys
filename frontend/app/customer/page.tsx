// page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Star, Gift, Menu as MenuIcon, Search } from 'lucide-react';
import { MenuCard } from './components/MenuCard';
import { Cart } from './components/Cart';
import { RewardsPanel } from './components/RewardsPanel';
import { ScratchCard } from './components/ScratchCard';
import { CartItem, MenuItem, OrderSummary, RewardItem, ScratchCard as ScratchCardType } from './types';
import { menuItems, recommendations, scratchCards, menuCategories } from './data';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

export default function CustomerPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [currentScratchCard, setCurrentScratchCard] = useState<ScratchCardType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    if (!currentScratchCard) { // Prevent multiple scratch cards from appearing
      const randomCard = scratchCards[Math.floor(Math.random() * scratchCards.length)];
      setCurrentScratchCard(randomCard);
      setShowScratchCard(true);
    }
  }, []);

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Prevent negative values
  
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  

  const orderSummary: OrderSummary = {
    subtotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    discount: 0,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    points: Math.floor(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) / 10), // 1 point per ₹10 spent
  };
  

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const specialItems = filteredItems.filter(item => item.category === 'specials');
  const regularItems = filteredItems.filter(item => item.category !== 'specials');

  const handleAddToCart = (item: MenuItem, quantity: number, variant?: string) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id && i.variant === variant);
      if (existingItem) {
        return prev.map((i) =>
          i.id === item.id && i.variant === variant
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { ...item, quantity, variant }];
    });

    const itemRecommendations = recommendations[item.id];
    if (itemRecommendations?.length) {
      toast({
        title: 'Would you like to add?',
        description: itemRecommendations[0].description,
        action: (
          <button
            onClick={() => handleAddToCart(itemRecommendations[0], 1)}
            className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Add for ₹{itemRecommendations[0].price}
          </button>
        ),
      });
    }
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRedeemReward = (reward: RewardItem) => {
    if (userPoints >= reward.pointsCost) {
      setUserPoints((prev) => prev - reward.pointsCost);
      toast({
        title: 'Reward Redeemed!',
        description: `You've successfully redeemed ${reward.name}`,
      });
    }
  };

  const handleCheckout = () => {
    toast({
      title: 'Order Placed!',
      description: 'Your order has been placed successfully.',
    });

    // Show scratch card after successful order
    // const randomCard = scratchCards[Math.floor(Math.random() * scratchCards.length)];
    // setCurrentScratchCard(randomCard);
    // setShowScratchCard(true);

    setCartItems([]);
    const earnedPoints = Math.floor(orderSummary.total / 10); // 1 point per ₹10 spent
    setUserPoints((prev) => prev + earnedPoints);

  };

  const handleClaimScratchCard = (card: ScratchCardType) => {
    toast({
      title: 'Reward Claimed!',
      description: `${card.description} has been added to your account.`,
    });
    setShowScratchCard(false);
    setCurrentScratchCard(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&auto=format&fit=crop)',
            filter: 'brightness(0.3)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A0A]" />
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Smart Café
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl">
              Experience the perfect blend of tradition and innovation.
              Order now and earn rewards with every visit.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        {/* Search and Filter Bar */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 mb-12 shadow-xl border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search our menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
              >
                All Items
              </button>
              {menuCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category.slug
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Points Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-900/20 to-purple-600/20 rounded-xl p-6 mb-12 backdrop-blur-xl border border-purple-500/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-purple-300">Your Points Balance</h3>
              <p className="text-3xl font-bold text-white">{userPoints} pts</p>
            </div>
            <Gift className="h-8 w-8 text-purple-400" />
          </div>
        </motion.div>

        {/* Menu Sections */}
        {specialItems.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Today's Specials</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {regularItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Menu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularItems.map(item => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Rewards Section */}
        <section className="mb-12">
          <RewardsPanel
            userPoints={userPoints}
            onRedeemReward={handleRedeemReward}
          />
        </section>

        {/* Cart */}
        <Cart
          items={cartItems}
          summary={orderSummary}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
          onUpdateQuantity={handleUpdateQuantity} // ✅ Now passing the function
        />

        {/* Scratch Card */}
        <AnimatePresence>
          {showScratchCard && currentScratchCard && (
            <ScratchCard
              card={currentScratchCard}
              onClose={() => setShowScratchCard(false)}
              onClaim={handleClaimScratchCard}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
