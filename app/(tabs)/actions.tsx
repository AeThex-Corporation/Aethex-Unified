import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Send,
  MessageCircle,
  Users,
  Hash,
  Plus,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useAppStore, useTheme } from "@/store/appStore";

interface ApprovalCardProps {
  title: string;
  requester: string;
  type: string;
  amount?: string;
  time: string;
  delay: number;
}

function ApprovalCard({ title, requester, type, amount, time, delay }: ApprovalCardProps) {
  const theme = useTheme();
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending");

  const handleApprove = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStatus("approved");
  };

  const handleReject = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setStatus("rejected");
  };

  if (status !== "pending") {
    return (
      <Animated.View entering={FadeIn.duration(300)}>
        <View
          style={{
            backgroundColor: status === "approved" ? "#22c55e20" : "#ef444420",
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: status === "approved" ? "#22c55e" : "#ef4444",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {status === "approved" ? (
            <CheckCircle size={20} color="#22c55e" />
          ) : (
            <XCircle size={20} color="#ef4444" />
          )}
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: status === "approved" ? "#22c55e" : "#ef4444",
            }}
          >
            {status === "approved" ? "Approved" : "Rejected"}
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
      <View
        style={{
          backgroundColor: "#f8fafc",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#e2e8f0",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 12 }}>
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              backgroundColor: "#1e3a8a20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={22} color="#1e3a8a" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text }}>
              {title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
              <User size={12} color={theme.textSecondary} />
              <Text style={{ fontSize: 13, color: theme.textSecondary, marginLeft: 4 }}>
                {requester}
              </Text>
            </View>
          </View>
          {amount && (
            <Text style={{ fontSize: 17, fontWeight: "700", color: "#1e3a8a" }}>
              {amount}
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <View
            style={{
              backgroundColor: "#e2e8f0",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>{type}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Clock size={12} color={theme.textSecondary} />
            <Text style={{ fontSize: 12, color: theme.textSecondary, marginLeft: 4 }}>
              {time}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={handleReject}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: "#fee2e2",
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <XCircle size={18} color="#ef4444" />
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#ef4444" }}>
              Reject
            </Text>
          </Pressable>
          <Pressable
            onPress={handleApprove}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: "#22c55e",
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <CheckCircle size={18} color="#ffffff" />
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#ffffff" }}>
              Approve
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

function DayModeActions() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const pendingApprovals = [
    {
      title: "Expense Report - Q4",
      requester: "John Smith",
      type: "Expense",
      amount: "$1,245.00",
      time: "2 hours ago",
    },
    {
      title: "Leave Request",
      requester: "Emma Wilson",
      type: "Time Off",
      time: "4 hours ago",
    },
    {
      title: "Equipment Purchase",
      requester: "Mike Johnson",
      type: "Purchase",
      amount: "$899.00",
      time: "Yesterday",
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
    >
      <Animated.View entering={FadeInDown.duration(400)}>
        <View
          style={{
            backgroundColor: "#fef3c7",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#fcd34d",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Clock size={24} color="#f59e0b" />
          <View style={{ marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: "#92400e" }}>
              {pendingApprovals.length} Pending Approvals
            </Text>
            <Text style={{ fontSize: 13, color: "#a16207" }}>
              Requires your attention
            </Text>
          </View>
        </View>
      </Animated.View>

      {pendingApprovals.map((approval, index) => (
        <ApprovalCard
          key={index}
          {...approval}
          delay={100 + index * 100}
        />
      ))}
    </ScrollView>
  );
}

function NightModeGuild() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");

  const channels = [
    { name: "general", unread: 3 },
    { name: "bounty-hunters", unread: 12 },
    { name: "web3-devs", unread: 0 },
  ];

  const messages = [
    {
      user: "CryptoKnight",
      avatar: "CK",
      message: "Anyone working on the GameForge bounty?",
      time: "2m",
      color: "#8b5cf6",
    },
    {
      user: "SynthMaster",
      avatar: "SM",
      message: "Just submitted the audio tracks! Waiting for review.",
      time: "5m",
      color: "#ec4899",
    },
    {
      user: "CodeNinja",
      avatar: "CN",
      message: "The smart contract audit is taking longer than expected",
      time: "12m",
      color: "#22c55e",
    },
    {
      user: "PixelArtist",
      avatar: "PA",
      message: "New NFT collection dropping soon! ",
      time: "1h",
      color: "#f59e0b",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View
          style={{
            width: 70,
            backgroundColor: "#13131a",
            borderRightWidth: 1,
            borderRightColor: "#2d2d3a",
            paddingTop: 12,
            alignItems: "center",
          }}
        >
          {channels.map((channel, index) => (
            <Animated.View
              key={index}
              entering={FadeIn.delay(index * 100).duration(300)}
            >
              <Pressable
                style={({ pressed }) => ({
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  backgroundColor: index === 1 ? "#22c55e20" : "#1a1a24",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 8,
                  borderWidth: index === 1 ? 2 : 0,
                  borderColor: "#22c55e",
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Hash size={20} color={index === 1 ? "#22c55e" : theme.textSecondary} />
                {channel.unread > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      backgroundColor: "#ef4444",
                      borderRadius: 10,
                      minWidth: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 10, fontWeight: "700", color: "#fff" }}>
                      {channel.unread}
                    </Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
          ))}
          <Pressable
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: "#1a1a24",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 8,
              borderWidth: 1,
              borderColor: "#2d2d3a",
              borderStyle: "dashed",
            }}
          >
            <Plus size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#2d2d3a",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Hash size={18} color="#22c55e" />
            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text, marginLeft: 8 }}>
              bounty-hunters
            </Text>
            <View
              style={{
                marginLeft: "auto",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Users size={16} color={theme.textSecondary} />
              <Text style={{ fontSize: 13, color: theme.textSecondary, marginLeft: 4 }}>
                247 online
              </Text>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
          >
            {messages.map((msg, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(100 + index * 50).duration(400)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: msg.color,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "700", color: "#0B0A0F" }}>
                      {msg.avatar}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: msg.color }}>
                        {msg.user}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: theme.textSecondary,
                          marginLeft: 8,
                        }}
                      >
                        {msg.time}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: theme.text, marginTop: 4 }}>
                      {msg.message}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>

          <View
            style={{
              padding: 12,
              paddingBottom: insets.bottom + 12,
              borderTopWidth: 1,
              borderTopColor: "#2d2d3a",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1a1a24",
                borderRadius: 12,
                paddingHorizontal: 16,
                height: 48,
              }}
            >
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Message #bounty-hunters"
                placeholderTextColor="#64748b"
                style={{ flex: 1, fontSize: 15, color: theme.text }}
              />
              <Pressable
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "#22c55e",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Send size={18} color="#0B0A0F" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ActionsScreen() {
  const { mode } = useAppStore();

  return mode === "day" ? <DayModeActions /> : <NightModeGuild />;
}
