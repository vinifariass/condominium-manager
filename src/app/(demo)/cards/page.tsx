import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  TrendingUp, 
  Users, 
  DollarSign,
  ShoppingCart,
  Eye,
  Calendar,
  Clock,
  Star
} from "lucide-react";

export default function CardsPage() {
  return (
    <ContentLayout title="Cards">
      <div className="space-y-8">
        {/* Stats Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Stats Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12,234</div>
                <p className="text-xs text-muted-foreground">
                  +19% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Product Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Product Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-blue-500"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">New</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.9</span>
                  </div>
                </div>
                <CardTitle>Premium Dashboard</CardTitle>
                <CardDescription>
                  A beautiful and modern dashboard template with dark mode support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$99</span>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>1.2k views</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-emerald-500"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 text-xs border border-border rounded-md">Popular</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.7</span>
                  </div>
                </div>
                <CardTitle>Analytics Pro</CardTitle>
                <CardDescription>
                  Advanced analytics dashboard with real-time data visualization.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$149</span>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>3.4k views</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-500"></div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded-md">Sale</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.8</span>
                  </div>
                </div>
                <CardTitle>E-commerce Suite</CardTitle>
                <CardDescription>
                  Complete e-commerce solution with payment integration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">$199</span>
                    <span className="text-sm line-through text-muted-foreground">$299</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>2.1k views</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Add to Cart</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Social Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Social Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">@shadcn</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Calendar className="h-3 w-3" />
                      <span>2 hours ago</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Just shipped a new update to the design system! 🎉 
                  New components, better accessibility, and improved performance.
                  Check it out and let me know what you think!
                </p>
                <div className="mt-4 aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg"></div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      124
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      23
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      12
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">@johndoe</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Clock className="h-3 w-3" />
                      <span>5 hours ago</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Working on a new project using Next.js 14 and the latest React features. 
                  The developer experience is incredible! 🚀
                </p>
                <div className="mt-4 flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">#nextjs</span>
                  <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">#react</span>
                  <span className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md">#webdev</span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4 mr-1" />
                      89
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      15
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      7
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Feature Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Feature Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  Track your performance with detailed analytics and insights.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time data</li>
                  <li>• Custom dashboards</li>
                  <li>• Export reports</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Work together seamlessly with your team members.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Real-time sync</li>
                  <li>• Comments & feedback</li>
                  <li>• Role permissions</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>
                  Flexible pricing plans that scale with your business.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Free tier available</li>
                  <li>• No hidden fees</li>
                  <li>• Cancel anytime</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
