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

    const { imageUrl, description, cropType, symptomsDuration, location } = await req.json();

    console.log('Processing diagnosis for user:', user.id);

    // Check submission limits
    const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM
    const { data: submissionData, error: submissionError } = await supabaseClient
      .from('user_submissions')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', monthYear)
      .single();

    if (submissionError && submissionError.code !== 'PGRST116') {
      throw submissionError;
    }

    const currentCount = submissionData?.submission_count || 0;
    const maxSubmissions = submissionData?.max_submissions || 10;

    if (currentCount >= maxSubmissions) {
      return new Response(
        JSON.stringify({ 
          error: 'Monthly submission limit reached',
          remaining: 0
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Crop-specific knowledge base
    const cropKnowledge: Record<string, string> = {
      // Cereals
      "Maize (Corn)": "Common diseases: Northern Corn Leaf Blight, Gray Leaf Spot, Maize Streak Virus, Stalk Rot, Fall Armyworm damage. Key symptoms: lesions, streaking, wilting, ear rot.",
      "Rice": "Common diseases: Rice Blast, Bacterial Leaf Blight, Brown Spot, Sheath Blight, Tungro Virus. Key symptoms: lesions, yellowing, wilting, panicle damage.",
      "Wheat": "Common diseases: Rust (Yellow, Brown, Black), Powdery Mildew, Fusarium Head Blight, Septoria. Key symptoms: pustules, powdery coating, head scab.",
      "Sorghum": "Common diseases: Anthracnose, Grain Mold, Charcoal Rot, Downy Mildew. Key symptoms: leaf spots, discolored grain, lodging.",
      "Millet": "Common diseases: Downy Mildew, Blast, Ergot, Smut. Key symptoms: green ear, blast lesions, ergot bodies.",
      // Tubers
      "Cassava": "Common diseases: Cassava Mosaic Disease, Cassava Brown Streak, Bacterial Blight, Anthracnose. Key symptoms: mosaic patterns, brown streaks in roots, wilting.",
      "Sweet Potato": "Common diseases: Sweet Potato Virus Disease, Black Rot, Soft Rot, Weevil damage. Key symptoms: leaf distortion, black lesions, tunneling.",
      "Yam": "Common diseases: Yam Mosaic Virus, Anthracnose, Dry Rot, Nematode damage. Key symptoms: mosaic, die-back, tuber rot.",
      "Irish Potato": "Common diseases: Late Blight, Early Blight, Bacterial Wilt, Potato Virus Y. Key symptoms: water-soaked lesions, target spots, wilting.",
      "Taro (Cocoyam)": "Common diseases: Taro Leaf Blight, Pythium Rot, Dasheen Mosaic Virus. Key symptoms: leaf lesions, corm rot, mosaic.",
      // Legumes
      "Beans": "Common diseases: Angular Leaf Spot, Anthracnose, Bean Common Mosaic, Rust. Key symptoms: angular spots, sunken lesions, mosaic.",
      "Groundnuts (Peanuts)": "Common diseases: Early Leaf Spot, Late Leaf Spot, Rust, Aflatoxin contamination. Key symptoms: spots, defoliation, pod rot.",
      "Soybeans": "Common diseases: Soybean Rust, Frogeye Leaf Spot, Sudden Death Syndrome. Key symptoms: pustules, spots, interveinal chlorosis.",
    };

    const cropInfo = cropType && cropKnowledge[cropType] ? cropKnowledge[cropType] : "";

    // Prepare AI prompt
    const prompt = `You are an expert agricultural AI assistant specializing in food crop disease diagnosis, with deep expertise in cereals (maize, rice, wheat, sorghum, millet), tubers (cassava, sweet potato, yam, potato, taro), and legumes.

CROP BEING ANALYZED: ${cropType || "Not specified"}
${cropInfo ? `\nRELEVANT DISEASE KNOWLEDGE FOR THIS CROP:\n${cropInfo}` : ''}

SUBMITTED INFORMATION:
${imageUrl ? '- An image has been provided showing the affected crop' : '- No image provided'}
${description ? `- Farmer's description: ${description}` : '- No description provided'}
${symptomsDuration ? `- Symptoms duration: ${symptomsDuration}` : ''}
${location ? `- Climate region: ${location}` : ''}

INSTRUCTIONS:
1. Analyze the image and/or description carefully
2. Consider the specific crop type and common diseases affecting it
3. Factor in the climate region if provided
4. Provide practical, affordable treatment options suitable for smallholder farmers

Respond with a JSON object in this exact structure:
{
  "disease_name": "Name of the disease or issue identified",
  "confidence": "high/medium/low",
  "severity": "mild/moderate/severe",
  "description": "Clear explanation of the disease and how it affects ${cropType || 'the crop'}",
  "causes": ["List of factors that cause or spread this disease"],
  "symptoms": ["List of visible symptoms to look for"],
  "affected_parts": ["Which parts of the plant are affected: leaves/stems/roots/tubers/grain"],
  "treatment": {
    "immediate_actions": ["Urgent steps to take now to limit damage"],
    "chemical_treatment": ["Specific fungicides/pesticides with dosage and application method"],
    "organic_treatment": ["Natural alternatives like neem, ash, crop rotation"],
    "preventive_measures": ["Long-term strategies to prevent recurrence"]
  },
  "expected_yield_impact": "Estimated impact on yield if untreated vs treated",
  "prognosis": "Expected recovery timeline with proper treatment",
  "additional_questions": ["2-3 follow-up questions to refine the diagnosis"]
}

Be specific, practical, and consider that farmers may have limited resources. Recommend locally available treatments when possible.`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const messages: any[] = [
      { role: 'user', content: prompt }
    ];

    // Add image if provided
    if (imageUrl) {
      messages[0].content = [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } }
      ];
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI service rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service payment required. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const aiContent = aiData.choices[0].message.content;
    
    let diagnosisResult;
    try {
      // Try to parse as JSON
      diagnosisResult = JSON.parse(aiContent);
    } catch {
      // If not JSON, create structured response
      diagnosisResult = {
        disease_name: "Analysis Complete",
        confidence: "medium",
        severity: "unknown",
        description: aiContent,
        causes: [],
        symptoms: [],
        affected_parts: [],
        treatment: {
          immediate_actions: [],
          chemical_treatment: [],
          organic_treatment: [],
          preventive_measures: []
        },
        expected_yield_impact: "Unable to estimate",
        prognosis: "Please consult with a local agricultural expert for detailed treatment plan.",
        additional_questions: []
      };
    }

    // Save diagnosis to database
    const { data: diagnosisData, error: diagnosisInsertError } = await supabaseClient
      .from('diagnoses')
      .insert({
        user_id: user.id,
        image_url: imageUrl,
        description: description,
        diagnosis_result: diagnosisResult,
        crop_type: cropType,
        symptoms_duration: symptomsDuration,
        location: location,
        status: 'completed'
      })
      .select()
      .single();

    if (diagnosisInsertError) {
      throw diagnosisInsertError;
    }

    // Update submission count
    if (submissionData) {
      await supabaseClient
        .from('user_submissions')
        .update({ submission_count: currentCount + 1 })
        .eq('id', submissionData.id);
    } else {
      await supabaseClient
        .from('user_submissions')
        .insert({
          user_id: user.id,
          month_year: monthYear,
          submission_count: 1,
          max_submissions: 10
        });
    }

    const remaining = maxSubmissions - (currentCount + 1);

    return new Response(
      JSON.stringify({
        success: true,
        diagnosis: diagnosisResult,
        diagnosisId: diagnosisData.id,
        remaining: remaining
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in diagnose-crop function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});