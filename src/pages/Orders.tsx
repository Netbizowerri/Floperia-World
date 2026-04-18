import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, CheckCircle2, Truck, Search } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Orders() {
  const { orders } = useOrderStore();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-24 h-24 bg-brand-plum/5 rounded-full flex items-center justify-center">
          <Package size={48} className="text-brand-plum/20" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-brand-plum">No orders yet</h2>
          <p className="text-brand-gray">Your beautiful Floperia pieces are just a few taps away.</p>
        </div>
        <div className="flex flex-col w-full max-w-sm gap-3">
          <Link to="/shop" className="btn-primary">Start Shopping</Link>
          <button className="btn-secondary flex items-center justify-center gap-2">
            <Search size={20} /> Track by Order Number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-card p-4 shadow-card-rest space-y-4">
            <div className="flex justify-between items-start border-b border-brand-gray/10 pb-3">
              <div>
                <p className="text-xs font-bold text-brand-gray uppercase tracking-widest">Order ID</p>
                <p className="font-bold text-brand-plum">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-brand-gray uppercase tracking-widest">Date</p>
                <p className="text-sm font-bold text-brand-plum">
                  {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {order.items.map((item) => (
                <div key={item.id} className="w-16 h-16 rounded-image overflow-hidden flex-shrink-0 border border-brand-gray/10">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
                <span className="text-sm font-bold text-brand-plum capitalize">
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <span className="font-bold text-brand-plum">{formatPrice(order.total)}</span>
            </div>

            <button 
              onClick={() => navigate(`/orders/${order.id}/track`)}
              className="btn-secondary w-full py-3 flex items-center justify-center gap-2 text-sm"
            >
              Track Order <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
