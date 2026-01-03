import Image from "next/image";
export default function HomePage() {
  return (
    <section className="w-full min-h-screen bg-[#fffbea] flex items-start justify-center py-20 px-6">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 animate-header">
        
        {/* LEFT SIDE: Text Content */}
        <div className="flex flex-col items-start text-left md:w-1/2 space-y-6 font-montserrat">
          <div className="space-y-2">
            <p className="text-[#3d9194] font-semibold tracking-wide uppercase text-sm">
              Finding low-cost, nearby health resources for you.
            </p>
            <h1 className="text-[#3d9194] text-4xl md:text-6xl font-bold tracking-tighter leading-tight">Because everyone deserves access to healthcare.
            </h1>
          </div>

          <p className="text-[#3d9194]/80 text-lg md:text-xl leading-relaxed max-w-xl">
            At Ada, we believe that healthcare is a human right. We make it 
            as easy as possible for you to find affordable healthcare near you. 
            Customize your search by location, services, and insurance.
          </p>
          
          {/* Optional: Add a call to action button here */}
          <button className="bg-[#3d9194] text-[#fffbea] px-8 py-3 rounded-full font-inter font-medium hover:bg-[#2d6e70] transition-colors">
            Get Started
          </button>
        </div>

        {/* RIGHT SIDE: Image Container */}
        <div className="relative w-full md:w-1/2 h-[300px] sm:h-[450px]">
          <Image 
            src="/images/home.svg" 
            alt="Healthcare illustration" 
            fill
            className="object-contain"
            priority 
          />
        </div>

      </div>
    </section>
  );
}