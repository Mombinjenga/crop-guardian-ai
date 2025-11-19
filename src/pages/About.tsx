import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Active Farmers", value: "10,000+", icon: Users },
    { label: "Crops Diagnosed", value: "500,000+", icon: Target },
    { label: "Accuracy Rate", value: "95%+", icon: Award },
    { label: "Success Stories", value: "8,500+", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
              About CropGuard AI
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Empowering farmers with cutting-edge AI technology for sustainable agriculture
            </p>
          </div>

          <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="text-center shadow-soft">
                <CardContent className="pt-6">
                  <stat.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="mb-1 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-8">
            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Our Mission</h2>
                <p className="text-muted-foreground">
                  At CropGuard AI, we're on a mission to revolutionize agriculture through
                  artificial intelligence. We believe that early disease detection is crucial for
                  protecting crops, ensuring food security, and supporting sustainable farming
                  practices. Our platform combines advanced computer vision and deep learning to
                  provide farmers with instant, accurate crop disease diagnoses.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">How It Works</h2>
                <p className="mb-4 text-muted-foreground">
                  Our AI system has been trained on hundreds of thousands of crop images,
                  learning to identify diseases, pest infestations, and nutrient deficiencies
                  with remarkable accuracy. When you upload an image of your crop:
                </p>
                <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                  <li>Our computer vision algorithms analyze the leaf patterns and discoloration</li>
                  <li>Deep learning models compare findings against our extensive disease database</li>
                  <li>We consider environmental factors like location and weather conditions</li>
                  <li>You receive a detailed diagnosis with treatment recommendations within seconds</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Why Choose Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Accuracy You Can Trust</h3>
                    <p>
                      With over 95% accuracy rate, our AI models are continuously updated and
                      refined based on real-world data from farmers like you.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Fast & Convenient</h3>
                    <p>
                      Get instant diagnoses anytime, anywhere. No need to wait for expert visits
                      or lab results.
                    </p>
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">Expert-Backed</h3>
                    <p>
                      Our treatment recommendations are developed in collaboration with agricultural
                      scientists and verified by farming experts.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="pt-6">
                <h2 className="mb-4 text-2xl font-bold text-foreground">Our Commitment</h2>
                <p className="text-muted-foreground">
                  We're committed to supporting sustainable farming practices and helping farmers
                  make informed decisions. By detecting diseases early and providing targeted
                  treatment recommendations, we help reduce unnecessary pesticide use, minimize
                  crop loss, and contribute to a more sustainable agricultural future.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
