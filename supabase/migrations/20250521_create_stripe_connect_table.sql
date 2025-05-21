
-- Create table for storing Stripe Connect account information
CREATE TABLE IF NOT EXISTS public.stripe_connect_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  website_id UUID REFERENCES public.websites(id) ON DELETE CASCADE NOT NULL,
  stripe_account_id TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL DEFAULT 'standard',
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  charges_enabled BOOLEAN NOT NULL DEFAULT false,
  payouts_enabled BOOLEAN NOT NULL DEFAULT false,
  details_submitted BOOLEAN NOT NULL DEFAULT false,
  account_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on website_id
ALTER TABLE IF EXISTS public.stripe_connect_accounts 
  ADD CONSTRAINT stripe_connect_accounts_website_id_key UNIQUE (website_id);

-- Enable Row Level Security
ALTER TABLE public.stripe_connect_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own accounts
CREATE POLICY "Users can view their own connect accounts" 
  ON public.stripe_connect_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to update their own accounts
CREATE POLICY "Users can update their own connect accounts" 
  ON public.stripe_connect_accounts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own accounts
CREATE POLICY "Users can delete their own connect accounts" 
  ON public.stripe_connect_accounts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own accounts
CREATE POLICY "Users can insert their own connect accounts" 
  ON public.stripe_connect_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
