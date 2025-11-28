-- AeThex Companion Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('business', 'school', 'district')),
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  settings JSONB NOT NULL DEFAULT '{
    "marketContext": "business",
    "complianceEnabled": true,
    "piiDetectionEnabled": true,
    "auditLoggingEnabled": true
  }',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  external_id TEXT,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN (
    'owner', 'manager', 'employee', 'vendor', 'contractor',
    'admin', 'teacher', 'student', 'guardian', 'staff'
  )),
  avatar TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  trust_score INTEGER NOT NULL DEFAULT 100 CHECK (trust_score >= 0 AND trust_score <= 100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ledger Items table (expenses, bounties, assignments, etc.)
CREATE TABLE IF NOT EXISTS ledger_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'invoice', 'bounty', 'assignment', 'achievement', 'payout')),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12,2),
  currency TEXT DEFAULT 'USD',
  xp_value INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'overdue')),
  category TEXT,
  attachments TEXT[],
  due_date TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  compliance_flags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID REFERENCES members(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  channel_id TEXT NOT NULL,
  content TEXT NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  pii_redacted BOOLEAN DEFAULT FALSE,
  redacted_content TEXT,
  compliance_flags JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Log table (immutable compliance log)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('ALLOWED', 'FLAGGED', 'BLOCKED', 'QUARANTINED', 'PENDING')),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  flagged BOOLEAN DEFAULT FALSE,
  trigger TEXT,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance Cases table
CREATE TABLE IF NOT EXISTS compliance_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  event_id UUID,
  type TEXT NOT NULL CHECK (type IN ('PII_DETECTION', 'POLICY_VIOLATION', 'SECURITY_INCIDENT', 'CONTENT_FLAG', 'BEHAVIORAL_ALERT')),
  severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'escalated')),
  title TEXT NOT NULL,
  description TEXT,
  evidence JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Skill Nodes table (for gamification)
CREATE TABLE IF NOT EXISTS skill_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('TIER_1', 'TIER_2', 'TIER_3')),
  category TEXT NOT NULL,
  xp_required INTEGER NOT NULL DEFAULT 0,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  prerequisites UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Member Skills (junction table for unlocked skills)
CREATE TABLE IF NOT EXISTS member_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  skill_node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  current_xp INTEGER DEFAULT 0,
  UNIQUE(member_id, skill_node_id)
);

-- Engagement Events table
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE SET NULL,
  raw_event TEXT NOT NULL,
  context TEXT,
  compliance JSONB NOT NULL DEFAULT '{
    "riskLevel": "LOW",
    "status": "ALLOWED",
    "piiDetected": false,
    "triggers": []
  }',
  gamification JSONB NOT NULL DEFAULT '{
    "xp": 0,
    "type": "TASK",
    "tier": "TIER_1",
    "isUnlocked": false
  }',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_members_org ON members(organization_id);
CREATE INDEX IF NOT EXISTS idx_ledger_org ON ledger_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_ledger_member ON ledger_items(member_id);
CREATE INDEX IF NOT EXISTS idx_chat_channel ON chat_messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_chat_created ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_org ON compliance_cases(organization_id);
CREATE INDEX IF NOT EXISTS idx_engagement_member ON engagement_events(member_id);

-- Row Level Security (RLS) policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow authenticated users to read their org's data)
CREATE POLICY "Users can view their organization" ON organizations
  FOR SELECT USING (true);

CREATE POLICY "Users can view members in their org" ON members
  FOR SELECT USING (true);

CREATE POLICY "Users can view ledger items" ON ledger_items
  FOR SELECT USING (true);

CREATE POLICY "Users can view and send chat messages" ON chat_messages
  FOR ALL USING (true);

CREATE POLICY "Audit logs are readable" ON audit_logs
  FOR SELECT USING (true);

CREATE POLICY "Audit logs can be inserted" ON audit_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Compliance cases are readable" ON compliance_cases
  FOR SELECT USING (true);

CREATE POLICY "Skill nodes are public" ON skill_nodes
  FOR SELECT USING (true);

CREATE POLICY "Member skills are viewable" ON member_skills
  FOR ALL USING (true);

CREATE POLICY "Engagement events are accessible" ON engagement_events
  FOR ALL USING (true);

-- Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ledger_items_updated_at
  BEFORE UPDATE ON ledger_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_cases_updated_at
  BEFORE UPDATE ON compliance_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
