import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const apiClient = {
  getFlights: async (searchParams: any) => {
    const { data, error } = await supabase
      .from('flights')
      .select('*')
      .eq('origin', searchParams.origin)
      .eq('destination', searchParams.destination)
      .eq('departure_date', searchParams.departureDate);

    if (error) throw error;
    return { data };
  }
};

export default apiClient;
