import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Leaf, ArrowLeft } from "lucide-react";
import leafComparison from "@/assets/leaf-comparison.jpg";

const Results = () => {
  // Mock diagnosis data
  const diagnosis = {
    disease: "Early Blight",
    confidence: 94,
    severity: "Moderate",
    affectedCrop: "Tomato",
  };

  const treatments = [
    "Remove and destroy affected leaves immediately",
    "Apply copper-based fungicide every 7-10 days",
    "Improve air circulation around plants",
    "Avoid overhead watering; water at the base",
    "Apply mulch to prevent soil splash",
  ];

  const followUpQuestions = [
    "What type of crop is affected?",
    "How long have you noticed these symptoms?",
    "What is your location/region?",
    "Have you applied any treatments yet?",
  ];

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
              AI-powered analysis of your crop condition
            </p>
          </div>

          {/* Diagnosis Summary */}
          <Card className="mb-6 shadow-medium">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="mb-2 text-2xl">{diagnosis.disease}</CardTitle>
                  <CardDescription>Detected in {diagnosis.affectedCrop}</CardDescription>
                </div>
                <Badge
                  variant={diagnosis.severity === "High" ? "destructive" : "secondary"}
                  className="text-sm"
                >
                  {diagnosis.severity} Severity
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Confidence Level</span>
                    <span className="font-semibold text-primary">{diagnosis.confidence}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-smooth"
                      style={{ width: `${diagnosis.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg">
                <img
                  src={leafComparison}
                  alt="Diagnosed crop condition"
                  className="h-64 w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Treatment Recommendations */}
          <Card className="mb-6 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Treatment Recommendations
              </CardTitle>
              <CardDescription>Follow these steps to manage the disease</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {treatments.map((treatment, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-foreground">{treatment}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Important Note</p>
                    <p className="text-muted-foreground">
                      Always consult with a local agricultural expert for severe infestations.
                      Early intervention is key to preventing crop loss.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up Questions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                Help us provide more accurate recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {followUpQuestions.map((question, index) => (
                  <div key={index} className="rounded-lg border border-border p-4">
                    <p className="mb-2 font-medium text-foreground">{question}</p>
                    <input
                      type="text"
                      placeholder="Your answer..."
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="flex-1">Submit Answers</Button>
                <Button variant="outline" asChild>
                  <Link to="/diagnose">New Diagnosis</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;
