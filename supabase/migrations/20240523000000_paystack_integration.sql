-- Add columns to teams table
ALTER TABLE teams ADD COLUMN IF NOT EXISTS paystack_customer_code TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS paystack_subscription_code TEXT;
ALTER TABLE teams ADD COLUMN IF NOT EXISTS paystack_authorization_code TEXT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_teams_paystack_customer ON teams(paystack_customer_code);
CREATE INDEX IF NOT EXISTS idx_teams_paystack_subscription ON teams(paystack_subscription_code);

-- Paystack transactions log
CREATE TABLE IF NOT EXISTS paystack_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
  reference TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- in pesewas (GHS 45 = 4500 pesewas)
  currency TEXT DEFAULT 'GHS',
  status TEXT CHECK (status IN ('pending', 'success', 'failed', 'abandoned')),
  authorization_code TEXT,
  customer_code TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  channel TEXT, -- card, mobile_money, bank, etc.
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE paystack_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Team admins can view their transactions"
  ON paystack_transactions FOR SELECT
  USING (
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
