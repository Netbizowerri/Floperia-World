import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Truck, Package, Scissors, Star, MessageCircle } from 'lucide-react';
import { useOrderStore } from '../store/useOrderStore';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((state) => state.getOrderById(id || ''));

  if (!order) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-brand-plum">Order not found</h2>
        <button onClick={() => navigate('/orders')} className="btn-primary">Back to Orders</button>
      </div>
    );
  }

  const statuses = [
    { id: 'order_placed', label: 'Order Placed', desc: 'We have received your order', icon: CheckCircle2 },
    { id: 'payment_confirmed', label: 'Payment Confirmed', desc: 'Your payment has been verified', icon: Clock },
    { id: 'processing', label: 'Processing', desc: 'Our artisans are handcrafting your order', icon: Scissors },
    { id: 'quality_check', label: 'Quality Check', desc: 'Your pieces are being carefully inspected', icon: Star },
    { id: 'shipped', label: 'Shipped', desc: 'Your order is on its way to you', icon: Truck },
    { id: 'delivered', label: 'Delivered', desc: 'Your order has arrived. Enjoy! 🎉', icon: Package },
  ];

  const currentStatusIndex = statuses.findIndex(s => s.id === order.status);

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 sticky top-16 bg-brand-off-white z-30">
        <button onClick={() => navigate(-1)} className="p-2 text-brand-plum">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-brand-plum">Track Order</h1>
          <p className="text-xs text-brand-gray font-bold uppercase tracking-widest">{order.id}</p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Summary Card */}
        <div className="bg-white rounded-card p-6 shadow-card-rest space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-brand-gray uppercase tracking-widest">Estimated Delivery</span>
            <span className="text-brand-plum font-bold">12 Apr - 15 Apr</span>
          </div>
          <div className="h-2 bg-brand-gray/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((currentStatusIndex + 1) / statuses.length) * 100}%` }}
              className="h-full bg-brand-gold"
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-gray/10">
          {statuses.map((status, index) => {
            const isCompleted = index <= currentStatusIndex;
            const isActive = index === currentStatusIndex;
            const Icon = status.icon;

            return (
              <div key={status.id} className="flex gap-6 relative z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                  isCompleted ? "bg-brand-plum text-white" : "bg-white text-brand-gray border-2 border-brand-gray/10",
                  isActive && "ring-4 ring-brand-plum/20 scale-110"
                )}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className={cn("font-bold", isCompleted ? "text-brand-plum" : "text-brand-gray")}>
                    {status.label}
                  </h3>
                  <p className="text-xs text-brand-gray leading-relaxed">
                    {status.desc}
                  </p>
                  {isCompleted && (
                    <p className="text-[10px] text-brand-gold font-bold uppercase tracking-widest mt-1">
                      {index === 0 ? '8 Apr, 10:30 AM' : 'Processing...'}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Support */}
        <div className="pt-8 space-y-4">
          <h3 className="text-lg font-bold text-brand-plum">Need help?</h3>
          <div className="grid grid-cols-2 gap-4">
            <a 
              href={`https://wa.me/2348067689955?text=Hi!%20I%20need%20help%20with%20Order%20${order.id}`}
              className="flex flex-col items-center justify-center p-4 bg-white rounded-card shadow-card-rest gap-2"
            >
              <MessageCircle className="text-[#25D366]" size={24} />
              <span className="text-xs font-bold text-brand-plum">WhatsApp</span>
            </a>
            <button className="flex flex-col items-center justify-center p-4 bg-white rounded-card shadow-card-rest gap-2">
              <Package className="text-brand-plum" size={24} />
              <span className="text-xs font-bold text-brand-plum">Order Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
