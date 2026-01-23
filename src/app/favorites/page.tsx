import { createClient } from '@/lib/supabase/server';
import LocationCard from '@/components/location-card';
import { redirect } from 'next/navigation';

export default async function FavoritesPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: favorites, error } = await supabase
    .from('user_favorites')
    .select(`
      all_clinics (
        ID,
        name,
        address,
        image_address
      )
    `)
    .eq('user_id', user.id);

  if (error) return <div className="p-10">Error loading favorites: {error.message}</div>;

  return (
    <main className="p-10 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-[#3d9194]">Your Saved Clinics</h1>
      
      <div className="flex flex-wrap gap-6">
        {favorites?.map((fav: any) => (
          // This card is a Client Component, and that is okay!
          <LocationCard key={fav.all_clinics.ID} center={fav.all_clinics} />
        ))}
      </div>
    </main>
  );
}