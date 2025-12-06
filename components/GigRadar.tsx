import { View, Text, Pressable, Alert } from "react-native";
import { 
  Zap, 
  Clock, 
  ChevronRight, 
  Check,
  Radio,
  Briefcase,
} from "lucide-react-native";
import Animated, { 
  FadeInDown, 
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { nexusService, Gig } from "@/services/nexusService";
import { useTheme } from "@/store/appStore";
import { useState } from "react";

interface GigCardProps {
  gig: Gig;
  index: number;
  onApply: (gigId: string) => void;
  applied: boolean;
}

function GigCard({ gig, index, onApply, applied }: GigCardProps) {
  const theme = useTheme();
  const translateX = useSharedValue(0);
  const urgencyColor = nexusService.getUrgencyColor(gig.urgency);

  const handleApply = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onApply(gig.id);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, 100);
      }
    })
    .onEnd((event) => {
      if (event.translationX > 80) {
        runOnJS(handleApply)();
      }
      translateX.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const swipeIndicatorStyle = useAnimatedStyle(() => ({
    opacity: translateX.value / 100,
    transform: [{ scale: 0.8 + (translateX.value / 100) * 0.2 }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).duration(300)}
      style={{ marginBottom: 12, position: "relative" }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 80,
            backgroundColor: applied ? "#22c55e" : "#5533FF",
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
          },
          swipeIndicatorStyle,
        ]}
      >
        {applied ? (
          <Check size={24} color="#FFFFFF" />
        ) : (
          <ChevronRight size={24} color="#FFFFFF" />
        )}
        <Text style={{ color: "#FFFFFF", fontSize: 10, marginTop: 4 }}>
          {applied ? "Applied" : "Apply"}
        </Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            {
              backgroundColor: "#1a1a24",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: "#2d2d3a",
            },
            animatedStyle,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                backgroundColor: urgencyColor + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Briefcase size={24} color={urgencyColor} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "600",
                    color: theme.text,
                    flex: 1,
                  }}
                  numberOfLines={1}
                >
                  {gig.title}
                </Text>
                {applied && (
                  <View
                    style={{
                      backgroundColor: "#22c55e20",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#22c55e", fontWeight: "600" }}>
                      APPLIED
                    </Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 6 }}>
                {gig.client}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    backgroundColor: urgencyColor + "20",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 11, color: urgencyColor, fontWeight: "500" }}>
                    {gig.category}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Clock size={12} color={theme.textSecondary} />
                  <Text style={{ fontSize: 11, color: theme.textSecondary }}>
                    {nexusService.formatTimeAgo(gig.postedAt)}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#5533FF20",
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, color: "#5533FF", fontWeight: "600" }}>
                    {gig.matchScore}% match
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#22c55e",
                }}
              >
                ${gig.reward.toLocaleString()}
              </Text>
              <Text style={{ fontSize: 11, color: theme.textSecondary }}>
                {gig.currency}
              </Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default function GigRadar() {
  const theme = useTheme();
  const gigs = nexusService.getMatchingGigs();
  const [, forceUpdate] = useState(0);

  const handleApply = (gigId: string) => {
    const result = nexusService.quickApply(gigId);
    if (result.success) {
      forceUpdate(prev => prev + 1);
      Alert.alert("Quick Apply", result.message);
    } else {
      Alert.alert("Already Applied", result.message);
    }
  };

  const isApplied = (gigId: string) => nexusService.hasApplied(gigId);

  return (
    <View style={{ marginTop: 8 }}>
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "#5533FF20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Radio size={18} color="#5533FF" />
          </View>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "600", color: theme.text }}>
              Gig Radar
            </Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>
              {gigs.length} opportunities match your skills
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#22c55e20",
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Zap size={12} color="#22c55e" />
          <Text style={{ fontSize: 12, color: "#22c55e", fontWeight: "600" }}>
            LIVE
          </Text>
        </View>
      </Animated.View>

      <Text
        style={{
          fontSize: 11,
          color: theme.textSecondary,
          marginBottom: 12,
          textAlign: "center",
        }}
      >
        Swipe right to quick apply
      </Text>

      {gigs.slice(0, 5).map((gig, index) => (
        <GigCard
          key={gig.id}
          gig={gig}
          index={index}
          onApply={handleApply}
          applied={isApplied(gig.id)}
        />
      ))}
    </View>
  );
}
