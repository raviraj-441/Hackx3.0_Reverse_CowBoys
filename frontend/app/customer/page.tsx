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
  const [orders, setOrders] = useState<CartItem[][]>([]);
  const [claimedScratchCards, setClaimedScratchCards] = useState<ScratchCardType[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    loadOrders();
    loadScratchCards();

    // Check if a scratch card was already assigned today
    const lastScratchCardDate = localStorage.getItem('lastScratchCardDate');
    const today = new Date().toDateString();

    if (lastScratchCardDate !== today) {
      const randomCard = scratchCards[Math.floor(Math.random() * scratchCards.length)];
      setCurrentScratchCard(randomCard);
      setShowScratchCard(true);
      localStorage.setItem('lastScratchCardDate', today); // Store today's date to prevent multiple prompts
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

  const saveOrder = (newOrder: CartItem[]) => {
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({ title: 'Cart is empty', description: 'Add items before checking out!' });
      return;
    }
    // Save order
    saveOrder(cartItems);
    // Assign reward points based on order value
    const earnedPoints = Math.floor(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) / 10);
    setUserPoints((prev) => prev + earnedPoints);
    // Clear cart after order
    setCartItems([]);
    toast({ title: 'Order Placed!', description: 'Your order has been added to the Orders page.' });
  };

  const loadScratchCards = () => {
    const savedScratchCards = JSON.parse(localStorage.getItem('scratchCards') || '[]');
    setClaimedScratchCards(savedScratchCards);
  };

  const saveScratchCard = (card: ScratchCardType, isClaimed: boolean) => {
    let savedCards = JSON.parse(localStorage.getItem('scratchCards') || '[]');
    // Find if the card already exists
    const existingIndex = savedCards.findIndex((c) => c.id === card.id);
    if (existingIndex !== -1) {
      // Update the existing scratch card status
      savedCards[existingIndex] = { ...card, claimed: isClaimed };
    } else {
      // Add new scratch card
      savedCards.push({ ...card, claimed: isClaimed });
    }

    localStorage.setItem('scratchCards', JSON.stringify(savedCards));
  };

  const handleClaimScratchCard = (card: ScratchCardType) => {
    saveScratchCard(card, true); // Mark as claimed
    setClaimedScratchCards((prev) => [...prev, { ...card, claimed: true }]);
    toast({
      title: 'Reward Claimed!',
      description: `${card.description} has been added to your account.`,
    });
    setShowScratchCard(false);
    setCurrentScratchCard(null);
  };

  const handleCloseScratchCard = (card: ScratchCardType) => {
    saveScratchCard(card, false); // Save as unclaimed
    setClaimedScratchCards((prev) => [...prev, { ...card, claimed: false }]);
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mt-8 mb-4">
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
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0">
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
        <div className="min-h-[50px]">
          <Cart
            items={cartItems}
            summary={orderSummary}
            onRemoveItem={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onUpdateQuantity={handleUpdateQuantity}
          />
        </div>


        {/* Scratch Card */}
        <AnimatePresence>
          {showScratchCard && currentScratchCard && (
            <ScratchCard
              card={currentScratchCard}
              onClose={() => handleCloseScratchCard(currentScratchCard)} // Now saving unclaimed cards
              onClaim={handleClaimScratchCard}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
