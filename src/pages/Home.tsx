import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Shield, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import leafComparison from "@/assets/leaf-comparison.jpg";

const Home = () => {
  const features = [
    {
      icon: Zap,
      title: "Fast Detection",
      description: "Get instant crop disease diagnosis within seconds using advanced AI technology.",
    },
    {
      icon: Target,
      title: "High Accuracy",
      description: "Our deep learning models provide 95%+ accuracy in disease identification.",
    },
    {
      icon: Shield,
      title: "Early Prevention",
      description: "Detect diseases early to prevent crop loss and ensure healthy yields.",
    },
    {
      icon: Leaf,
      title: "Sustainable Farming",
      description: "Make informed decisions for eco-friendly and sustainable agriculture practices.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Protect Your Crops with{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">AI-Powered</span> Detection
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Early disease detection is crucial for healthy crops. Upload an image or describe
              symptoms, and our smart AI will provide instant diagnosis and treatment recommendations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="shadow-medium">
                <Link to="/diagnose">Start Diagnosis</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Why Choose CropGuard AI?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Leverage cutting-edge technology to safeguard your crops and maximize yields
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="transition-smooth hover:shadow-medium">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Simple 3-Step Process
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get your crop diagnosis in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Upload Image</h3>
              <p className="text-muted-foreground">
                Take a clear photo of affected leaves and upload it to our platform
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI analyzes the image and identifies any diseases or pest infestations
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Get Results</h3>
              <p className="text-muted-foreground">
                Receive detailed diagnosis with treatment recommendations instantly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
            Ready to Protect Your Crops?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/90">
            Join thousands of farmers using CropGuard AI for healthier, more productive crops
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/diagnose">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/auth">Sign Up Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
