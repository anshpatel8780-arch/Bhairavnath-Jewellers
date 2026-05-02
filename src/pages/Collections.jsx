import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MessageCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bangles', 'Bridal Sets'];

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoading(false);
  };

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleWhatsApp = (productName) => {
    const message = encodeURIComponent(`Hi, I am interested in the ${productName} from your catalog.`);
    window.open(`https://wa.me/918000223413?text=${message}`, '_blank');
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-12 pb-24">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">The Vault</span>
        <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4">Our Collections</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
          Explore our exclusive range of timeless gold jewelry. Handcrafted for every profound occasion.
        </p>
        <div className="w-24 h-[1px] bg-gold mx-auto mt-8"></div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-8 py-2.5 rounded-sm text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                  : 'bg-[#0a0a0a] border border-gray-800 text-gray-400 hover:border-gold hover:text-gold'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        {loading ? (
          <div className="text-center py-20 text-xl font-serif text-gray-500">
            Unlocking the vault...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#0a0a0a] rounded-sm border border-white/5">
            <h3 className="text-2xl font-serif text-gray-400 mb-2 font-light">No pieces found</h3>
            <p className="text-gray-500 font-light">Check back later for new arrivals in this exclusive category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group bg-[#0a0a0a] rounded-sm overflow-hidden border border-white/5 flex flex-col h-full hover:border-gold/30 transition-all duration-500">
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 opacity-80 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-gold/20 px-3 py-1.5 rounded-sm text-[10px] font-bold text-gold tracking-widest uppercase">
                    {product.category}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col flex-grow relative">
                  <div className="absolute top-0 left-6 w-8 h-[1px] bg-gold/50 group-hover:w-16 transition-all duration-500"></div>
                  <h3 className="text-xl font-serif text-white mb-2 line-clamp-2 mt-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-medium text-gold mb-3 tracking-wider">
                    ₹{product.price?.toLocaleString('en-IN') || 0}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-400 mb-8 line-clamp-2 flex-grow font-light">
                      {product.description}
                    </p>
                  )}
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => handleWhatsApp(product.name)}
                    className="mt-auto w-full flex items-center justify-center space-x-2 bg-transparent border border-green-500/30 hover:border-green-500 hover:bg-green-500 text-green-400 hover:text-black py-3 px-4 rounded-sm font-bold uppercase tracking-widest text-[11px] transition-all duration-500"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
