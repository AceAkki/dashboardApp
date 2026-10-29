import CtosScreen from "@/components/ctos/CtosScreen";
import { useShallow } from "zustand/shallow";

import globalStyles from "@/style/globalStyles";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useUserStore } from "@/features/auth/useAuthStore";
import { useGitStore, type GitStore } from "@/features/gitStats/hooks/useGitStore";
import { useWeatherStore, type WeatherStore } from "@/features/weather/hooks/useWeatherStore";
import { useTaskStore, type TaskStore } from "@/features/tasks/hooks/useTasksStore";

const UserProfile = () => {
  const { username, location, logOutUser } = useUserStore(
    useShallow((s) => ({
      username: s.username,
      location: s.location,
      logOutUser: s.logOutUser,
    })),
  );

  const gitInvalidate = useGitStore((state:GitStore) => state.invalidate)
  const weatherInvalidate = useWeatherStore((state:WeatherStore) => state.invalidate)
  const tasksPurge = useTaskStore((state:TaskStore) => state.clearAllTasks)
  return (
    <CtosScreen style={globalStyles.screen}>
      <View>
        <Text style={globalStyles.cardTitle}>{username}</Text>
        <Text style={globalStyles.cardTitle}>
          {location.latitude}, {location.longitude}
        </Text>
        <Pressable onPress={() =>{
            gitInvalidate();
            weatherInvalidate();
            tasksPurge();
            logOutUser();
        }} style={globalStyles.primaryBtn}>
          <Text style={globalStyles.primaryBtnTxt}>Log Out</Text>
        </Pressable>
      </View>
    </CtosScreen>
  );
};

export default UserProfile;
