export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-serif text-gold mb-4">Bhairavnath Jewellers</h3>
            <p className="text-gray-400">Trusted Gold Jewellery Shop in Amroli, Surat.</p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gold mb-4">Contact</h4>
            <p className="text-gray-400">New Kosad Rd, Vijay Nagar</p>
            <p className="text-gray-400">Amroli, Surat, Gujarat 394107</p>
            <p className="text-gray-400 mt-2">+91 8000223413</p>
          </div>
          <div>
            <h4 className="text-lg font-medium text-gold mb-4">Hours</h4>
            <p className="text-gray-400">Open All Days</p>
            <p className="text-gray-400 mt-2">9:00 AM – 9:00 PM</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Bhairavnath Jewellers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
