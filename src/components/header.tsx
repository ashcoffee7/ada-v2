import Image from "next/image";
import Link from 'next/link';

export default function Header() {
  const headers = [
    { name: 'About Us', href: '/about-us' },
    { name: 'Location Finder', href: '/locations' },
    { name: 'Resources', href: '/resources' },
    { name: 'Contact', href: '/contact' },
    { name: 'Your Account', href: '/login'}
  ]

  return (
    <header 
      key="main-header" 
      className="sticky top-0 z-50 w-full bg-[#fffbea] animate-header-fade">
      <div className={"flex items-center h-24 sm:h-32 px-6 md:px-12 w-full max-w-full justify-between"}>
        
        <div className="flex items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity cursor-pointer">
          <div className="flex-shrink-0">
            <Image 
              src="/images/logo.png" 
              alt="logo" 
              width={400} 
              height={400}
              className="!w-12 !h-12 sm:!w-16 !h-16 -translate-y-[4px] object-contain"
              priority 
            />
          </div>
        </Link>
          <h3 className="font-thin font-montserrat text-3xl text-[#3d9194] leading-none tracking-tighter ml-2">
            ada.
          </h3>
        </div>

        <nav className="flex items-center gap-4 sm:gap-8 md:gap-12">
          {headers.map((header) => (
            <Link
              key={header.name}
              href={header.href}
              className="font-inter px-4 py-2 hover:text-white hover:bg-[#3d9194] text-[#3d9194] rounded-full transition-all whitespace-nowrap text-sm sm:text-base duration-300"
            >
              {header.name}    
            </Link>    
          ))} 
        </nav>
      </div>
    </header>
  );
}