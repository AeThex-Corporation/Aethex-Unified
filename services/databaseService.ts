import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { 
  Member, 
  Organization, 
  LedgerItem, 
  EngagementEvent, 
  AuditLogEntry,
  ChatMessage 
} from '../types/domain';
import {
  BUSINESS_ORGANIZATION,
  EDUCATION_ORGANIZATION,
  BUSINESS_MEMBERS,
  EDUCATION_MEMBERS,
  BUSINESS_LEDGER_ITEMS,
  EDUCATION_LEDGER_ITEMS,
  DUAL_EVENTS,
  SAMPLE_CHAT_MESSAGES,
  getMembersForContext,
  getLedgerItemsForContext,
  getOrganizationForContext,
  getEventsForContext,
} from './mockData';

export interface DatabaseService {
  members: {
    getById: (id: string) => Promise<Member | null>;
    getByOrg: (orgId: string) => Promise<Member[]>;
    upsert: (member: Member) => Promise<Member>;
  };
  organizations: {
    getById: (id: string) => Promise<Organization | null>;
    getAll: () => Promise<Organization[]>;
  };
  ledgerItems: {
    getByMember: (memberId: string) => Promise<LedgerItem[]>;
    getByOrg: (orgId: string) => Promise<LedgerItem[]>;
    create: (item: Omit<LedgerItem, 'id'>) => Promise<LedgerItem>;
    updateStatus: (id: string, status: LedgerItem['status']) => Promise<void>;
  };
  events: {
    getByMember: (memberId: string) => Promise<EngagementEvent[]>;
    create: (event: Omit<EngagementEvent, 'id'>) => Promise<EngagementEvent>;
  };
  chat: {
    getMessages: (channelId: string, limit?: number) => Promise<ChatMessage[]>;
    sendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<ChatMessage>;
    subscribeToChannel: (channelId: string, callback: (message: ChatMessage) => void) => () => void;
  };
  auth: {
    signIn: (email: string, password: string) => Promise<{ user: any; error: any }>;
    signUp: (email: string, password: string, metadata?: any) => Promise<{ user: any; error: any }>;
    signOut: () => Promise<void>;
    getSession: () => Promise<any>;
    onAuthStateChange: (callback: (event: string, session: any) => void) => () => void;
  };
}

