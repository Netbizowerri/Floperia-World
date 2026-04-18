import React, { useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { checkIsAdmin, auth, migrateData, getStats, fetchProducts, deleteProduct, addProduct } from '../firebase';
import { Navigate, Link } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Settings, 
  BarChart3,
  ArrowRight,
  Database,
  Plus,
  Trash2,
  RefreshCw,
  Search,
  Bell,
  CheckCircle,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '../lib/utils';
import { AdminNotification, subscribeToNotifications, markAsRead } from '../services/notificationService';

export default function Dashboard() {
  const { user, loading } = useUserStore();
  const isAdmin = checkIsAdmin(user);
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'notifications'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = React.useState<AdminNotification[]>([]);

  React.useEffect(() => {
    if (user && isAdmin) {
      return subscribeToNotifications(setNotifications);
    }
  }, [user, isAdmin]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: getStats,
    enabled: !!user && isAdmin
  });

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['admin-products'],
    queryFn: fetchProducts,
    enabled: !!user && isAdmin
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-off-white">
        <div className="w-12 h-12 border-4 border-brand-plum border-t-brand-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/dashboard' } }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-off-white p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-brand-plum mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You do not have permission to access the admin dashboard.</p>
          
          <div className="bg-gray-50 p-4 rounded-xl text-left text-xs font-mono text-gray-500 mb-6 overflow-auto max-h-48">
            <p className="font-bold text-brand-plum mb-2">Debug Info:</p>
            <p>Email: {user.email}</p>
            <p>UID: {user.uid}</p>
            <p>Verified: {user.emailVerified ? 'Yes' : 'No'}</p>
            <p>Allowed Emails: netbiz0925@gmail.com, service.floperia@gmail.com</p>
            <p>Allowed UIDs: zf1qdx5SvgZ2Weg7bnbhDdngzvh2</p>
          </div>

          <Link to="/" className="btn-primary inline-block w-full mb-3">Return Home</Link>
          <button 
            onClick={() => auth.signOut()}
            className="text-sm text-brand-plum hover:underline"
          >
            Sign Out & Try Another Account
          </button>
        </div>
      </div>
    );
  }

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'confirming' | 'syncing' | 'success' | 'error'>('idle');

  const handleMigrate = async () => {
    setSyncStatus('syncing');
    try {
      await migrateData();
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Migration failed:', error);
      setSyncStatus('error');
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'bridal',
    subcategory: 'Headpiece',
    price: 0,
    description: '',
    images: ['', '', ''],
    videoUrl: ''
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty image URLs
      const filteredImages = newProduct.images.filter(img => img.trim() !== '');
      if (filteredImages.length === 0) {
        alert('Please add at least one image URL.');
        return;
      }
      
      await addProduct({
        ...newProduct,
        images: filteredImages,
        stockStatus: 'in_stock',
        rating: 5.0,
        reviewCount: 0,
        slug: newProduct.name.toLowerCase().replace(/ /g, '-'),
      } as any);
      
      setIsAdding(false);
      setNewProduct({
        name: '',
        category: 'bridal',
        subcategory: 'Headpiece',
        price: 0,
        description: '',
        images: ['', '', ''],
        videoUrl: ''
      });
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('Add failed:', error);
      setSyncStatus('error');
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      setDeletingId(null);
    } catch (error) {
      console.error('Delete failed:', error);
      setSyncStatus('error');
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProducts = products.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statCards = [
    { label: 'Total Orders', value: stats?.orders || 0, icon: <ShoppingBag className="text-blue-600" />, change: 'Real-time' },
    { label: 'Products', value: stats?.products || 0, icon: <Package className="text-purple-600" />, change: 'Live' },
    { label: 'Categories', value: stats?.categories || 0, icon: <Settings className="text-green-600" />, change: 'Live' },
    { label: 'Revenue', value: `₦${(stats?.revenue || 0).toLocaleString()}`, icon: <BarChart3 className="text-orange-600" />, change: 'Total' },
  ];

  return (
    <div className="min-h-screen bg-brand-off-white p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-plum">Admin Dashboard</h1>
            <p className="text-brand-plum/60">Managing Floperia Classic World</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setSyncStatus('confirming')}
                disabled={syncStatus === 'syncing'}
                className="btn-primary flex items-center gap-2 text-sm"
              >
                {syncStatus === 'syncing' ? <RefreshCw className="animate-spin" size={18} /> : <Database size={18} />}
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Mock Data'}
              </button>

              {syncStatus === 'confirming' && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white p-4 rounded-2xl shadow-2xl border border-brand-plum/10 z-50">
                  <p className="text-xs font-bold text-brand-plum mb-3">Sync all mock products to live database?</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSyncStatus('idle')}
                      className="flex-1 py-2 text-xs font-bold text-brand-plum/40 hover:text-brand-plum"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleMigrate}
                      className="flex-1 py-2 bg-brand-plum text-white rounded-lg text-xs font-bold"
                    >
                      Yes, Sync
                    </button>
                  </div>
                </div>
              )}

              {syncStatus === 'success' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-green-500 text-white p-3 rounded-xl shadow-xl z-50 text-xs font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  Sync Successful!
                </div>
              )}

              {syncStatus === 'error' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-red-500 text-white p-3 rounded-xl shadow-xl z-50 text-xs font-bold">
                  Sync Failed. Check console.
                  <button onClick={() => setSyncStatus('idle')} className="block mt-1 underline">Dismiss</button>
                </div>
              )}
            </div>
            <Link to="/" className="text-brand-plum hover:text-brand-gold transition-colors flex items-center gap-1 font-bold text-sm">
              View Site <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-brand-plum/10">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'overview' ? 'text-brand-plum' : 'text-brand-plum/40'}`}
          >
            Overview
            {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-plum rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'products' ? 'text-brand-plum' : 'text-brand-plum/40'}`}
          >
            Manage Products
            {activeTab === 'products' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-plum rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'orders' ? 'text-brand-plum' : 'text-brand-plum/40'}`}
          >
            Orders
            {activeTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-plum rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`pb-4 px-2 font-bold text-sm transition-all relative ${activeTab === 'notifications' ? 'text-brand-plum' : 'text-brand-plum/40'}`}
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {unreadCount}
              </span>
            )}
            {activeTab === 'notifications' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-plum rounded-full" />}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-plum/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-brand-off-white rounded-xl">
                      {stat.icon}
                    </div>
                    <span className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-brand-plum/60 text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-brand-plum mt-1">
                    {isLoadingStats ? '...' : stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-brand-plum/5 p-8">
                <h2 className="text-xl font-bold text-brand-plum mb-6">System Status</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div>
                      <p className="font-bold text-green-800 text-sm">Database Connected</p>
                      <p className="text-green-600 text-xs">Project: floperia-c37bf</p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
                    <RefreshCw className="text-blue-600" size={20} />
                    <div>
                      <p className="font-bold text-blue-800 text-sm">Real-time Sync Active</p>
                      <p className="text-blue-600 text-xs">Listening for orders and inventory changes</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-brand-plum/5">
                <h2 className="text-xl font-bold text-brand-plum mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="w-full p-4 bg-brand-off-white hover:bg-brand-plum hover:text-white transition-all rounded-2xl text-left font-bold flex items-center justify-between group"
                  >
                    Add New Product
                    <Plus size={18} />
                  </button>
                  <button className="w-full p-4 bg-brand-off-white hover:bg-brand-plum hover:text-white transition-all rounded-2xl text-left font-bold flex items-center justify-between group">
                    Manage Categories
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl shadow-sm border border-brand-plum/5 overflow-hidden">
            <div className="p-6 border-b border-brand-plum/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-plum/40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 bg-brand-off-white rounded-xl border-none focus:ring-2 focus:ring-brand-plum transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setIsAdding(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} /> Add Product
              </button>
            </div>

            {isAdding && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-plum/60 backdrop-blur-sm">
                <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-brand-plum/5 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-brand-plum uppercase tracking-tight">Add New Product</h2>
                    <button onClick={() => setIsAdding(false)} className="text-brand-plum/40 hover:text-brand-plum">✕</button>
                  </div>
                  <form onSubmit={handleAddProduct} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-plum/40 uppercase tracking-widest">Product Name</label>
                        <input 
                          required
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={newProduct.name}
                          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-plum/40 uppercase tracking-widest">Price (₦)</label>
                        <input 
                          required
                          type="number"
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={newProduct.price}
                          onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-plum/40 uppercase tracking-widest">Category</label>
                        <select 
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={newProduct.category}
                          onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                        >
                          <option value="bridal">Bridal Accessories</option>
                          <option value="groom">Groom's Accessories</option>
                          <option value="asoebi">Asoebi Accessories</option>
                          <option value="ankara-craft">Ankara Craft</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-plum/40 uppercase tracking-widest">Subcategory</label>
                        <input 
                          className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                          value={newProduct.subcategory}
                          onChange={e => setNewProduct({...newProduct, subcategory: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-brand-plum/40 uppercase tracking-widest">Product Images (URLs)</label>
                      <div className="grid grid-cols-1 gap-3">
                        {newProduct.images.map((img, idx) => (
                          <input 
                            key={idx}
                            placeholder={`Image URL ${idx + 1}`}
                            className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                            value={img}
                            onChange={e => {
                              const imgs = [...newProduct.images];
                              imgs[idx] = e.target.value;
                              setNewProduct({...newProduct, images: imgs});
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-plum/40 uppercase tracking-widest">Video URL (Vimeo preferred)</label>
                      <input 
                        placeholder="https://vimeo.com/..."
                        className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                        value={newProduct.videoUrl}
                        onChange={e => setNewProduct({...newProduct, videoUrl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-brand-plum/40 uppercase tracking-widest">Description</label>
                      <textarea 
                        rows={3}
                        className="w-full p-4 bg-brand-off-white rounded-2xl border-none focus:ring-2 focus:ring-brand-plum"
                        value={newProduct.description}
                        onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 font-bold text-brand-plum/40">Cancel</button>
                      <button type="submit" className="flex-1 btn-primary py-4">Save Product</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-brand-off-white text-brand-plum/40 text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-bold">Product</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold">Price</th>
                    <th className="px-6 py-4 font-bold">Stock</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-plum/5">
                  {filteredProducts.map((product: any) => (
                    <tr key={product.id} className="hover:bg-brand-off-white/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-brand-plum text-sm">{product.name}</p>
                            <p className="text-xs text-brand-plum/40">{product.subcategory}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-brand-plum/5 text-brand-plum text-[10px] font-bold rounded-full uppercase">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-brand-plum text-sm">
                        {formatPrice(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${product.stockCount <= 5 ? 'text-red-500' : 'text-brand-plum'}`}>
                          {product.stockCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>

                          {deletingId === product.id && (
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white p-3 rounded-xl shadow-2xl border border-red-100 z-50">
                              <p className="text-[10px] font-bold text-brand-plum mb-2">Confirm Delete?</p>
                              <div className="flex gap-2">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDeletingId(null); }} 
                                  className="flex-1 py-1 text-[10px] bg-gray-100 rounded font-bold text-gray-600"
                                >
                                  No
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); confirmDelete(product.id); }} 
                                  className="flex-1 py-1 text-[10px] bg-red-600 text-white rounded font-bold"
                                >
                                  Yes
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-brand-plum/5 p-20 text-center">
            <ShoppingBag size={48} className="mx-auto text-brand-plum/10 mb-4" />
            <h3 className="text-xl font-bold text-brand-plum">No orders yet</h3>
            <p className="text-brand-plum/40">Real-time orders will appear here once customers start purchasing.</p>
          </div>
        )}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-brand-plum uppercase tracking-tight">Admin Feed</h2>
              <p className="text-brand-plum/40 text-xs font-bold uppercase tracking-widest">{unreadCount} Unread</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {notifications.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] text-center border border-brand-plum/5">
                  <Bell className="mx-auto text-brand-plum/10 mb-4" size={48} />
                  <h3 className="text-xl font-bold text-brand-plum">All clear!</h3>
                  <p className="text-brand-plum/40">No new notifications at the moment.</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`bg-white p-6 rounded-3xl shadow-sm border ${notif.read ? 'border-brand-plum/5 opacity-70' : 'border-brand-gold ring-1 ring-brand-gold/20'} transition-all`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          notif.type === 'order' ? 'bg-purple-50 text-purple-600' :
                          notif.type === 'training' ? 'bg-blue-50 text-blue-600' :
                          notif.type === 'event' ? 'bg-orange-50 text-orange-600' :
                          'bg-brand-gold/10 text-brand-plum'
                        }`}>
                          {notif.type === 'order' && <ShoppingBag size={24} />}
                          {notif.type === 'training' && <Calendar size={24} />}
                          {notif.type === 'event' && <Users size={24} />}
                          {notif.type === 'contact' && <MessageSquare size={24} />}
                          {notif.type === 'newsletter' && <CheckCircle size={24} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-brand-plum">{notif.title}</h3>
                          <p className="text-[10px] text-brand-plum/40 font-bold uppercase tracking-widest">
                            {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                      {!notif.read && (
                        <button 
                          onClick={() => notif.id && markAsRead(notif.id)}
                          className="text-[10px] font-bold text-brand-plum hover:text-brand-gold uppercase tracking-widest bg-brand-off-white px-3 py-1.5 rounded-lg"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                    <p className="text-brand-plum/70 text-sm mb-4 leading-relaxed">{notif.message}</p>
                    
                    {/* Raw Data Preview */}
                    <details className="group">
                      <summary className="text-[10px] font-bold text-brand-plum/40 uppercase tracking-widest cursor-pointer hover:text-brand-plum flex items-center gap-2">
                        View Raw Details <ArrowRight size={10} className="group-open:rotate-90 transition-transform" />
                      </summary>
                      <pre className="mt-4 p-4 bg-brand-off-white rounded-2xl text-[10px] font-mono text-brand-plum/60 overflow-auto max-h-48">
                        {JSON.stringify(notif.data, null, 2)}
                      </pre>
                    </details>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
