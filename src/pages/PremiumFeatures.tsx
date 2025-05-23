import React from "react";
import { useNavigate } from "react-router-dom";
import PlanCheck from "@/components/PlanCheck";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, Sparkles, Shield, Crown } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import PlanStatusBadge from "@/components/PlanStatusBadge";
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const PremiumFeatures = () => {
  const navigate = useNavigate();
  const { planName, isPremium, isEnterprise } = usePlan();
  const [profile, setProfile] = useState(null);
  
  // Add profile fetching
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setProfile(data);
      }
    };
    
    fetchProfile();
  }, []);
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Premium Features</h1>
          <div className="flex items-center gap-2">
            <span>Current Plan:</span>
            <PlanStatusBadge profile={profile} />
          </div>
        </div>
        
        <p className="text-gray-600 mt-2">
          Explore the premium features available in different plan tiers
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Premium Animations */}
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <h2 className="text-lg font-medium">Premium Animations</h2>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
              Professional Plan
            </span>
          </div>
          
          <div className="p-4">
            <PlanCheck featureName="Premium animations" requiresEnterprise={false}>
              <div className="space-y-4">
                <div className="animate-fade-in p-4 bg-blue-50 border border-blue-200 rounded text-blue-800">
                  Fade In Animation
                </div>
                <div className="animate-scale-in p-4 bg-indigo-50 border border-indigo-200 rounded text-indigo-800">
                  Scale In Animation
                </div>
                <div className="animate-slide-in-right p-4 bg-purple-50 border border-purple-200 rounded text-purple-800">
                  Slide In Animation
                </div>
              </div>
            </PlanCheck>
          </div>
        </div>
        
        {/* Enterprise Animations */}
        <div className="border rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              <h2 className="text-lg font-medium">Enterprise Animations</h2>
            </div>
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded">
              Enterprise Plan
            </span>
          </div>
          
          <div className="p-4">
            <PlanCheck featureName="Enterprise animations" requiresEnterprise={true}>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 border border-purple-200 rounded text-purple-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Particles Background</span>
                  </div>
                  <div className="mt-2 opacity-75">
                    Interactive animated background with floating particles
                  </div>
                </div>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded text-indigo-800">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Scroll Reveal</span>
                  </div>
                  <div className="mt-2 opacity-75">
                    Elements that reveal with stunning animations as users scroll
                  </div>
                </div>
              </div>
            </PlanCheck>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Upgrade Your Plan</h2>
        <p className="mb-4 text-gray-600">
          Unlock {isPremium ? 'enterprise' : 'premium and enterprise'} features by upgrading your plan. 
          Get access to advanced animations, interactive elements, and more.
        </p>
        <Button>View Plans</Button>
      </div>
    </div>
  );
};

export default PremiumFeatures;
