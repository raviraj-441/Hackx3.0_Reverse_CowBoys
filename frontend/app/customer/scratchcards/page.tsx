'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Star, Gift, Menu as MenuIcon, Search } from 'lucide-react';
import { MenuCard } from './components/MenuCard';
import { Cart } from './components/Cart';
import { RewardsPanel } from './components/RewardsPanel';
import { ScratchCard } from './components/ScratchCard';
import { CartItem, MenuItem, OrderSummary, RewardItem } from './types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

// Updated MenuItem interface to match backend response
interface MenuItem {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  tax_percentage: string;
  packaging_charge: string;
  SKU: string;
  variations: {
    [key: string]: number;
  };
  created_at: string;
  description: string | null;
  image_url: string | null;
  preparation_time: number;
}

interface BackendScratchCard {
  name: string;
  sku: string;
  category: string;
  starting_price: number;
  total_ordered: number;
  preparation_time: number;
  image_url: string;
  variations: {
    [key: string]: number;
  };
}

export default function CustomerPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [currentScratchCard, setCurrentScratchCard] = useState<BackendScratchCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orders, setOrders] = useState<CartItem[][]>([]);
  const [claimedScratchCards, setClaimedScratchCards] = useState<BackendScratchCard[]>([]);

  const { toast } = useToast();

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/menu-for-admin');
        const data = await response.json();
    
        if (Array.isArray(data)) {
          setMenuItems(data);
        } else {
          console.error('Unexpected API response format:', data);
          setMenuItems([]); // Prevents breaking `.filter()`
        }
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setMenuItems([]); // Ensures state is always an array
      }
    };    

    fetchMenuItems();
    loadOrders();
    loadScratchCards();

    // Check if a scratch card was already assigned today
    const lastScratchCardDate = localStorage.getItem('lastScratchCardDate');
    const today = new Date().toDateString();

    if (lastScratchCardDate !== today) {
      fetchScratchCard();
      localStorage.setItem('lastScratchCardDate', today);
    }
  }, []);

  const fetchScratchCard = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/get_offer_item');
      const data: BackendScratchCard = await response.json();
      setCurrentScratchCard(data);
      setShowScratchCard(true);
    } catch (error) {
      console.error('Failed to fetch scratch card:', error);
    }
  };

  // Updated filtering logic
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = 
      selectedCategory === 'all' || 
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleAddToCart = (item: MenuItem, quantity: number, variant: string) => {
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.variations[variant],
      quantity,
      variant,
      tax_percentage: parseFloat(item.tax_percentage),
      packaging_charge: parseFloat(item.packaging_charge)
    };

    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id && i.variant === variant);
      if (existingItem) {
        return prev.map(i =>
          i.id === item.id && i.variant === variant
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, cartItem];
    });
  };

  const handleRemoveFromCart = (id: string) => {
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

  // Calculate order summary including tax and packaging
  const orderSummary: OrderSummary = {
    subtotal: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    tax: cartItems.reduce((sum, item) => 
      sum + (item.price * item.quantity * item.tax_percentage / 100), 0),
    packaging: cartItems.reduce((sum, item) => 
      sum + (item.packaging_charge * item.quantity), 0),
    total: cartItems.reduce((sum, item) => 
      sum + 
      (item.price * item.quantity) + 
      (item.price * item.quantity * item.tax_percentage / 100) + 
      (item.packaging_charge * item.quantity), 
    0),
    points: Math.floor(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) / 10)
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
    saveOrder(cartItems);
    const earnedPoints = Math.floor(orderSummary.total / 10);
    setUserPoints((prev) => prev + earnedPoints);
    setCartItems([]);
    toast({ title: 'Order Placed!', description: 'Your order has been added to the Orders page.' });
  };

  const loadScratchCards = () => {
    const savedScratchCards = JSON.parse(localStorage.getItem('scratchCards') || '[]');
    setClaimedScratchCards(savedScratchCards);
  };

  const saveScratchCard = (card: BackendScratchCard, isClaimed: boolean) => {
    let savedCards = JSON.parse(localStorage.getItem('scratchCards') || '[]');
    const existingIndex = savedCards.findIndex((c: BackendScratchCard) => c.sku === card.sku);
    if (existingIndex !== -1) {
      savedCards[existingIndex] = { ...card, claimed: isClaimed };
    } else {
      savedCards.push({ ...card, claimed: isClaimed });
    }
    localStorage.setItem('scratchCards', JSON.stringify(savedCards));
  };

  const handleClaimScratchCard = (card: BackendScratchCard) => {
    // Save the claimed scratch card to localStorage
    const savedCards = JSON.parse(localStorage.getItem('scratchCards') || '[]');
    const updatedCards = [...savedCards, { ...card, claimed: true }];
    localStorage.setItem('scratchCards', JSON.stringify(updatedCards));
  
    // Update the claimedScratchCards state
    setClaimedScratchCards(updatedCards);
  
    // Show a success toast
    toast({
      title: 'Reward Claimed!',
      description: `${card.name} has been added to your account.`,
    });
  
    // Close the scratch card modal
    setShowScratchCard(false);
    setCurrentScratchCard(null);
  };
  
  const handleCloseScratchCard = (card: BackendScratchCard) => {
    // Save the unclaimed scratch card to localStorage
    const savedCards = JSON.parse(localStorage.getItem('scratchCards') || '[]');
    const updatedCards = [...savedCards, { ...card, claimed: false }];
    localStorage.setItem('scratchCards', JSON.stringify(updatedCards));
  
    // Update the claimedScratchCards state
    setClaimedScratchCards(updatedCards);
  
    // Close the scratch card modal
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
              Smart CafÃ©
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
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All Items
              </button>
              {Array.from(new Set(menuItems.map(item => item.category))).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
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

        {/* Menu Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Menu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

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
              onClose={() => handleCloseScratchCard(currentScratchCard)}
              onClaim={handleClaimScratchCard}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}