import { type ReactNode, useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import loginStyles from "@/features/auth/loginStyles";

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
import useNotifications from "@/global/useNotifications";
import { openExactAlarmSettings } from "@/global/exactAlarm";

// only Android 14+ has the "Alarms & reminders" switch
const hasAlarmSetting =
  Platform.OS === "android" && Number(Platform.Version) >= 34;

// a plain decimal number inside its allowed range, or null
const parseCoord = (text: string, limit: number) => {
  const t = text.trim();
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  const n = Number(t);
  return Math.abs(n) <= limit ? n : null;
};

type Errors = { name?: string; lat?: string; lon?: string };

// one label + value (or input) with a divider under it
const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <View style={{ marginVertical: 5 }}>
    <View style={{ gap: 8 }}>
      <Text style={globalStyles.sectionLabel}>{label}</Text>
      {children}
    </View>
    <View style={globalStyles.divider} />
  </View>
);

const Err = ({ text }: { text?: string }) =>
  text ? <Text style={loginStyles.errTxt}>{text}</Text> : null;

const UserProfile = () => {
  const { username, userID, location, logOutUser, updateUser } = useUserStore(
    useShallow((s) => ({
      username: s.username,
      userID: s.userID,
      location: s.location,
      logOutUser: s.logOutUser,
      updateUser: s.updateUser,
    })),
  );
  const gitInvalidate = useGitStore((state: GitStore) => state.invalidate);
  const weatherInvalidate = useWeatherStore(
    (state: WeatherStore) => state.invalidate,
  );
  const tasksPurge = useTaskStore((state: TaskStore) => state.clearAllTasks);
  const { cancelAll } = useNotifications();

  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState(username);
  const [newUserID, setNewUserID] = useState(userID);
  const [latitude, setLatitude] = useState(String(location.latitude));
  const [longitude, setLongitude] = useState(String(location.longitude));
  const [errors, setErrors] = useState<Errors>({});

  // every time editing starts, the fields show what is saved right now
  const startEdit = () => {
    setName(username);
    setNewUserID(userID);
    setLatitude(String(location.latitude));
    setLongitude(String(location.longitude));
    setErrors({});
    setIsEditMode(true);
  };

  const cancelEdit = () => {
    setErrors({});
    setIsEditMode(false);
  };

  const save = () => {
    const lat = parseCoord(latitude, 90);
    const lon = parseCoord(longitude, 180);
    const next: Errors = {};
    if (!name.trim()) next.name = "Name can't be empty";
    if (lat === null) next.lat = "Number from -90 to 90";
    if (lon === null) next.lon = "Number from -180 to 180";
    setErrors(next);
    // stay in edit mode so the user can fix it
    if (Object.keys(next).length > 0 || lat === null || lon === null) return;

    const id = newUserID.trim();
    const moved = lat !== location.latitude || lon !== location.longitude;
    updateUser(name.trim(), lat, lon, id);
    // cached weather / git data belongs to the old place and account
    if (moved) weatherInvalidate();
    if (id !== userID) gitInvalidate();
    setIsEditMode(false);
  };

  const grabLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Allow location access or type your coordinates.",
        );
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setLatitude(String(coords.latitude));
      setLongitude(String(coords.longitude));
      setErrors((e) => ({ ...e, lat: undefined, lon: undefined }));
    } catch (err: any) {
      Alert.alert("Couldn't get location", err?.message ?? "Unknown error");
    }
  };

  // logging out wipes the tasks on this phone, so ask first
  const confirmLogOut = () =>
    Alert.alert(
      "Log out?",
      "This deletes all tasks and reminders on this phone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log out",
          style: "destructive",
          onPress: () => {
            gitInvalidate();
            weatherInvalidate();
            tasksPurge();
            cancelAll();
            logOutUser();
          },
        },
      ],
    );

  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
        <Text style={globalStyles.sectionLabel}>{"// CTOS · Main"}</Text>
        <View style={[globalStyles.cardHead, { marginTop: 6 }]}>
          <CtosText style={globalStyles.textHeading}>USER PROFILE</CtosText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 18, gap: 18 }}
        keyboardShouldPersistTaps="handled"
      >
        <Panel
          title="User Details"
          right={
            isEditMode ? (
              <Text style={globalStyles.sectionLabel}>EDITING</Text>
            ) : null
          }
        >
          <Row label="User_Name">
            {isEditMode ? (
              <>
                <TextInput
                  style={loginStyles.input}
                  placeholder="Name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                <Err text={errors.name} />
              </>
            ) : (
              <Text style={globalStyles.cardTitle}>{username}</Text>
            )}
          </Row>

          <Row label="Git_ID">
            {isEditMode ? (
              <TextInput
                style={loginStyles.input}
                placeholder="GitHub userID"
                placeholderTextColor={Colors.textMuted}
                value={newUserID}
                onChangeText={setNewUserID}
                autoCapitalize="none"
                autoCorrect={false}
              />
            ) : (
              <Text style={globalStyles.cardTitle}>{userID || "—"}</Text>
            )}
          </Row>

          <Row label="Coordinates">
            {isEditMode ? (
              <>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={globalStyles.sectionPara}>Latitude</Text>
                    <TextInput
                      style={loginStyles.input}
                      placeholder="28.61"
                      placeholderTextColor={Colors.textMuted}
                      value={latitude}
                      onChangeText={setLatitude}
                      keyboardType="numbers-and-punctuation"
                    />
                    <Err text={errors.lat} />
                  </View>
                  <View style={{ flex: 1, gap: 6 }}>
                    <Text style={globalStyles.sectionPara}>Longitude</Text>
                    <TextInput
                      style={loginStyles.input}
                      placeholder="77.20"
                      placeholderTextColor={Colors.textMuted}
                      value={longitude}
                      onChangeText={setLongitude}
                      keyboardType="numbers-and-punctuation"
                    />
                    <Err text={errors.lon} />
                  </View>
                </View>
                <Pressable
                  style={[globalStyles.primaryBtn, loginStyles.locationBtn]}
                  onPress={grabLocation}
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={Colors.textPrimary}
                  />
                  <Text style={globalStyles.primaryBtnTxt}>Use my location</Text>
                </Pressable>
              </>
            ) : (
              <View style={{ flexDirection: "row", gap: 24 }}>
                <Text style={globalStyles.sectionPara}>
                  LAT{" "}
                  <Text style={globalStyles.cardTitle}>{location.latitude}</Text>
                </Text>
                <Text style={globalStyles.sectionPara}>
                  LON{" "}
                  <Text style={globalStyles.cardTitle}>{location.longitude}</Text>
                </Text>
              </View>
            )}
          </Row>

          <View style={[globalStyles.btnGrp, { marginTop: 10 }]}>
            {isEditMode ? (
              <>
                <Pressable
                  style={[globalStyles.primaryBtn, { flex: 1 }]}
                  onPress={save}
                >
                  <Text style={globalStyles.primaryBtnTxt}>Save</Text>
                </Pressable>
                <Pressable
                  style={[globalStyles.primaryBtn, { flex: 1 }]}
                  onPress={cancelEdit}
                >
                  <Text style={globalStyles.primaryBtnTxt}>Cancel</Text>
                </Pressable>
              </>
            ) : (
              <Pressable
                style={[globalStyles.primaryBtn, { flex: 1 }]}
                onPress={startEdit}
              >
                <Text style={globalStyles.primaryBtnTxt}>Edit</Text>
              </Pressable>
            )}
          </View>
        </Panel>

        {hasAlarmSetting ? (
          <Panel title="Reminders">
            <Text style={globalStyles.sectionPara}>
              Allow "Alarms & reminders" so task reminders arrive on the minute,
              not a few minutes late.
            </Text>
            <Pressable
              style={[globalStyles.primaryBtn, { marginTop: 12 }]}
              onPress={() => openExactAlarmSettings()}
            >
              <Text style={globalStyles.primaryBtnTxt}>Open Settings</Text>
            </Pressable>
          </Panel>
        ) : null}

        <Panel title="Session">
          <Pressable style={globalStyles.dangerBtn} onPress={confirmLogOut}>
            <Text style={globalStyles.primaryBtnTxt}>Log Out</Text>
          </Pressable>
        </Panel>
      </ScrollView>
    </CtosScreen>
  );
};

export default UserProfile;
