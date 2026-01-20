import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/ssr-client';

export default function FavoriteButton({ centerId }: { centerId: number }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchInitialStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('center_id', centerId)
        .single();

      setIsFavorited(!!data);
      setLoading(false);
    };

    fetchInitialStatus();
  }, [centerId, supabase]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to save favorites.");
      return;
    }

    const previousState = isFavorited;
    setIsFavorited(!previousState); // flip UI immediately

    if (previousState) {
      // remove favorite
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('center_id', centerId);
      
      if (error) {
        setIsFavorited(previousState); // rollback on error
        console.error("Failed to remove favorite:", error.message);
      }
    } else {
      // add favorite
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, center_id: centerId });
      
      if (error) {
        setIsFavorited(previousState); 
        console.error("Failed to add favorite:", error.message);
      }
    }
  };

  if (loading) return <div className="w-8 h-8 bg-stone-100 animate-pulse rounded-full" />;

  return (
    <button 
      onClick={handleToggle}
      className="group relative flex items-center justify-center p-2 transition-transform active:scale-90"
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {/* background glow */}
      <div className={`absolute inset-0 rounded-full transition-colors duration-300 ${isFavorited ? 'bg-teal-50/50' : 'group-hover:bg-stone-100'}`} />
      
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isFavorited ? "#3d9194" : "none"} 
        stroke={isFavorited ? "#3d9194" : "currentColor"} 
        className="relative w-7 h-7 stroke-2 transition-all duration-300 ease-out"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
        />
      </svg>
    </button>
  );
}