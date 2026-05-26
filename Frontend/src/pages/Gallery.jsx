import React, { useState } from 'react';
import AppLayout from '../components/app/AppLayout';
import { Search } from 'lucide-react';

const galleryItems = [
  { id: 1, title: 'Modern Bathroom Suite', category: 'Bathroom', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&h=280&fit=crop' },
  { id: 2, title: 'Farmhouse Kitchen', category: 'Kitchen', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=280&fit=crop' },
  { id: 3, title: 'Luxe Bedroom', category: 'Bedroom', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=280&fit=crop' },
  { id: 4, title: 'Living Room', category: 'Living', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=280&fit=crop' },
  { id: 5, title: 'Open Kitchen', category: 'Kitchen', img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=280&fit=crop' },
  { id: 6, title: 'Minimalist Ensuite', category: 'Bathroom', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=280&fit=crop' },
  { id: 7, title: 'Scandinavian Bedroom', category: 'Bedroom', img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=280&fit=crop' },
  { id: 8, title: 'Dining Room', category: 'Dining', img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=280&fit=crop' },
];

const categories = ['All', 'Bathroom', 'Kitchen', 'Bedroom', 'Living', 'Dining'];

export default function Gallery() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  const filtered = galleryItems.filter(i =>
    (cat === 'All' || i.category === cat) &&
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div style={{ background: '#f5f0ee', minHeight: '100%', fontFamily: '"DM Sans", sans-serif' }}>
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="font-bold text-xl" style={{ color: '#222' }}>Gallery</h1>
            <div className="flex items-center gap-2 rounded px-3 py-2 bg-white" style={{ border: '1px solid rgba(0,0,0,0.12)' }}>
              <Search size={14} style={{ color: '#999' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="outline-none text-sm"
                style={{ background: 'transparent', color: '#333', width: 160 }}
                placeholder="Search gallery"
              />
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: cat === c ? '#ab00ff' : '#fff',
                  color: cat === c ? '#fff' : '#666',
                  border: `1px solid ${cat === c ? '#ab00ff' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="rounded-xl overflow-hidden cursor-pointer group transition-all hover:shadow-md" style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div className="overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-40 object-cover transition-transform group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <div className="font-medium text-sm" style={{ color: '#333' }}>{item.title}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#999' }}>{item.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}