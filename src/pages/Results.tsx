import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Leaf, ArrowLeft, Loader2, Bug, Shield, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DiagnosisResult {
  disease_name: string;
  confidence: string;
  severity?: string;
  description: string;
  causes: string[];
  symptoms: string[];
  affected_parts?: string[];
  treatment: {
    immediate_actions: string[];
    chemical_treatment: string[];
    organic_treatment: string[];
    preventive_measures: string[];
  };
  expected_yield_impact?: string;
  prognosis: string;
  additional_questions: string[];
}

interface Diagnosis {
  id: string;
  crop_type: string;
  diagnosis_result: DiagnosisResult;
  created_at: string;
  image_url?: string;
}

const Results = () => {
  const { diagnosisId } = useParams();
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (diagnosisId) {
      fetchDiagnosis();
    }
  }, [diagnosisId]);

  const fetchDiagnosis = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('id', diagnosisId)
        .single();

      if (error) throw error;
      setDiagnosis(data as unknown as Diagnosis);
    } catch (err) {
      console.error('Error fetching diagnosis:', err);
      setError('Failed to load diagnosis results');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidencePercentage = (confidence: string) => {
    switch (confidence) {
      case 'high': return 90;
      case 'medium': return 70;
      case 'low': return 50;
      default: return 70;
    }
  };

  const getSeverityVariant = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe': return 'destructive';
      case 'moderate': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !diagnosis) {
    return (
      <div className="min-h-screen bg-gradient-subtle py-12">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Diagnosis Not Found</h1>
          <p className="mt-2 text-muted-foreground">{error || 'The requested diagnosis could not be found.'}</p>
          <Button asChild className="mt-4">
            <Link to="/diagnose">New Diagnosis</Link>
          </Button>
        </div>
      </div>
    );
  }

  const result = diagnosis.diagnosis_result;
  const confidencePercent = getConfidencePercentage(result.confidence);

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/diagnose">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Diagnosis
            </Link>
          </Button>

          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Diagnosis Results
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered analysis for {diagnosis.crop_type}
            </p>
          </div>

          {/* Diagnosis Summary */}
          <Card className="mb-6 shadow-medium">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2 text-2xl">{result.disease_name}</CardTitle>
                  <CardDescription>Detected in {diagnosis.crop_type}</CardDescription>
                </div>
                {result.severity && (
                  <Badge variant={getSeverityVariant(result.severity)} className="text-sm">
                    {result.severity} Severity
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence Level</span>
                    <span className="font-semibold text-primary capitalize">{result.confidence} ({confidencePercent}%)</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-smooth"
                      style={{ width: `${confidencePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-foreground">{result.description}</p>

              {result.affected_parts && result.affected_parts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Affected parts:</span>
                  {result.affected_parts.map((part, idx) => (
                    <Badge key={idx} variant="outline">{part}</Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Symptoms & Causes */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            {result.symptoms.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Bug className="h-5 w-5 text-destructive" />
                    Symptoms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.symptoms.map((symptom, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-destructive" />
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.causes.length > 0 && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="h-5 w-5 text-accent" />
                    Causes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.causes.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                        {cause}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Treatment Recommendations */}
          <Card className="mb-6 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Treatment Recommendations
              </CardTitle>
              <CardDescription>Follow these steps to manage the disease</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.treatment.immediate_actions.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-destructive">⚡ Immediate Actions</h4>
                  <ul className="space-y-2">
                    {result.treatment.immediate_actions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                        <span className="text-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.treatment.chemical_treatment.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-primary">🧪 Chemical Treatment</h4>
                  <ul className="space-y-2">
                    {result.treatment.chemical_treatment.map((treatment, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <span className="text-foreground">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.treatment.organic_treatment.length > 0 && (
                <div>
                  <h4 className="mb-3 font-semibold text-green-600">🌿 Organic Treatment</h4>
                  <ul className="space-y-2">
                    {result.treatment.organic_treatment.map((treatment, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-foreground">{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.treatment.preventive_measures.length > 0 && (
                <div>
                  <h4 className="mb-3 flex items-center gap-2 font-semibold">
                    <Shield className="h-4 w-4" />
                    Preventive Measures
                  </h4>
                  <ul className="space-y-2">
                    {result.treatment.preventive_measures.map((measure, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <span className="text-foreground">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Prognosis & Yield Impact */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">Prognosis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{result.prognosis}</p>
              </CardContent>
            </Card>

            {result.expected_yield_impact && (
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingDown className="h-5 w-5 text-accent" />
                    Expected Yield Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground">{result.expected_yield_impact}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Important Note */}
          <Card className="mb-6 border-accent/50 bg-accent/5 shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Important Note</p>
                  <p className="text-muted-foreground">
                    This AI diagnosis is for guidance only. Always consult with a local agricultural extension officer or expert for severe cases. Early intervention is key to preventing crop loss.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button asChild>
              <Link to="/diagnose">New Diagnosis</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/account">View History</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
