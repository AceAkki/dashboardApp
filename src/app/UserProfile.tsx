import { type ReactNode, useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Constants from "expo-constants";

import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import globalStyles, {
  hudDNG,
  spacing,
  text,
  glowDangerBase,
} from "@/style/globalStyles";

// components
import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";

// stores
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
import { useToolsStore } from "@/features/tools/hooks/useToolsStore";
import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";

// functions
import { getCoords, isGitId, parseCoord } from "@/features/auth/profileFields";
import { exportToClipboard, exportToFile, importBackup } from "@/global/backup";
import useNotifications from "@/global/useNotifications";
import { dateFormat } from "@/global/globalFunctions";
import { openExactAlarmSettings } from "@/global/exactAlarm";
import { APP_TAG } from "@/global/appInfo";
import { bootMap } from "@/global/bootMap";

// style
import loginStyles from "@/features/auth/loginStyles";
import Corners from "@/components/ctos/Corners";

// only Android 14+ has the "Alarms & reminders" switch
const hasAlarmSetting =
  Platform.OS === "android" && Number(Platform.Version) >= 34;

type Errors = { name?: string; git?: string; lat?: string; lon?: string };

// ───────────────────────────── small pieces ─────────────────────────────

// label on the left, value on the right, in an inset tile
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={[globalStyles.inset, s.infoRow]}>
    <Text style={globalStyles.textCaption}>{label}</Text>
    <Text style={[globalStyles.cardTitle, s.infoVal]} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

// big number + caption
const StatTile = ({ label, value }: { label: string; value: number }) => (
  <View style={[globalStyles.inset, s.stat]}>
    <Text style={globalStyles.textReadout}>{value}</Text>
    <Text style={globalStyles.textCaption}>{label}</Text>
  </View>
);

// a label, a hint line and the controls under it, inside an inset tile
const Block = ({
  label,
  style,
  hint,
  children,
}: {
  label: string;
  style?: StyleProp<ViewStyle>;
  hint?: string;
  children?: ReactNode;
}) => (
  <View style={[globalStyles.inset, s.block, style]}>
    <Text style={globalStyles.textCaption}>{label}</Text>
    {hint ? <Text style={s.hint}>{hint}</Text> : null}
    {children}
  </View>
);

const BtnRow = ({ children }: { children: ReactNode }) => (
  <View style={globalStyles.btnGrp}>{children}</View>
);

// filled = the main action, outlined = everything secondary
const Btn = ({
  label,
  onPress,
  outlined,
  danger,
  icon,
  flex,
}: {
  label: string;
  onPress: () => void;
  outlined?: boolean;
  danger?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  flex?: boolean;
}) => {
  const tone = danger ? Colors.danger : Colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        outlined
          ? [s.outBtn, { borderColor: tone }]
          : danger
            ? globalStyles.dangerBtn
            : globalStyles.primaryBtn,
        flex && { flex: 1 },
        s.btnRow,
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={outlined ? tone : Colors.textOnPrimary}
        />
      ) : null}
      <Text style={outlined ? [s.outTxt, { color: tone }] : s.btnTxt}>
        {label}
      </Text>
    </Pressable>
  );
};

