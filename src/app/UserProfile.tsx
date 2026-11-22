import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import Constants from "expo-constants";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import globalStyles, {
  hudDNG,
  spacing,
  glowDangerBase,
} from "@/style/globalStyles";

// components
import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";
import CtosPressable from "@/components/ctos/CtosPressable";
import Block from "@/components/ctos/Block";
import Button from "@/components/ctos/Button";
import ButtonRow from "@/components/ctos/ButtonRow";
import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import Field from "@/components/ctos/Field";
import Hint from "@/components/ctos/Hint";
import InfoRow from "@/components/ctos/InfoRow";
import StatTile from "@/components/ctos/StatTile";
import Status from "@/components/ctos/Status";
import Corners from "@/components/ctos/Corners";

// stores
import { useUserStore, BackupType } from "@/features/auth/useAuthStore";
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
import { useToolsStore } from "@/features/tools/hooks/useToolsStore";
import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";

// functions
import { getCoords, isGitId, parseCoord } from "@/features/auth/profileFields";
import { ctosAlert, ctosPrompt } from "@/global/ctosAlert";
import { DAY, exportToClipboard, exportToFile, importBackup } from "@/global/backup";
import { dateFormat } from "@/global/globalFunctions";
import { openExactAlarmSettings } from "@/global/exactAlarm";
import { APP_TAG } from "@/global/appInfo";
import { feedback } from "@/hooks/useFeedback";
import { bootMap } from "@/global/bootMap";

import BackUpPickerSheet from "@/components/ctos/BackupPickerSheet"

// hooks
import useNotifications from "@/hooks/useNotifications";
import { useSettingsStore } from "@/hooks/useSettingsStore";


// style
import loginStyles from "@/features/auth/loginStyles";

// only Android 14+ has the "Alarms & reminders" switch
const hasAlarmSetting =
  Platform.OS === "android" && Number(Platform.Version) >= 34;

type Errors = { name?: string; git?: string; lat?: string; lon?: string };

// ───────────────────────────── screen ─────────────────────────────

