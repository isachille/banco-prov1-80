-- Create SumUp integration tables

-- SumUp Customers table
CREATE TABLE public.sumup_customers (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  raw JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sumup_customers
ALTER TABLE public.sumup_customers ENABLE ROW LEVEL SECURITY;

-- Create policies for sumup_customers
CREATE POLICY "Users can view their own sumup customers" 
ON public.sumup_customers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sumup customers" 
ON public.sumup_customers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sumup customers" 
ON public.sumup_customers 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sumup customers" 
ON public.sumup_customers 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all sumup customers" 
ON public.sumup_customers 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- SumUp Checkouts table
CREATE TABLE public.sumup_checkouts (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  checkout_reference TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  description TEXT,
  status TEXT,
  raw JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sumup_checkouts
ALTER TABLE public.sumup_checkouts ENABLE ROW LEVEL SECURITY;

-- Create policies for sumup_checkouts
CREATE POLICY "Users can view their own sumup checkouts" 
ON public.sumup_checkouts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sumup checkouts" 
ON public.sumup_checkouts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sumup checkouts" 
ON public.sumup_checkouts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sumup checkouts" 
ON public.sumup_checkouts 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all sumup checkouts" 
ON public.sumup_checkouts 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- SumUp Refunds table
CREATE TABLE public.sumup_refunds (
  id TEXT NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  transaction_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT,
  raw JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sumup_refunds
ALTER TABLE public.sumup_refunds ENABLE ROW LEVEL SECURITY;

-- Create policies for sumup_refunds
CREATE POLICY "Users can view their own sumup refunds" 
ON public.sumup_refunds 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sumup refunds" 
ON public.sumup_refunds 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sumup refunds" 
ON public.sumup_refunds 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sumup refunds" 
ON public.sumup_refunds 
FOR SELECT 
USING (is_admin_user(auth.uid()));

CREATE POLICY "Admins can update all sumup refunds" 
ON public.sumup_refunds 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- Add triggers for automatic updated_at timestamps
CREATE TRIGGER update_sumup_customers_updated_at
  BEFORE UPDATE ON public.sumup_customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sumup_checkouts_updated_at
  BEFORE UPDATE ON public.sumup_checkouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sumup_refunds_updated_at
  BEFORE UPDATE ON public.sumup_refunds
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();