export const databaseService: DatabaseService = {
  members: {
    getById: async (id: string) => {
      if (!isSupabaseConfigured()) {
        const allMembers = [...BUSINESS_MEMBERS, ...EDUCATION_MEMBERS];
        return allMembers.find(m => m.id === id) || null;
      }
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching member:', error);
        const allMembers = [...BUSINESS_MEMBERS, ...EDUCATION_MEMBERS];
        return allMembers.find(m => m.id === id) || null;
      }
      return data as Member;
    },
    getByOrg: async (orgId: string) => {
      if (!isSupabaseConfigured()) {
        if (orgId.includes('biz')) return BUSINESS_MEMBERS;
        if (orgId.includes('edu')) return EDUCATION_MEMBERS;
        return [...BUSINESS_MEMBERS, ...EDUCATION_MEMBERS].filter(m => m.organizationId === orgId);
      }
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('organization_id', orgId);
      if (error) {
        console.error('Error fetching members:', error);
        if (orgId.includes('biz')) return BUSINESS_MEMBERS;
        if (orgId.includes('edu')) return EDUCATION_MEMBERS;
        return [];
      }
      return data as Member[];
    },
    upsert: async (member: Member) => {
      if (!isSupabaseConfigured()) return member;
      const { data, error } = await supabase
        .from('members')
        .upsert(member)
        .select()
        .single();
      if (error) {
        console.error('Error upserting member:', error);
        return member;
      }
      return data as Member;
    },
  },
  organizations: {
    getById: async (id: string) => {
      if (!isSupabaseConfigured()) {
        if (id.includes('biz')) return BUSINESS_ORGANIZATION;
        if (id.includes('edu')) return EDUCATION_ORGANIZATION;
        return null;
      }
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        console.error('Error fetching organization:', error);
        if (id.includes('biz')) return BUSINESS_ORGANIZATION;
        if (id.includes('edu')) return EDUCATION_ORGANIZATION;
        return null;
      }
      return data as Organization;
    },
    getAll: async () => {
      if (!isSupabaseConfigured()) {
        return [BUSINESS_ORGANIZATION, EDUCATION_ORGANIZATION];
      }
      const { data, error } = await supabase
        .from('organizations')
        .select('*');
      if (error) {
        console.error('Error fetching organizations:', error);
        return [BUSINESS_ORGANIZATION, EDUCATION_ORGANIZATION];
      }
      return data as Organization[];
    },
  },
  ledgerItems: {
    getByMember: async (memberId: string) => {
      if (!isSupabaseConfigured()) {
        const allItems = [...BUSINESS_LEDGER_ITEMS, ...EDUCATION_LEDGER_ITEMS];
        return allItems.filter(item => item.memberId === memberId);
      }
      const { data, error } = await supabase
        .from('ledger_items')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching ledger items:', error);
        const allItems = [...BUSINESS_LEDGER_ITEMS, ...EDUCATION_LEDGER_ITEMS];
        return allItems.filter(item => item.memberId === memberId);
      }
      return data as LedgerItem[];
    },
    getByOrg: async (orgId: string) => {
      if (!isSupabaseConfigured()) {
        if (orgId.includes('biz')) return BUSINESS_LEDGER_ITEMS;
        if (orgId.includes('edu')) return EDUCATION_LEDGER_ITEMS;
        return [];
      }
      const { data, error } = await supabase
        .from('ledger_items')
        .select('*')
        .eq('organization_id', orgId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching ledger items:', error);
        if (orgId.includes('biz')) return BUSINESS_LEDGER_ITEMS;
        if (orgId.includes('edu')) return EDUCATION_LEDGER_ITEMS;
        return [];
      }
      return data as LedgerItem[];
    },
    create: async (item: Omit<LedgerItem, 'id'>) => {
      if (!isSupabaseConfigured()) {
        return { ...item, id: `temp-${Date.now()}` } as LedgerItem;
      }
      const { data, error } = await supabase
        .from('ledger_items')
        .insert(item)
        .select()
        .single();
      if (error) {
        console.error('Error creating ledger item:', error);
        throw error;
      }
      return data as LedgerItem;
    },
    updateStatus: async (id: string, status: LedgerItem['status']) => {
      if (!isSupabaseConfigured()) return;
      const { error } = await supabase
        .from('ledger_items')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) {
        console.error('Error updating ledger item status:', error);
        throw error;
      }
    },
  },
  events: {
    getByMember: async (memberId: string) => {
      if (!isSupabaseConfigured()) {
        return DUAL_EVENTS.filter(e => e.memberId === memberId);
      }
      const { data, error } = await supabase
        .from('engagement_events')
        .select('*')
        .eq('member_id', memberId)
        .order('timestamp', { ascending: false });
      if (error) {
        console.error('Error fetching events:', error);
        return DUAL_EVENTS.filter(e => e.memberId === memberId);
      }
      return data as EngagementEvent[];
    },
    create: async (event: Omit<EngagementEvent, 'id'>) => {
      if (!isSupabaseConfigured()) {
        return { ...event, id: `temp-${Date.now()}` } as EngagementEvent;
      }
      const { data, error } = await supabase
        .from('engagement_events')
        .insert(event)
        .select()
        .single();
      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }
      return data as EngagementEvent;
    },
  },
  chat: {
    getMessages: async (channelId: string, limit = 50) => {
      if (!isSupabaseConfigured()) {
        return SAMPLE_CHAT_MESSAGES.filter(m => m.channelId === channelId).slice(-limit);
      }
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      if (error) {
        console.error('Error fetching messages:', error);
        return SAMPLE_CHAT_MESSAGES.filter(m => m.channelId === channelId).slice(-limit);
      }
      return (data as ChatMessage[]).reverse();
    },
    sendMessage: async (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
      if (!isSupabaseConfigured()) {
        return { 
          ...message, 
          id: `temp-${Date.now()}`, 
          timestamp: new Date().toISOString() 
        } as ChatMessage;
      }
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: message.senderId,
          sender_name: message.senderName,
          channel_id: message.channelId,
          content: message.content,
          is_blocked: message.isBlocked,
          pii_redacted: message.piiRedacted,
          redacted_content: message.redactedContent,
          timestamp: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }
      return {
        id: data.id,
        senderId: data.sender_id,
        senderName: data.sender_name,
        channelId: data.channel_id,
        content: data.content,
        timestamp: data.timestamp,
        isBlocked: data.is_blocked,
        piiRedacted: data.pii_redacted,
        redactedContent: data.redacted_content,
      } as ChatMessage;
    },
    subscribeToChannel: (channelId: string, callback: (message: ChatMessage) => void) => {
      if (!isSupabaseConfigured()) return () => {};
      const subscription = supabase
        .channel(`chat:${channelId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'chat_messages',
            filter: `channel_id=eq.${channelId}`,
          },
          (payload) => {
            const msg = payload.new as any;
            callback({
              id: msg.id,
              senderId: msg.sender_id,
              senderName: msg.sender_name,
              channelId: msg.channel_id,
              content: msg.content,
              timestamp: msg.timestamp,
              isBlocked: msg.is_blocked,
              piiRedacted: msg.pii_redacted,
              redactedContent: msg.redacted_content,
            } as ChatMessage);
          }
        )
        .subscribe();
      return () => {
        subscription.unsubscribe();
      };
    },
  },
  auth: {
    signIn: async (email: string, password: string) => {
      if (!isSupabaseConfigured()) {
        return { user: null, error: { message: 'Supabase not configured' } };
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { user: data?.user, error };
    },
    signUp: async (email: string, password: string, metadata?: any) => {
      if (!isSupabaseConfigured()) {
        return { user: null, error: { message: 'Supabase not configured' } };
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      return { user: data?.user, error };
    },
    signOut: async () => {
      if (!isSupabaseConfigured()) return;
      await supabase.auth.signOut();
    },
    getSession: async () => {
      if (!isSupabaseConfigured()) return null;
      const { data } = await supabase.auth.getSession();
      return data?.session;
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      if (!isSupabaseConfigured()) return () => {};
      const { data } = supabase.auth.onAuthStateChange(callback);
      return () => {
        data?.subscription?.unsubscribe();
      };
    },
  },
};

export const SUPABASE_SCHEMA = `
-- Members table (unified user model)
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'employee', 'contractor', 'principal', 'teacher', 'parent', 'student')),
  organization_id UUID REFERENCES organizations(id),
  market_context TEXT NOT NULL CHECK (market_context IN ('business', 'education')),
  metadata JSONB DEFAULT '{}',
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('business', 'school', 'district')),
  market_context TEXT NOT NULL CHECK (market_context IN ('business', 'education')),
  metadata JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ledger items (expenses, assignments, bounties)
