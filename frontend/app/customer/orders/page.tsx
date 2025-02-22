// app/customer/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, PackageCheck, X } from 'lucide-react';

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = () => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] px-6 pb-10 pt-24">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <ClipboardList className="h-6 w-6 text-purple-400" />
                <h1 className="text-3xl font-bold text-white">Your Orders</h1>
            </div>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center mt-20">
                    <PackageCheck className="h-12 w-12 text-gray-500" />
                    <p className="text-gray-400 mt-4 text-lg">You have no orders yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900/80 backdrop-blur-xl rounded-2xl p-5 border border-gray-700 shadow-lg"
                        >
                            <h3 className="text-lg font-semibold text-purple-400 mb-3">
                                Order #{index + 1}
                            </h3>
                            <ul className="space-y-2">
                                {order.slice(0, 2).map((item) => (
                                    <li key={item.id} className="flex justify-between text-gray-300 text-sm">
                                        <span>{item.quantity} × {item.name}</span>
                                        <span className="text-white font-semibold">₹{item.price * item.quantity}</span>
                                    </li>
                                ))}
                                {order.length > 2 && (
                                    <li className="text-gray-400 text-sm">+ {order.length - 2} more items</li>
                                )}
                            </ul>
                            <button
                                onClick={() => setSelectedOrder({ order, index })}
                                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm w-full transition-all"
                            >
                                View Details
                            </button>

                        </motion.div>
                    ))}
                </div>
            )}

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 z-50"
                    >
                        <div className="bg-gray-900/90 rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-700">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">Order #{selectedOrder.index + 1}</h2>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <ul className="space-y-3">
                                {selectedOrder.order.map((item, i) => (
                                    <li key={i} className="flex justify-between text-gray-300">
                                        <div>
                                            <p className="text-white font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-white font-semibold">₹{item.price * item.quantity}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t border-gray-700 mt-4 pt-4">
                                <p className="text-lg font-semibold text-white flex justify-between">
                                    <span>Total:</span>
                                    <span>₹{selectedOrder.order.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md w-full transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