const UserProfile = () => {
  const {
    username,
    userID,
    location,
    logOutUser,
    updateUser,
    BootOption,
    updateBootOption,
    updateLastBackup,
    lastBackup,
    currentBackupType,
    updateBackupType,
    backupEvery,
    updateBackupEvery,
    rewindEvery
  } = useUserStore(
    useShallow((st) => ({
      username: st.username,
      userID: st.userID,
      location: st.location,
      logOutUser: st.logOutUser,
      updateUser: st.updateUser,
      BootOption: st.BootOption,
      updateBootOption: st.updateBootOption,
      lastBackup:st.lastBackup, 
      updateLastBackup:st.updateLastBackup,
      currentBackupType:st.currentBackupType,
      updateBackupType:st.updateBackupType,
      backupEvery:st.backupEvery, 
      updateBackupEvery:st.updateBackupEvery,
      rewindEvery:st.rewindEvery
    })),
  );
  const { gitStatData, fetchTime, expiresAt, gitInvalidate } = useGitStore(
    useShallow((state: GitStore) => ({
      gitInvalidate: state.invalidate,
      fetchTime: state.fetchedAt,
      expiresAt: state.expiresAt,
      gitStatData: state.gitStatData,
    })),
  );
  const weatherInvalidate = useWeatherStore(
    (state: WeatherStore) => state.invalidate,
  );
  const snippetCount = useToolsStore((st) => st.snippets.length);
  const sessions = usePomodoroStore((st) => st.completedSessions);
  const { tasks, tasksPurge } = useTaskStore(
    useShallow((state: TaskStore) => ({
      tasksPurge: state.clearAllTasks,
      tasks: state.tasks,
    })),
  );
  const { notify, cancelAll } = useNotifications();

  const [isEditMode, setIsEditMode] = useState(false);
  const [pulse, setPulse] = useState(0); // flashes the Operator panel corners after a save
  const haptics = useSettingsStore((st) => st.haptics);
  const setHaptics = useSettingsStore((st) => st.setHaptics);
  const [name, setName] = useState(username);
  const [newUserID, setNewUserID] = useState(userID);
  const [bootName, setBootName] = useState<string>(BootOption);
  const [latitude, setLatitude] = useState(String(location.latitude));
  const [longitude, setLongitude] = useState(String(location.longitude));
  const [errors, setErrors] = useState<Errors>({});
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [isEditingBackup, setIsEditingBackup] = useState(false);

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
    if (Object.keys(next).length > 0 || lat === null || lon === null) {
      feedback.error("CHECK THE FIELDS");
      return;
    }

    const id = newUserID.trim();
    const moved = lat !== location.latitude || lon !== location.longitude;
    updateUser(name.trim(), lat, lon, id);
    // cached weather / git data belongs to the old place and account
    if (moved) weatherInvalidate();
    if (id !== userID) gitInvalidate();
    setIsEditMode(false);
    setPulse((p) => p + 1);
    feedback.success("PROFILE SAVED");
  };

  const grabLocation = async () => {
    const coords = await getCoords();
    if (!coords) return;
    setLatitude(String(coords.latitude));
    setLongitude(String(coords.longitude));
    setErrors((e) => ({ ...e, lat: undefined, lon: undefined }));
  };

  const purgeTasks = () => {
    tasksPurge();
    cancelAll();
    feedback.warn("TASKS DELETED");
  };

  const confirmPurgeTasks = () => {
    feedback.warn();
    ctosAlert(
      "Delete all tasks?",
      "This deletes every task on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () =>
            ctosAlert(
              "Are you sure?",
              "This can't be undone. Export a backup first if you might need them.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete tasks",
                  style: "destructive",
                  onPress: purgeTasks,
                },
              ],
            ),
        },
      ],
    );
  };

  // tasks and cached weather / GitHub data. Profile, snippets and notes stay.
  const purgeAllData = () => {
    gitInvalidate();
    weatherInvalidate();
    purgeTasks();
  };

  const confirmReset = () => {
    feedback.warn();
    ctosAlert(
      "Reset tasks and cache?",
      "This deletes all tasks and the cached weather and GitHub data. Your profile, snippets and notes are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: async () =>
           {
            const ok = await ctosPrompt("Delete tasks and cache?", "Type DELETE to confirm.", {
            destructive: true,
            okText: "Delete",
            validate: (t) => (t === "DELETE" ? undefined : "Type DELETE exactly"),
            });
            if (ok !== null) purgeAllData();
           }
        },
      ],
    );
  };

  // logging out wipes the tasks on this phone, so ask first
  const confirmLogOut = () =>
    ctosAlert(
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

  const avatar = gitStatData?.avatar_url;
  const bootChanged = bootName !== BootOption;

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
        automaticallyAdjustKeyboardInsets
      >
        {/* identity */}
        <Panel>
          <View style={s.idRow}>
            <View style={s.avatar}>
              {avatar && !avatarFailed ? (
                <>
                <Image
                  source={{ uri: avatar }}
                  style={s.avatarImg}
                  onError={() => setAvatarFailed(true)}
                />
                <Corners />
                
                </>
              ) : (
                <Text style={loginStyles.logoTxt}>
                  {(username.trim()[0] ?? ">").toUpperCase()}
                </Text>
              )}
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <CtosText style={globalStyles.textTitle}>
                {username || "—"}
              </CtosText>
              <Text style={[globalStyles.textSmall, { color: Colors.primary }]}>
                {userID ? `@${userID}` : "no github id"}
              </Text>
              <Text style={globalStyles.textMuted}>
                v{Constants.expoConfig?.version ?? "1.0.0"}
              </Text>
            </View>
          </View>
          <View style={s.statRow}>
            <StatTile label="TASKS" value={tasks.length} />
            <StatTile label="SNIPPETS" value={snippetCount} />
            <StatTile label="SESSIONS" value={sessions} />
          </View>
        </Panel>

        {/* details */}
        <Panel
          pulseKey={pulse}
          title="Operator"
          right={
            isEditMode ? (
              <Text style={globalStyles.sectionLabel}>EDITING</Text>
            ) : (
              <CtosPressable
                pressedStyle={{ opacity: 0.5 }}
                onPress={startEdit}
                hitSlop={10}
                accessibilityLabel="Edit profile"
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={Colors.primary}
                />
              </CtosPressable>
            )
          }
        >
          {isEditMode ? (
            <View style={{ gap: 14 }}>
              <Field
                label="User_Name"
                error={errors.name}
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />

              <Field
                label="Git_ID"
                error={errors.git}
                placeholder="GitHub userID"
                value={newUserID}
                onChangeText={setNewUserID}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <View style={s.pair}>
                <View style={s.flex}>
                  <Field
                    label="Latitude"
                    error={errors.lat}
                    placeholder="28.61"
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
                <View style={s.flex}>
                  <Field
                    label="Longitude"
                    error={errors.lon}
                    placeholder="77.20"
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType="numbers-and-punctuation"
                  />
                </View>
              </View>

              <Button variant="secondary" icon="location-outline" label="Use my location"
                onPress={grabLocation} />

              <ButtonRow>
                <Button style={s.flex} label="Save" onPress={save} />
                <Button variant="secondary" style={s.flex} label="Cancel" onPress={cancelEdit} />
              </ButtonRow>
            </View>
          ) : (
            <View style={{ gap: 6 }}>
              <InfoRow label="NAME" value={username || "—"} />
              <InfoRow label="GIT_ID" value={userID || "—"} />
              <InfoRow label="LATITUDE" value={String(location.latitude)} />
              <InfoRow label="LONGITUDE" value={String(location.longitude)} />
            </View>
          )}
        </Panel>

        {/* github */}
        <Panel
          title="Github"
          right={
            <Status tone={gitStatData ? "ok" : "err"}>
              {gitStatData ? "CONNECTED" : "OFFLINE"}
            </Status>
          }
        >
          <View style={{ gap: 6 }}>
            <InfoRow
              label="LAST_FETCH"
              value={
                fetchTime
                  ? dateFormat({ dateString: fetchTime, hasTime: true })
                  : "-"
              }
            />
            <InfoRow
              label="EXPIRES"
              value={
                expiresAt
                  ? dateFormat({ dateString: expiresAt, hasTime: true })
                  : "-"
              }
            />
          </View>
          <View style={{ marginTop: spacing.md }}>
            <Button variant="secondary" icon="refresh-outline" label="Refresh GitHub"
              onPress={gitInvalidate} />
          </View>
        </Panel>

        {/* data */}
        <Panel title="Data and Boot">
          <View style={{ gap: 8 }}>
            <Block
              title="BACKUP"
              hint="Tasks, snippets, notes, profile and Pomodoro count. Log Out and uninstalling erase them, so keep a copy somewhere safe."
            >
              <ButtonRow>
                <Button icon="download-outline" style={s.flex} label="Export File"
                  onPress={() => {
                    exportToFile();
                    updateLastBackup(new Date().toString());
                  }} />
                <Button variant="secondary" label="Copy" doneLabel="Copied" onPress={exportToClipboard} />
              </ButtonRow>
              <ButtonRow>
                <Button icon="push-outline" style={s.flex} label="Import File"
                  onPress={() => importBackup("file")} />
                <Button variant="secondary" label="Paste"
                  onPress={() => importBackup("clipboard")} />
              </ButtonRow>
            </Block>

            <Block title="Last_BackUp" hint="Backup Details">
              <InfoRow
                label="LAST_BACKUP_TIME"
                value={lastBackup ? lastBackup : "NO BACKUP"}
              />
              <InfoRow
                label="BACKUP_EVERY"
                value={`${backupEvery / BackupType[currentBackupType]} ${currentBackupType}`}
              />
            
            </Block>

            <Block title="Update Backup Duration" hint="Backup by either Hour or Day">

               <ButtonRow>
                <Button icon="hourglass-outline" style={s.flex} label="Hour"
                  onPress={() => {
                    updateBackupType("Hour");   
                    setIsEditingBackup(true);
                  }} />
                <Button icon="timer-outline" style={s.flex} label="Day"
                  onPress={() => {
                    updateBackupType("Day");   
                    setIsEditingBackup(true);
                  }} />
              </ButtonRow>

            </Block>


            <Block title="BOOT_SCREEN">
              <ChipRow>
                {Object.keys(bootMap).map((key) => (
                  <Chip
                    key={key}
                    label={key}
                    selected={bootName === key}
                    onPress={() => setBootName(key)}
                  />
                ))}
              </ChipRow>

              <ButtonRow>
                {bootChanged ? (
                  <Button label="Use this boot screen"
                    onPress={() => {
                  updateBootOption(bootName);
                  feedback.success("BOOT SCREEN SET");
                }} />

                ) : (
                  <Text style={globalStyles.textMuted}>ACTIVE: {BootOption}</Text>
                )}
              </ButtonRow>
            </Block>
          </View>
        </Panel>

        {/* feedback */}
        <Panel title="Feedback">
          <Block
            title="HAPTICS"
            hint="Short vibrations on taps and results. Turn it off to save battery."
          >
            <View style={s.switchRow}>
              <Text style={globalStyles.textSmall}>{haptics ? "ON" : "OFF"}</Text>
              <Switch
                value={haptics}
                onValueChange={(on) => {
                  setHaptics(on);
                  if (on) feedback.tap(); // a sample, so you feel what it does
                }}
                trackColor={{ false: Colors.secondary, true: "#00E5FF55" }}
                thumbColor={haptics ? Colors.primary : Colors.textMuted}
                accessibilityLabel="Haptics"
              />
            </View>
          </Block>
        </Panel>

        {/* system */}
        {hasAlarmSetting ? (
          <Panel title="Reminders">
            <Hint>
              Allow "Alarms & reminders" so task reminders arrive on the minute,
              not a few minutes late.
            </Hint>
            <View style={{ marginTop: spacing.md }}>
              <ButtonRow>
                <Button variant="secondary" style={s.flex} label="Open Settings"
                  onPress={() => openExactAlarmSettings()} />
                <Button variant="secondary" style={s.flex} label="Test"
                  onPress={async () => {
                    await notify({
                      title: "Test",
                      body: "Testing notification",
                    });
                  }} />
              </ButtonRow>
            </View>
          </Panel>
        ) : null}

        {/* danger */}
        <Panel
          title="Danger_Zone"
          style={{ borderTopColor: Colors.danger, ...glowDangerBase }}
          titleStyle={{ color: Colors.danger }}
          isDanger={true}
        >
          <View style={{ gap: 8 }}>
            <Block
              title="PURGE_DATA"
              style={{ borderLeftColor: hudDNG.edge }}
              hint="Deletes tasks. Reset also clears the weather and GitHub cache."
            >
              <ButtonRow>
                <Button variant="danger" style={s.flex} label="Tasks" onPress={confirmPurgeTasks} />
                <Button variant="danger" style={s.flex} label="Reset" onPress={confirmReset} />
              </ButtonRow>
            </Block>
            <Block
              title="USER_SESSION"
              style={{ borderLeftColor: hudDNG.edge }}
              hint="Logging out also deletes your tasks."
            >
              <Button variant="dangerLine" label="Log Out" onPress={confirmLogOut} />
            </Block>
          </View>
        </Panel>
      </ScrollView>
      {
        isEditingBackup && 
        <BackUpPickerSheet  
          onCancel={() => setIsEditingBackup(false)}
          onSet={(h) => {
            updateBackupEvery(h * BackupType[currentBackupType]);
            setIsEditingBackup(false);
          }}/>
      }
    </CtosScreen>
  );
};

export default UserProfile;

const s = StyleSheet.create({
  idRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.secondarySoft,
    backgroundColor: Colors.secondarySoft,
    overflow: "hidden",
  },
  avatarImg: { width: "100%", height: "100%" },
  statRow: { flexDirection: "row", gap: 8, marginTop: spacing.lg },
  flex: { flex: 1 },
  pair: { flexDirection: "row", gap: 10 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
