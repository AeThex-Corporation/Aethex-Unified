import { View, Text, Pressable } from "react-native";
import { 
  Timer, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  Kanban,
  Target,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { nexusService } from "@/services/nexusService";
import { useTheme } from "@/store/appStore";

export default function SprintCountdown() {
  const theme = useTheme();
  const sprint = nexusService.getActiveSprint();
  const progress = nexusService.getSprintProgress();

  if (!sprint) {
    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={{
          backgroundColor: "#1a1a24",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#2d2d3a",
          alignItems: "center",
        }}
      >
        <Timer size={32} color={theme.textSecondary} />
        <Text style={{ color: theme.textSecondary, marginTop: 12, fontSize: 15 }}>
          No active sprint
        </Text>
        <Text style={{ color: theme.textSecondary, fontSize: 13, marginTop: 4 }}>
          Start a new GameForge project to begin
        </Text>
      </Animated.View>
    );
  }

  const statusColor = sprint.status === "active" 
    ? progress.isOnTrack ? "#22c55e" : "#f59e0b"
    : sprint.status === "at_risk" ? "#ef4444" : "#22c55e";

  const killGateColor = sprint.killGatePassed ? "#22c55e" : "#f59e0b";

  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      style={{ marginBottom: 20 }}
    >
      <View
        style={{
          backgroundColor: "#0f172a",
          borderRadius: 20,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: statusColor + "40",
        }}
      >
        <View
          style={{
            backgroundColor: statusColor,
            paddingVertical: 8,
            paddingHorizontal: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Timer size={16} color="#020817" />
          <Text style={{ color: "#020817", fontWeight: "700", fontSize: 14 }}>
            GAMEFORGE SPRINT
          </Text>
        </View>

        <View style={{ padding: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 4 }}>
                Active Project
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "700", color: theme.text }}>
                {sprint.projectName}
              </Text>
            </View>
            <Pressable
              onPress={() => {
                Haptics.selectionAsync();
              }}
              style={{
                backgroundColor: "#5533FF20",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Kanban size={16} color="#5533FF" />
              <Text style={{ color: "#5533FF", fontWeight: "600", fontSize: 13 }}>
                Board
              </Text>
            </Pressable>
          </View>

          <View
            style={{
              backgroundColor: "#1a1a24",
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 48, fontWeight: "800", color: statusColor }}>
              {sprint.dayNumber}
            </Text>
            <Text style={{ fontSize: 16, color: theme.textSecondary, marginTop: 4 }}>
              of {sprint.totalDays} days
            </Text>
            
            <View
              style={{
                width: "100%",
                height: 8,
                backgroundColor: "#2d2d3a",
                borderRadius: 4,
                marginTop: 16,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${progress.percentage}%`,
                  height: "100%",
                  backgroundColor: statusColor,
                  borderRadius: 4,
                }}
              />
            </View>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%", marginTop: 8 }}>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                {progress.percentage}% complete
              </Text>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                {progress.daysRemaining} days left
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: killGateColor + "15",
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: killGateColor + "30",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {sprint.killGatePassed ? (
                  <CheckCircle2 size={18} color={killGateColor} />
                ) : (
                  <AlertTriangle size={18} color={killGateColor} />
                )}
                <Text style={{ fontSize: 13, fontWeight: "600", color: killGateColor }}>
                  Kill-Gate
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 4 }}>
                {sprint.killGatePassed 
                  ? `Passed on Day ${sprint.killGateDay}` 
                  : `Day ${sprint.killGateDay} checkpoint`
                }
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: progress.isOnTrack ? "#22c55e15" : "#f59e0b15",
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: progress.isOnTrack ? "#22c55e30" : "#f59e0b30",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <TrendingUp size={18} color={progress.isOnTrack ? "#22c55e" : "#f59e0b"} />
                <Text style={{ fontSize: 13, fontWeight: "600", color: progress.isOnTrack ? "#22c55e" : "#f59e0b" }}>
                  Hours
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: theme.textSecondary, marginTop: 4 }}>
                {sprint.hoursLogged}/{sprint.hoursTarget}h logged
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#5533FF15",
              borderRadius: 12,
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Target size={18} color="#5533FF" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                Next Milestone
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#5533FF" }}>
                {sprint.nextMilestone}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
