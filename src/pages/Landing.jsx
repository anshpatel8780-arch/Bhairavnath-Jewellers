import { Star, ShieldCheck, MapPin, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const categories = [
    { name: 'Gold Rings', image: '/gold_rings.png' },
    { name: 'Bangles', image: '/bangles.png' },
    { name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },
    { name: 'Mangalsutra', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=600&auto=format&fit=crop' },
    { name: 'Bridal Sets', image: 'https://images.unsplash.com/photo-1599643478514-4a72045328ce?q=80&w=600&auto=format&fit=crop' },
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-gray-200 selection:bg-gold selection:text-black">
      
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img src="/hero_bg.png" alt="Jewellery Display" className="w-full h-full object-cover opacity-40 animate-ken-burns scale-105 transform" />
          {/* Stronger left gradient for perfect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent"></div>
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505]/60"></div>
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20 w-full z-10 pt-10">
          <div className="max-w-2xl animate-fade-in-up">
            
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <div className="h-px w-8 bg-gold/50"></div>
              <span className="text-[10px] font-semibold tracking-[0.3em] text-gold uppercase">4.8 Stars Trust</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-serif text-white mb-6 leading-[1.05]">
              <span className="font-medium tracking-tight">Bhairavnath</span><br/>
              <span className="text-gold font-light italic text-4xl md:text-6xl lg:text-[70px]">Jewellers</span>
            </h1>
            
            <p className="text-base md:text-lg text-gray-400 mb-12 max-w-[480px] font-light leading-relaxed tracking-wide">
              Elevating your elegance with timeless, handcrafted gold designs. A legacy of absolute trust and uncompromising purity.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <a href="tel:+918000223413" className="inline-flex justify-center items-center px-10 py-4 bg-gold text-black font-bold tracking-[0.2em] uppercase text-[10px] rounded-sm transition-all duration-500 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                <Phone className="w-3.5 h-3.5 mr-3" />
                Call Now
              </a>
              <a href="https://wa.me/918000223413" target="_blank" rel="noreferrer" className="inline-flex justify-center items-center px-10 py-4 bg-transparent border border-gray-600 text-gray-300 hover:border-[#25D366] hover:text-[#25D366] hover:shadow-[0_0_20px_rgba(37,211,102,0.15)] font-bold tracking-[0.2em] uppercase text-[10px] rounded-sm transition-all duration-500">
                <MessageCircle className="w-3.5 h-3.5 mr-3" />
                WhatsApp
              </a>
            </div>
            
          </div>
        </div>
      </section>

      {/* About / Legacy Section */}
      <section id="about" className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Image Side */}
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 border border-gold/20 translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700"></div>
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-[#111] z-10">
                <img 
                  src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop" 
                  alt="Craftsmanship" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Text Side */}
            <div className="relative z-20 lg:pl-10 order-1 lg:order-2">
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-6 block flex items-center">
                <div className="w-8 h-[1px] bg-gold mr-4"></div>
                Our Heritage
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 font-light leading-[1.1]">
                A Legacy of <br/><span className="text-gold italic font-medium">Trust & Purity</span>
              </h2>
              
              <div className="space-y-6 text-gray-400 font-light leading-relaxed md:text-lg">
                <p>
                  Welcome to Bhairavnath Jewellers, your premier destination for exquisite gold jewellery in Amroli, Surat. 
                </p>
                <p>
                  We pride ourselves on a legacy built on absolute trust, uncompromising quality, and unparalleled customer satisfaction. 
                  Every piece in our collection is crafted to perfection by master artisans, ensuring you receive nothing but the finest ornaments to celebrate life's most precious moments.
                </p>
              </div>
              
              <div className="mt-14 flex items-center space-x-12">
                <div>
                  <h4 className="text-3xl md:text-4xl font-serif text-white mb-1">25+</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Years of Trust</p>
                </div>
                <div className="w-[1px] h-12 bg-gray-800"></div>
                <div>
                  <h4 className="text-3xl md:text-4xl font-serif text-white mb-1">100%</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">BIS Hallmark</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Collections Preview Section */}
      <section id="products" className="py-32 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">Curated Pieces</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white font-light">The Collections</h2>
            </div>
            <Link to="/collections" className="group mt-6 md:mt-0 inline-flex items-center text-[10px] uppercase tracking-[0.2em] font-bold text-gold hover:text-white transition-colors">
              View All Pieces
              <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {categories.slice(0, 3).map((category, index) => (
              <Link to="/collections" key={index} className="group cursor-pointer block">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a] rounded-sm">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-serif text-white mb-2">{category.name}</h3>
                    <div className="w-8 h-[1px] bg-gold transition-all duration-500 group-hover:w-16"></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Elements Section */}
      <section id="trust" className="py-24 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif text-white mb-4 tracking-wide">100% BIS Hallmark</h3>
              <p className="text-gray-400 font-light leading-relaxed max-w-sm">
                Certified Gold Jewellery. We guarantee the absolute purity and authenticity of every ornament that leaves our store.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border border-gold/30 flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif text-white mb-4 tracking-wide">Trusted Excellence</h3>
              <p className="text-gray-400 font-light leading-relaxed max-w-sm">
                A true testament to our unwavering commitment to premium quality and exceptional customer service in Surat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 bg-[#050505]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            {/* Contact Info */}
            <div className="order-2 lg:order-1">
              <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-4 block">Visit The Boutique</span>
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 font-light">Experience <br/>True Luxury</h2>
              
              <div className="space-y-10">
                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-gold transition-colors shrink-0">
                    <MapPin className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="ml-6 pt-1">
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Location</h4>
                    <p className="text-gray-300 font-light leading-relaxed">
                      New Kosad Rd, Vijay Nagar,<br/>
                      Rang Nagar, Amroli,<br/>
                      Surat, Gujarat 394107
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-gold transition-colors shrink-0">
                    <Phone className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="ml-6 pt-1">
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Private Appointment</h4>
                    <a href="tel:+918000223413" className="text-xl font-serif text-white hover:text-gold transition-colors block">
                      +91 8000223413
                    </a>
                  </div>
                </div>

                <div className="flex items-start group">
                  <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center group-hover:border-gold transition-colors shrink-0">
                    <Star className="w-5 h-5 text-gold" strokeWidth={1.5} />
                  </div>
                  <div className="ml-6 pt-1">
                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Boutique Hours</h4>
                    <p className="text-gray-300 font-light">Monday – Sunday<br/>9:00 AM – 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="order-1 lg:order-2 h-[500px] w-full rounded-sm overflow-hidden shadow-2xl">
              <iframe 
                src="https://maps.google.com/maps?q=BHAIRAVNATH+JEWELLERS,+New+Kosad+Rd,+Vijay+Nagar,+Rang+Nagar,+Amroli,+Surat,+Gujarat+394107&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Bhairavnath Jewellers Location"
              ></iframe>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
