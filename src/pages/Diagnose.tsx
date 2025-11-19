import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Upload, FileImage, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Diagnose = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submissionsRemaining] = useState(7); // Mock data
  const [totalSubmissions] = useState(10); // Mock data
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      toast({
        title: "Image uploaded",
        description: "Your image has been successfully uploaded.",
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = () => {
    if (!selectedFile && !symptoms) {
      toast({
        title: "Missing information",
        description: "Please upload an image or describe the symptoms.",
        variant: "destructive",
      });
      return;
    }

    // Here you would integrate with your AI backend
    toast({
      title: "Analysis started",
      description: "Our AI is analyzing your crop. This may take a few seconds...",
    });

    // Simulate navigation to results (in real app, this would be after API response)
    setTimeout(() => {
      window.location.href = "/results";
    }, 2000);
  };

  const progressPercentage = (submissionsRemaining / totalSubmissions) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Submit Crop Diagnosis
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload clear images of affected leaves or describe the symptoms
            </p>
          </div>

          {/* Usage Indicator */}
          <Card className="mb-6 shadow-soft">
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">Monthly Submissions</span>
                <span className="text-sm font-semibold text-primary">
                  {submissionsRemaining} of {totalSubmissions} remaining
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {submissionsRemaining === 0 ? (
                  <span className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    No submissions remaining. Upgrade to continue.
                  </span>
                ) : (
                  "Upgrade to Pro for unlimited submissions"
                )}
              </p>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="mb-6 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Upload Crop Images
              </CardTitle>
              <CardDescription>
                Upload clear, well-lit photos of affected leaves for accurate diagnosis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-smooth ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {selectedFile ? (
                  <div className="text-center">
                    <FileImage className="mx-auto mb-2 h-12 w-12 text-primary" />
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Drop your image here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JPG, PNG, WEBP (Max 10MB)
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Symptoms Description */}
          <Card className="mb-6 shadow-soft">
            <CardHeader>
              <CardTitle>Describe Symptoms (Optional)</CardTitle>
              <CardDescription>
                Provide additional details about the condition of your crops
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="E.g., Yellow spots on leaves, brown edges, wilting, etc."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={submissionsRemaining === 0}
              className="min-w-[200px] shadow-medium"
            >
              Analyze Crop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnose;
