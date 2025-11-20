import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    const { data: submissionData, error } = await supabaseClient
      .from('user_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const currentCount = submissionData?.submission_count || 0;
    const maxSubmissions = submissionData?.max_submissions || 10;
    const remaining = maxSubmissions - currentCount;

    return new Response(
      JSON.stringify({
        used: currentCount,
        remaining: remaining,
        max: maxSubmissions
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-submission-status function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});