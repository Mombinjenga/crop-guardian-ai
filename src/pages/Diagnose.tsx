import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileImage, AlertCircle, Loader2, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const CROP_CATEGORIES = {
  cereals: {
    label: "Cereals",
    crops: ["Maize (Corn)", "Rice", "Wheat", "Sorghum", "Millet", "Barley", "Oats"]
  },
  tubers: {
    label: "Tubers & Root Crops",
    crops: ["Cassava", "Sweet Potato", "Yam", "Irish Potato", "Taro (Cocoyam)", "Ginger"]
  },
  legumes: {
    label: "Legumes",
    crops: ["Beans", "Groundnuts (Peanuts)", "Soybeans", "Cowpeas", "Pigeon Peas", "Lentils"]
  },
  vegetables: {
    label: "Vegetables",
    crops: ["Tomatoes", "Onions", "Peppers", "Cabbage", "Spinach", "Carrots", "Okra"]
  }
};

const Diagnose = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [cropCategory, setCropCategory] = useState("");
  const [cropType, setCropType] = useState("");
  const [customCrop, setCustomCrop] = useState("");
  const [symptomsDuration, setSymptomsDuration] = useState("");
  const [location, setLocation] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [submissionsRemaining, setSubmissionsRemaining] = useState(10);
  const [totalSubmissions, setTotalSubmissions] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSubmissionStatus();
    } else {
      setIsLoadingStatus(false);
    }
  }, [user]);

  const fetchSubmissionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-submission-status');
      if (error) throw error;
      setSubmissionsRemaining(data.remaining);
      setTotalSubmissions(data.maxSubmissions);
    } catch (error) {
      console.error('Error fetching submission status:', error);
    } finally {
      setIsLoadingStatus(false);
    }
  };

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

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const getFinalCropType = () => {
    if (cropType === "other") {
      return customCrop.trim();
    }
    return cropType;
  };

  const handleSubmit = async () => {
    const finalCropType = getFinalCropType();
    
    if (!finalCropType) {
      toast({
        title: "Select or enter crop type",
        description: "Please select a crop from the list or enter a custom crop name.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile && !symptoms) {
      toast({
        title: "Missing information",
        description: "Please upload an image or describe the symptoms.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a diagnosis request.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = null;
      if (selectedFile) {
        imageUrl = await convertFileToBase64(selectedFile);
      }

      const { data, error } = await supabase.functions.invoke('diagnose-crop', {
        body: {
          imageUrl,
          description: symptoms,
          cropType: finalCropType,
          symptomsDuration,
          location
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Diagnosis complete",
        description: "Your crop has been analyzed successfully.",
      });

      navigate(`/results/${data.diagnosisId}`);
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze crop. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = (submissionsRemaining / totalSubmissions) * 100;
  const availableCrops = cropCategory ? CROP_CATEGORIES[cropCategory as keyof typeof CROP_CATEGORIES]?.crops || [] : [];
  const canSubmit = (getFinalCropType() && (selectedFile || symptoms));

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Crop Disease Diagnosis
            </h1>
            <p className="text-lg text-muted-foreground">
              AI-powered diagnosis for cereals, tubers, and other food crops
            </p>
          </div>

          {/* Usage Indicator */}
          {user && (
            <Card className="mb-6 shadow-soft">
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Submissions</span>
                  <span className="text-sm font-semibold text-primary">
                    {isLoadingStatus ? "..." : `${submissionsRemaining} of ${totalSubmissions} remaining`}
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
          )}

          {/* Crop Selection */}
          <Card className="mb-6 shadow-soft">
            <CardHeader>
              <CardTitle>Select Crop Type</CardTitle>
              <CardDescription>
                Choose from the list or type your own crop name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crop Category</label>
                  <Select value={cropCategory} onValueChange={(value) => {
                    setCropCategory(value);
                    setCropType("");
                    setCustomCrop("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CROP_CATEGORIES).map(([key, category]) => (
                        <SelectItem key={key} value={key}>
                          {category.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="other-category">Other Category</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Specific Crop</label>
                  {cropCategory === "other-category" ? (
                    <Input
                      placeholder="Type your crop name..."
                      value={customCrop}
                      onChange={(e) => {
                        setCustomCrop(e.target.value);
                        setCropType("other");
                      }}
                    />
                  ) : (
                    <Select value={cropType} onValueChange={(value) => {
                      setCropType(value);
                      if (value !== "other") setCustomCrop("");
                    }} disabled={!cropCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={cropCategory ? "Select crop" : "Select category first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCrops.map((crop) => (
                          <SelectItem key={crop} value={crop}>
                            {crop}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other (type your own)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {cropType === "other" && cropCategory !== "other-category" && (
                    <Input
                      placeholder="Type your crop name..."
                      value={customCrop}
                      onChange={(e) => setCustomCrop(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">How long have symptoms appeared?</label>
                  <Select value={symptomsDuration} onValueChange={setSymptomsDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-week">Less than a week</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                      <SelectItem value="more-than-month">More than a month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location/Region (Optional)</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tropical">Tropical</SelectItem>
                      <SelectItem value="subtropical">Subtropical</SelectItem>
                      <SelectItem value="temperate">Temperate</SelectItem>
                      <SelectItem value="arid">Arid/Semi-arid</SelectItem>
                      <SelectItem value="highland">Highland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
                Upload clear, well-lit photos of affected leaves, stems, or tubers
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
                    : selectedFile 
                      ? "border-primary/50 bg-primary/5" 
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
                    <p className="mt-2 text-xs text-primary">Click to change image</p>
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
                placeholder="E.g., Yellow spots on leaves, brown edges, wilting, stunted growth, rotting tubers, etc."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={5}
                className="resize-none"
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="shadow-soft bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={(user && submissionsRemaining === 0) || isLoading || !canSubmit}
                  className="min-w-[250px] h-14 text-lg shadow-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Leaf className="mr-2 h-5 w-5" />
                      Analyze My Crop
                    </>
                  )}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  {!canSubmit ? (
                    "Select a crop and upload an image or describe symptoms to continue"
                  ) : !user ? (
                    "You'll need to log in to submit"
                  ) : (
                    "Click to get AI-powered diagnosis results"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Diagnose;
