
-- Update plans with consistent features that match the front page
UPDATE plans SET 
  name = 'Basic',
  description = 'Perfect for getting started',
  monthly_price = 15,
  annual_price = 150,
  features = '[
    "Up to 30 products",
    "1 website",
    "Basic analytics",
    "Email support",
    "SSL certificate",
    "Mobile responsive",
    "Basic themes"
  ]'::jsonb
WHERE name = 'Basic';

UPDATE plans SET 
  name = 'Professional',
  description = 'Best for growing businesses',
  monthly_price = 39,
  annual_price = 390,
  features = '[
    "Up to 150 products",
    "3 websites",
    "Advanced analytics",
    "Priority support",
    "Custom domain",
    "Premium themes",
    "Discount codes",
    "Advanced SEO tools",
    "Payment integrations"
  ]'::jsonb
WHERE name = 'Professional';

UPDATE plans SET 
  name = 'Enterprise',
  description = 'For large scale operations',
  monthly_price = 99,
  annual_price = 990,
  features = '[
    "Up to 1500 products",
    "5 websites",
    "Enterprise analytics",
    "24/7 phone support",
    "Priority processing",
    "Custom integrations",
    "PayPal integration",
    "Advanced automation",
    "White-label options",
    "API access"
  ]'::jsonb
WHERE name = 'Enterprise';

-- Insert plans if they don't exist
INSERT INTO plans (name, description, monthly_price, annual_price, features)
SELECT 'Basic', 'Perfect for getting started', 15, 150, '[
  "Up to 30 products",
  "1 website", 
  "Basic analytics",
  "Email support",
  "SSL certificate",
  "Mobile responsive",
  "Basic themes"
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Basic');

INSERT INTO plans (name, description, monthly_price, annual_price, features)
SELECT 'Professional', 'Best for growing businesses', 39, 390, '[
  "Up to 150 products",
  "3 websites",
  "Advanced analytics", 
  "Priority support",
  "Custom domain",
  "Premium themes",
  "Discount codes",
  "Advanced SEO tools",
  "Payment integrations"
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Professional');

INSERT INTO plans (name, description, monthly_price, annual_price, features)
SELECT 'Enterprise', 'For large scale operations', 99, 990, '[
  "Up to 1500 products",
  "5 websites",
  "Enterprise analytics",
  "24/7 phone support", 
  "Priority processing",
  "Custom integrations",
  "PayPal integration",
  "Advanced automation",
  "White-label options",
  "API access"
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = 'Enterprise');
