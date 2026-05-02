import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bangles'];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const navigate = useNavigate();

  // Product State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
      } else if (session.user.email !== 'anshpatel8780@gmail.com') {
        // If someone logs in but is NOT the specific admin email
        await supabase.auth.signOut();
        navigate('/login');
      } else {
        setUser(session.user);
        fetchProducts();
      }
      setLoadingAuth(false);
    };
    checkUser();
  }, [navigate]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
    setLoadingProducts(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!imageFile) {
      setError('Please select an image file.');
      return;
    }

    setUploading(true);

    try {
      // 1. Upload Image to Supabase Storage
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      // 3. Insert Product into Database
      const newProduct = {
        name,
        description,
        price: parseFloat(price) || 0,
        category,
        image_url: publicUrl,
      };

      const { error: dbError } = await supabase
        .from('products')
        .insert([newProduct]);

      if (dbError) throw dbError;

      // 4. Send Email Broadcast via Brevo
      try {
        const { data: profiles } = await supabase.from('profiles').select('email');
        if (profiles && profiles.length > 0) {
          const bccList = profiles.map(p => ({ email: p.email }));
          
          await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'api-key': import.meta.env.VITE_BREVO_API_KEY,
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              sender: { name: "Bhairavnath Jewellers", email: import.meta.env.VITE_EMAIL_FROM },
              to: [{ email: import.meta.env.VITE_EMAIL_FROM, name: "Admin" }], // primary recipient, others BCC'd
              bcc: bccList,
              subject: "New Arrival: " + newProduct.name,
              htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #111111; color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <div style="background-color: #D4AF37; padding: 30px; text-align: center;">
                    <h1 style="color: #111111; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">Bhairavnath Jewellers</h1>
                  </div>
                  <div style="padding: 40px 30px; text-align: center;">
                    <h2 style="margin-top: 0; font-size: 20px; color: #D4AF37;">New Arrival!</h2>
                    <h1 style="font-size: 28px; margin-bottom: 20px;">${newProduct.name}</h1>
                    <img src="${newProduct.image_url}" alt="${newProduct.name}" style="max-width: 100%; border-radius: 8px; margin-bottom: 20px;" />
                    <p style="color: #cccccc; line-height: 1.6;">${newProduct.description}</p>
                    <h2 style="color: #D4AF37; margin: 20px 0;">₹${newProduct.price.toLocaleString('en-IN')}</h2>
                    <p style="margin-top: 30px;">
                      <a href="https://wa.me/918000223413?text=Hi, I am interested in the ${encodeURIComponent(newProduct.name)}" style="background-color: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-weight: bold; display: inline-block;">Inquire on WhatsApp</a>
                    </p>
                  </div>
                </div>
              `
            })
          });
        }
      } catch (emailErr) {
        console.error("Broadcast failed:", emailErr);
      }

      setSuccess('Product added successfully and announcement sent!');
      // Reset Form
      setName('');
      setDescription('');
      setPrice('');
      setCategory(CATEGORIES[0]);
      setImageFile(null);
      // Refresh List
      fetchProducts();
      
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      // Delete from DB
      const { error: dbError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (dbError) throw dbError;
      
      // Attempt to delete image from storage (optional but good practice)
      // We extract the filename from the end of the URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      if (fileName) {
        await supabase.storage.from('product-images').remove([fileName]);
      }
      
      fetchProducts();
    } catch (err) {
      alert('Error deleting product: ' + err.message);
    }
  };

  if (loadingAuth) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505]">
      <div className="text-gold text-[11px] uppercase tracking-[0.4em] animate-pulse">Authenticating...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-6">
          <div>
            <span className="text-gold text-[10px] uppercase tracking-[0.4em] font-bold block mb-1">Bhairavnath Jewellers</span>
            <h1 className="text-3xl font-serif text-white font-light">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 border border-gray-700 text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-red-400 hover:border-red-400 rounded-sm transition-all duration-300"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ADD PRODUCT FORM */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-sm p-6">
              <h2 className="text-lg font-serif text-white font-light mb-1">Add New Product</h2>
              <div className="w-8 h-[1px] bg-gold mb-6"></div>

              {error && <div className="bg-red-950/20 border-l-2 border-red-500 text-red-400 p-3 rounded-sm text-[10px] uppercase tracking-widest font-bold mb-4">{error}</div>}
              {success && <div className="bg-gold/5 border-l-2 border-gold text-gold p-3 rounded-sm text-[10px] uppercase tracking-widest font-bold mb-4">{success}</div>}

              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Product Name</label>
                  <input
                    type="text" required
                    className="w-full px-4 py-3 bg-black border border-gray-800 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm placeholder-gray-700 transition-colors"
                    placeholder="e.g. Gold Bangles Set"
                    value={name} onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Price (₹)</label>
                  <input
                    type="number" required min="0"
                    className="w-full px-4 py-3 bg-black border border-gray-800 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm placeholder-gray-700 transition-colors"
                    placeholder="e.g. 25000"
                    value={price} onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Category</label>
                  <select
                    className="w-full px-4 py-3 bg-black border border-gray-800 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm transition-colors"
                    value={category} onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-black">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Description</label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 bg-black border border-gray-800 text-white rounded-sm focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold text-sm placeholder-gray-700 transition-colors resize-none"
                    placeholder="Product description..."
                    value={description} onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Product Image</label>
                  <input
                    type="file" accept="image/*" required
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-gold file:text-black hover:file:bg-gold/80 transition-colors cursor-pointer"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>

                <button
                  type="submit" disabled={uploading}
                  className="w-full mt-2 py-3.5 px-4 text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm text-black bg-gold hover:bg-gold/80 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none transition-all duration-300 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Add Product'}
                </button>
              </form>
            </div>
          </div>

          {/* PRODUCT LIST */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-sm p-6">
              <h2 className="text-lg font-serif text-white font-light mb-1">Current Catalog</h2>
              <div className="w-8 h-[1px] bg-gold mb-6"></div>

              {loadingProducts ? (
                <div className="text-center py-16 text-gray-600 text-[10px] uppercase tracking-widest animate-pulse">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="text-center py-16 text-gray-600 border border-dashed border-gray-800 rounded-sm">
                  <p className="text-[10px] uppercase tracking-widest">No products found.</p>
                  <p className="text-[10px] uppercase tracking-widest text-gold mt-1">Add your first item!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex space-x-4 border border-white/5 p-4 rounded-sm hover:border-gold/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300 bg-black/30">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-sm border border-white/5">
                        <img
                          src={product.image_url} alt={product.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <h3 className="text-sm font-medium text-white truncate">{product.name}</h3>
                          <p className="text-[9px] text-gold font-bold mt-1 uppercase tracking-widest">{product.category}</p>
                          <p className="text-xs text-gray-400 mt-1">₹{Number(product.price).toLocaleString('en-IN')}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.image_url)}
                          className="text-[9px] text-gray-600 hover:text-red-400 self-start mt-2 font-bold uppercase tracking-widest transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


