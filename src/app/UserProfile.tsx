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
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import loginStyles from "@/features/auth/loginStyles";
import { getCoords, isGitId, parseCoord } from "@/features/auth/profileFields";

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
import { APP_TAG } from "@/global/globalFunctions";

// only Android 14+ has the "Alarms & reminders" switch
const hasAlarmSetting =
  Platform.OS === "android" && Number(Platform.Version) >= 34;

type Errors = { name?: string; git?: string; lat?: string; lon?: string };

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
    if (!isGitId(newUserID)) {
      next.git = newUserID.trim()
        ? "Not a valid GitHub username"
        : "GitHub username is required";
    }
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
    const coords = await getCoords();
    if (!coords) return;
    setLatitude(String(coords.latitude));
    setLongitude(String(coords.longitude));
    setErrors((e) => ({ ...e, lat: undefined, lon: undefined }));
  };

  const tasksNNotificationPurge = () => {
    tasksPurge();
    cancelAll();
  };

  const purgeAllData = () => {
    gitInvalidate();
    weatherInvalidate();
    tasksNNotificationPurge();
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
            purgeAllData();
            logOutUser();
          },
        },
      ],
    );

  return (
    <CtosScreen nav>
      <View style={globalStyles.header}>
        <Text style={globalStyles.sectionLabel}>{`${APP_TAG}Main`}</Text>
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
              <>
                <TextInput
                  style={[
                    loginStyles.input,
                    !!errors.git && loginStyles.inputError,
                  ]}
                  placeholder="GitHub userID"
                  placeholderTextColor={Colors.textMuted}
                  value={newUserID}
                  onChangeText={setNewUserID}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <Err text={errors.git} />
              </>
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
                    color={Colors.textOnPrimary}
                  />
                  <Text style={globalStyles.primaryBtnTxt}>
                    Use my location
                  </Text>
                </Pressable>
              </>
            ) : (
              <View style={{ flexDirection: "row", gap: 24 }}>
                <Text style={globalStyles.sectionPara}>
                  LAT{" "}
                  <Text style={globalStyles.cardTitle}>
                    {location.latitude}
                  </Text>
                </Text>
                <Text style={globalStyles.sectionPara}>
                  LON{" "}
                  <Text style={globalStyles.cardTitle}>
                    {location.longitude}
                  </Text>
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

        <Panel title="Boot_Screen">
          <Row label="Boot Type">
            <Pressable style={globalStyles.primaryBtn}>
              <Text style={globalStyles.primaryBtnTxt}>Change Boot Screen</Text>
            </Pressable>
          </Row>
        </Panel>
        <Panel title="Backup_Data">
          <Row label="Export_Data">
            <Pressable style={globalStyles.primaryBtn}>
              <Text style={globalStyles.primaryBtnTxt}>Export Data</Text>
            </Pressable>
          </Row>
          <Row label="Import_Data">
            <Pressable style={globalStyles.primaryBtn}>
              <Text style={globalStyles.primaryBtnTxt}>Import Data</Text>
            </Pressable>
          </Row>
        </Panel>

        <Panel title="App_Build">
          <Row label="App_Version">
            <Text style={globalStyles.cardTitle}>
              v{Constants.expoConfig?.version ?? "1.0.0"}
            </Text>
          </Row>
        </Panel>

        <Panel title="Danger_Zone">
          <Pressable style={globalStyles.dangerBtn} onPress={tasksNNotificationPurge}>
            <Text style={globalStyles.primaryBtnTxt}>Clear all tasks</Text>
          </Pressable>
          <Pressable style={globalStyles.dangerBtn} onPress={purgeAllData}>
            <Text style={globalStyles.primaryBtnTxt}>Purge data</Text>
          </Pressable>
        </Panel>

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
