import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, CreditCard, Bell, Shield, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Account = () => {
  // Mock user data
  const user = {
    name: "John Farmer",
    email: "john@example.com",
    plan: "Free",
    submissionsUsed: 3,
    submissionsTotal: 10,
    memberSince: "January 2025",
  };

  const submissionHistory = [
    { date: "2025-01-15", crop: "Tomato", disease: "Early Blight", status: "Completed" },
    { date: "2025-01-12", crop: "Wheat", disease: "Rust Disease", status: "Completed" },
    { date: "2025-01-08", crop: "Corn", disease: "Leaf Spot", status: "Completed" },
  ];

  const usagePercentage = (user.submissionsUsed / user.submissionsTotal) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground sm:text-4xl">
              My Account
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your profile, subscription, and preferences
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold text-foreground">{user.name}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mb-4">
                    {user.plan} Plan
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Member since {user.memberSince}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle className="text-base">Usage This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Submissions</span>
                    <span className="font-semibold text-foreground">
                      {user.submissionsUsed} / {user.submissionsTotal}
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="mb-3 h-2" />
                  <Button size="sm" variant="outline" className="w-full">
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="subscription">Plan</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Profile Information
                      </CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user.name}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Email Address</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="subscription" className="mt-6">
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Subscription Plan
                      </CardTitle>
                      <CardDescription>
                        Manage your subscription and billing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-lg border border-border p-4">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Free Plan</h3>
                            <p className="text-sm text-muted-foreground">
                              10 submissions per month
                            </p>
                          </div>
                          <Badge>Current</Badge>
                        </div>
                        <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                          <li>✓ Basic disease detection</li>
                          <li>✓ Treatment recommendations</li>
                          <li>✓ Email support</li>
                        </ul>
                      </div>

                      <div className="rounded-lg border border-primary bg-primary/5 p-4">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Pro Plan</h3>
                            <p className="text-sm text-muted-foreground">
                              Unlimited submissions
                            </p>
                          </div>
                          <Badge variant="secondary">$29/month</Badge>
                        </div>
                        <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
                          <li>✓ Unlimited disease detection</li>
                          <li>✓ Advanced AI analysis</li>
                          <li>✓ Priority support</li>
                          <li>✓ Historical data tracking</li>
                          <li>✓ Weather integration</li>
                        </ul>
                        <Button className="w-full">Upgrade to Pro</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-6">
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Download className="h-5 w-5 text-primary" />
                        Submission History
                      </CardTitle>
                      <CardDescription>
                        View your past crop diagnoses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {submissionHistory.map((submission, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-border p-4"
                          >
                            <div>
                              <p className="font-medium text-foreground">{submission.crop}</p>
                              <p className="text-sm text-muted-foreground">
                                {submission.disease}
                              </p>
                              <p className="text-xs text-muted-foreground">{submission.date}</p>
                            </div>
                            <Badge variant="secondary">{submission.status}</Badge>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="mt-4 w-full">
                        View All History
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                  <Card className="shadow-soft">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Account Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your preferences and security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="flex items-center gap-2 text-sm font-semibold">
                          <Bell className="h-4 w-4" />
                          Notifications
                        </h3>
                        <div className="space-y-3">
                          <label className="flex items-center justify-between">
                            <span className="text-sm">Email notifications</span>
                            <input type="checkbox" defaultChecked className="rounded" />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm">Weekly digest</span>
                            <input type="checkbox" className="rounded" />
                          </label>
                          <label className="flex items-center justify-between">
                            <span className="text-sm">Marketing emails</span>
                            <input type="checkbox" className="rounded" />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-4 border-t border-border pt-6">
                        <h3 className="flex items-center gap-2 text-sm font-semibold text-destructive">
                          <Shield className="h-4 w-4" />
                          Danger Zone
                        </h3>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
