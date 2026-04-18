import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './useCartStore';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 1000,
  category: 'test',
  subcategory: 'test',
  images: ['test.jpg'],
  description: 'test description',
  rating: 5,
  reviews: 0
};

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds an item to the cart', () => {
    useCartStore.getState().addItem(mockProduct as any);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('1');
    expect(state.items[0].quantity).toBe(1);
  });

  it('increments quantity when adding existing item', () => {
    useCartStore.getState().addItem(mockProduct as any);
    useCartStore.getState().addItem(mockProduct as any);
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(2);
  });

  it('removes an item from the cart', () => {
    useCartStore.getState().addItem(mockProduct as any);
    useCartStore.getState().removeItem('1');
    const state = useCartStore.getState();
    expect(state.items).toHaveLength(0);
  });

  it('calculates total correctly', () => {
    useCartStore.getState().addItem(mockProduct as any, 2);
    expect(useCartStore.getState().getTotal()).toBe(2000);
  });
});
