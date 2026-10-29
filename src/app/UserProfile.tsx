import { useShallow } from "zustand/shallow";
import { Pressable, Text, View, useWindowDimensions } from "react-native";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";

import globalStyles from "@/style/globalStyles";

import { useUserStore } from "@/features/auth/useAuthStore";
import {
  useGitStore,
  type GitStore,
} from "@/features/gitStats/hooks/useGitStore";
import {
  useWeatherStore,
  type WeatherStore,
} from "@/features/weather/hooks/useWeatherStore";
import {
  useTaskStore,
  type TaskStore,
} from "@/features/tasks/hooks/useTasksStore";

const UserProfile = () => {
  const { username, userID, location, logOutUser } = useUserStore(
    useShallow((s) => ({
      username: s.username,
      userID: s.userID,
      location: s.location,
      logOutUser: s.logOutUser,
    })),
  );

  const gitInvalidate = useGitStore((state: GitStore) => state.invalidate);
  const weatherInvalidate = useWeatherStore(
    (state: WeatherStore) => state.invalidate,
  );
  const tasksPurge = useTaskStore((state: TaskStore) => state.clearAllTasks);
  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
        <Text style={globalStyles.sectionLabel}>{"// CTOS · Main"}</Text>
        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}>USER PROFILE</CtosText>
        </View>
      </View>

      <View style={{ margin: 18 }}>
        <Panel title="User Details" style={{gap:20}}>
          <View>
            <Text style={globalStyles.sectionLabel}>User_Name</Text>
            <Text style={globalStyles.cardTitle}>{username}</Text>

            <View style={globalStyles.divider}></View>

            <Text style={globalStyles.sectionLabel}>Git_ID</Text>
            <Text style={globalStyles.cardTitle}>{userID}</Text>

            <View style={globalStyles.divider}></View>

            <Text style={globalStyles.sectionLabel}>Coordinates</Text>
            <Text style={globalStyles.sectionPara}>
              Latitude  <Text style={globalStyles.cardTitle}> {location.latitude} </Text>
            </Text>
            <Text style={globalStyles.sectionPara}>
              Longitude <Text style={globalStyles.cardTitle}> {location.longitude} </Text>
            </Text>
           
          </View>

          <View style={{gap:10, flexDirection:"row"}}>
            <Pressable style={globalStyles.primaryBtn} onPress={() => console.info("Yup")}>
              <Text style={globalStyles.primaryBtnTxt}>Edit</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                gitInvalidate();
                weatherInvalidate();
                tasksPurge();
                logOutUser();
              }}
              style={globalStyles.dangerBtn}
            >
              <Text style={globalStyles.primaryBtnTxt}>Log Out</Text>
            </Pressable>
          </View>
        </Panel>
      </View>
    </CtosScreen>
  );
};

export default UserProfile;
