// src/app/location-finder/page.tsx
'use client';
import { useState, useEffect } from 'react';
import LocationCard from '@/components/location-card';
import SkeletonCard from "@/components/skeleton-card";

// Define the interface for your center data to avoid 'any'
interface Center {
  id: string;
  name: string;
  address: string;
  image_address: string;
  [key: string]: any; 
}

export default function LocationFinder() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [address, setAddress] = useState('');
  const [k, setK] = useState(3);
  const [error, setError] = useState(''); // Fixed: replaced unused '_'
  const [availableInsurances, setAvailableInsurances] = useState<string[]>([]);
  const [insurances, setInsurances] = useState<string[]>([]);
  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [serviceQuery, setServiceQuery] = useState('');
  const [insuranceQuery, setInsuranceQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // display all
  useEffect(() => {
  setIsLoading(true);

  Promise.all([
    fetch('/api/ada/all-centers').then(res => res.json()),
    fetch('/api/ada/all-services').then(res => res.json()),
    fetch('/api/ada/all-insurances').then(res => res.json())
  ])
  .then(([centersData, servicesData, insurancesData]) => {
    setCenters(centersData);
    setAvailableServices(servicesData.map((s: any) => s.service_name));
    setAvailableInsurances(insurancesData.map((i: any) => i.insurance_name));
  })
  .catch((err) => {
    console.error("Initialization error:", err);
    setError("Failed to load data. Please refresh.");
  })
  .finally(() => {
    setIsLoading(false); 
  });
}, []);

  // return top locations
  const handleSearch = async () => {
    if (!address) {
      setError("You must provide an origin.");
      return;
    }
    setError('');
    setIsLoading(true);

    let url = `/api/ada/top-loc?address=${encodeURIComponent(address)}&k=${k}`;
    insurances.forEach(ins => url += `&insurances=${encodeURIComponent(ins)}`);
    services.forEach(ser => url += `&services=${encodeURIComponent(ser)}`);
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      setCenters(data);
    } catch (err) {
      setError("Failed to search locations.");
    }
    finally {
      setIsLoading(false);
    }
  };

  // toggle items
  const toggleFilter = (list: string[], setList: (val: string[]) => void, value: string) => {
    if (list.includes(value)) {
      setList(list.filter(item => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden animate-header-fade">
      <div className="my-10 mx-auto text-center font-inter max-w-4xl px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 bg-white p-6 rounded-2xl shadow-sm">
          <input 
            type="text" 
            placeholder="Enter address..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-full md:w-64"
          />

          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="bg-gray-100 text-blue-900 px-4 py-2 rounded-lg border border-blue-900 hover:bg-blue-50 transition-colors"
          >
            More Filters {(insurances.length + services.length) > 0 && `(${insurances.length + services.length})`}
          </button>

          <button 
            onClick={handleSearch}
            className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all font-bold"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
      </div>

      {/* Background Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)} 
        />
      )}

      {/* SIDE DRAWER PANEL */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out p-8 overflow-y-auto ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          <button onClick={() => setIsDrawerOpen(false)} className="text-gray-500 hover:text-black">✕</button>
        </div>

        {/* Services Section */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-blue-900">Services</h3>
            <input 
              type="text"
              placeholder="Search services..."
              className="text-sm p-1 border rounded w-1/2 focus:outline-blue-900"
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto p-1">
            {availableServices
              .filter(s => s.toLowerCase().includes(serviceQuery.toLowerCase()))
              .map(service => (
                <button
                  key={service}
                  onClick={() => toggleFilter(services, setServices, service)}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                      services.includes(service) ? 'bg-blue-900 text-white' : 'bg-stone-100 text-gray-600 border-transparent'
                  }`}
                >
                  {service}
                </button>
            ))}
            {availableServices.filter(s => s.toLowerCase().includes(serviceQuery.toLowerCase())).length === 0 && (
              <p className="text-gray-400 text-sm italic">No matching services...</p>
            )}
          </div>
        </section>

        {/* Insurance Section */}
        <section className="mb-10">
          <div className="flex justify-between items-end mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-blue-900">Insurance</h3>
            <input 
              type="text"
              placeholder="Search insurance..."
              className="text-sm p-1 border rounded w-1/2 focus:outline-blue-900"
              value={insuranceQuery}
              onChange={(e) => setInsuranceQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto p-1">
            {availableInsurances
              .filter(ins => ins.toLowerCase().includes(insuranceQuery.toLowerCase()))
              .map(insurance => (
                <button
                  key={insurance}
                  onClick={() => toggleFilter(insurances, setInsurances, insurance)}
                  className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                      insurances.includes(insurance) ? 'bg-blue-900 text-white' : 'bg-stone-100 text-gray-600 border-transparent'
                  }`}
                >
                  {insurance}
                </button>
            ))}
          </div>
        </section>

        <div className="sticky bottom-0 bg-white pt-4 pb-2">
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Apply Filters
            </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex flex-wrap justify-center gap-8 px-5 pb-10">
        {isLoading ? (
          // Show 3 skeleton cards while loading
          Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        ) : centers.length > 0 ? (
          centers.map((center, index) => (
            <LocationCard key={index} center={center} />
          ))
        ) : (
          <p className="text-gray-500 mt-10 italic">No locations found. Try adjusting your filters.</p>
        )}
      </div>
    </main>
  );
}