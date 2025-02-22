"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, LineChart, Users, Utensils } from "lucide-react";
import Link from "next/link";
import { LucideIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background z-0" />
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-primary to-orange-500 mb-6">
              Revolutionizing Café Management with Smart Tech!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your café operations with our intelligent management system.
              Boost efficiency, increase sales, and delight customers.
            </p>
            <Link href="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-16">
          Smart Features for Modern Cafés
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={Coffee}
            title="Smart Menu"
            description="Dynamic menu management with real-time updates and smart recommendations"
          />
          <FeatureCard
            icon={Users}
            title="Staff Management"
            description="Efficient staff scheduling and performance tracking"
          />
          <FeatureCard
            icon={LineChart}
            title="Analytics"
            description="Comprehensive insights into sales, trends, and customer behavior"
          />
          <FeatureCard
            icon={Utensils}
            title="Order Management"
            description="Streamlined order processing with real-time status updates"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Café?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of café owners who have revolutionized their business
            with our smart management system.
          </p>
          <Link href="/auth">
            <Button size="lg" variant="default">
              Start Your Journey <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-6 rounded-lg bg-card border hover:border-primary/50 transition-colors">
      <Icon className="w-12 h-12 text-primary mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}