CREATE TABLE IF NOT EXISTS ledger_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('expense', 'assignment', 'bounty', 'invoice', 'payment')),
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'completed', 'cancelled')),
  member_id UUID REFERENCES members(id),
  organization_id UUID REFERENCES organizations(id),
  metadata JSONB DEFAULT '{}',
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Engagement events (gamification)
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL,
  sender_id UUID REFERENCES members(id),
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  pii_redacted BOOLEAN DEFAULT FALSE,
  redacted_content TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Skills (for skill tree)
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER DEFAULT 0,
  max_level INTEGER DEFAULT 100,
  is_unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  actor_id UUID REFERENCES members(id),
  target_type TEXT,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies (simplified - adjust for production)
CREATE POLICY "Members are viewable by organization" ON members
  FOR SELECT USING (true);

CREATE POLICY "Organizations are viewable by members" ON organizations
  FOR SELECT USING (true);

CREATE POLICY "Ledger items viewable by organization" ON ledger_items
  FOR SELECT USING (true);

CREATE POLICY "Events viewable by member" ON engagement_events
  FOR SELECT USING (true);

CREATE POLICY "Chat messages are viewable" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Chat messages can be inserted" ON chat_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Skills viewable by member" ON skills
  FOR SELECT USING (true);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
`;

export default databaseService;