const Err = ({ text: t }: { text?: string }) =>
  t ? <Text style={loginStyles.errTxt}>{t}</Text> : null;

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <View style={{ gap: 6 }}>
    <Text style={globalStyles.textCaption}>{label}</Text>
    {children}
  </View>
);

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
  } = useUserStore(
    useShallow((st) => ({
      username: st.username,
      userID: st.userID,
      location: st.location,
      logOutUser: st.logOutUser,
      updateUser: st.updateUser,
      BootOption: st.BootOption,
      updateBootOption: st.updateBootOption,
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
  const [name, setName] = useState(username);
  const [newUserID, setNewUserID] = useState(userID);
  const [bootName, setBootName] = useState<string>(BootOption);
  const [latitude, setLatitude] = useState(String(location.latitude));
  const [longitude, setLongitude] = useState(String(location.longitude));
  const [errors, setErrors] = useState<Errors>({});
  const [avatarFailed, setAvatarFailed] = useState(false);

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

  const purgeTasks = () => {
    tasksPurge();
    cancelAll();
  };

  const confirmPurgeTasks = () => {
    Alert.alert(
      "Delete all tasks?",
      "This deletes every task on this device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () =>
            Alert.alert(
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
    Alert.alert(
      "Reset tasks and cache?",
      "This deletes all tasks and the cached weather and GitHub data. Your profile, snippets and notes are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "Are you sure?",
              "The tasks can't be brought back unless you have a backup.",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: purgeAllData },
              ],
            ),
        },
      ],
    );
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
          title="Operator"
          right={
            isEditMode ? (
              <Text style={globalStyles.sectionLabel}>EDITING</Text>
            ) : (
              <Pressable
                onPress={startEdit}
                hitSlop={10}
                accessibilityLabel="Edit profile"
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={Colors.primary}
                />
              </Pressable>
            )
          }
        >
          {isEditMode ? (
            <View style={{ gap: 14 }}>
              <Field label="User_Name">
                <TextInput
                  style={[
                    loginStyles.input,
                    !!errors.name && loginStyles.inputError,
                  ]}
                  placeholder="Name"
                  placeholderTextColor={Colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
                <Err text={errors.name} />
              </Field>

              <Field label="Git_ID">
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
              </Field>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Field label="Latitude">
                    <TextInput
                      style={[
                        loginStyles.input,
                        !!errors.lat && loginStyles.inputError,
                      ]}
                      placeholder="28.61"
                      placeholderTextColor={Colors.textMuted}
                      value={latitude}
                      onChangeText={setLatitude}
                      keyboardType="numbers-and-punctuation"
                    />
                    <Err text={errors.lat} />
                  </Field>
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Longitude">
                    <TextInput
                      style={[
                        loginStyles.input,
                        !!errors.lon && loginStyles.inputError,
                      ]}
                      placeholder="77.20"
                      placeholderTextColor={Colors.textMuted}
                      value={longitude}
                      onChangeText={setLongitude}
                      keyboardType="numbers-and-punctuation"
                    />
                    <Err text={errors.lon} />
                  </Field>
                </View>
              </View>

              <Btn
                outlined
                icon="location-outline"
                label="Use my location"
                onPress={grabLocation}
              />

              <BtnRow>
                <Btn flex label="Save" onPress={save} />
                <Btn flex outlined label="Cancel" onPress={cancelEdit} />
              </BtnRow>
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
            <View style={s.status}>
              <View
                style={[
                  s.dot,
                  {
                    backgroundColor: gitStatData
                      ? Colors.success
                      : Colors.danger,
                  },
                ]}
              />
              <Text style={globalStyles.textCaption}>
                {gitStatData ? "CONNECTED" : "OFFLINE"}
              </Text>
            </View>
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
            <Btn
              outlined
              icon="refresh-outline"
              label="Refresh GitHub"
              onPress={gitInvalidate}
            />
          </View>
        </Panel>

        {/* data */}
        <Panel title="Data">
          <View style={{ gap: 8 }}>
            <Block
              label="BACKUP"
              hint="Tasks, snippets, notes, profile and Pomodoro count. Log Out and uninstalling erase them, so keep a copy somewhere safe."
            >
              <BtnRow>
                <Btn
                  flex
                  icon="download-outline"
                  label="Export File"
                  onPress={exportToFile}
                />
                <Btn outlined label="Copy" onPress={exportToClipboard} />
              </BtnRow>
              <BtnRow>
                <Btn
                  flex
                  icon="push-outline"
                  label="Import File"
                  onPress={() => importBackup("file")}
                />
                <Btn
                  outlined
                  label="Paste"
                  onPress={() => importBackup("clipboard")}
                />
              </BtnRow>
            </Block>

            <Block label="BOOT_SCREEN">
              <View style={s.chips}>
                {Object.keys(bootMap).map((key) => (
                  <Pressable
                    key={key}
                    style={[
                      globalStyles.chip,
                      bootName === key && globalStyles.chipActive,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: bootName === key }}
                    onPress={() => setBootName(key)}
                  >
                    <Text
                      style={[
                        globalStyles.textSmall,
                        bootName === key && { color: Colors.primary },
                      ]}
                    >
                      {key}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <BtnRow>
                {bootChanged ? (
                  <Btn
                    label="Use this boot screen"
                    onPress={() => updateBootOption(bootName)}
                  />

                ) : (
                  <Text style={globalStyles.textMuted}>ACTIVE: {BootOption}</Text>
                )}
              </BtnRow>
            </Block>
          </View>
        </Panel>

        {/* system */}
        {hasAlarmSetting ? (
          <Panel title="Reminders">
            <Text style={s.hint}>
              Allow "Alarms & reminders" so task reminders arrive on the minute,
              not a few minutes late.
            </Text>
            <View style={{ marginTop: spacing.md }}>
              <BtnRow>
                <Btn
                  flex
                  outlined
                  label="Open Settings"
                  onPress={() => openExactAlarmSettings()}
                />
                <Btn
                  flex
                  outlined
                  label="Test"
                  onPress={async () => {
                    await notify({
                      title: "Test",
                      body: "Testing notification",
                    });
                  }}
                />
              </BtnRow>
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
              label="PURGE_DATA"
              style={{ borderLeftColor: hudDNG.edge }}
              hint="Deletes tasks. Reset also clears the weather and GitHub cache."
            >
              <BtnRow>
                <Btn flex danger label="Tasks" onPress={confirmPurgeTasks} />
                <Btn flex danger label="Reset" onPress={confirmReset} />
              </BtnRow>
            </Block>
            <Block
              label="USER_SESSION"
              style={{ borderLeftColor: hudDNG.edge }}
              hint="Logging out also deletes your tasks."
            >
              <Btn danger outlined label="Log Out" onPress={confirmLogOut} />
            </Block>
          </View>
        </Panel>
      </ScrollView>
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
  stat: { flex: 1, paddingVertical: 10, paddingHorizontal: 10, gap: 2 },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: 10,
  },
  infoVal: { flexShrink: 1, textAlign: "right" },

  block: { padding: 10, gap: 8 },
  hint: { ...text.small, textTransform: "none", lineHeight: 17 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  status: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },

  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnTxt: { ...text.btn, fontSize: 12, letterSpacing: 2 },
  outBtn: { paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1 },
  outTxt: {
    fontFamily: Typography.primary_bold,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
