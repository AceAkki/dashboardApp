import { type Ref, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Image,
  StyleSheet,
  type ImageSourcePropType,
  type TextInputProps,
} from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import Panel from "@/components/ctos/Panel";
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import { useUserStore } from "@/features/auth/useAuthStore";
import loginStyles from "@/features/auth/loginStyles";
import { getCoords, isGitId, parseCoord } from "@/features/auth/profileFields";
import { appName } from "@/global/appInfo";

// The logo shown above the form. Set it to null to show the ">_" text instead.
// (A missing file is a build error, so it can't be "detected" while the app runs.)
const LOGO: ImageSourcePropType | null = require("../../../assets/images/icon.png");

type Errors = { name?: string; git?: string; lat?: string; lon?: string };

type FieldProps = Omit<TextInputProps, "style"> & {
  label: string;
  error?: string;
  valid?: boolean;
  ref?: Ref<TextInput>;
};

// label above, input, green tick when valid, red text under it when wrong
const Field = ({ label, error, valid, ref, ...rest }: FieldProps) => (
  <View style={loginStyles.fieldWrap}>
    <Text style={globalStyles.sectionLabel}>{label}</Text>
    <View>
      <TextInput
        ref={ref}
        style={[
          loginStyles.input,
          !!error && loginStyles.inputError,
          valid && loginStyles.inputPad,
        ]}
        placeholderTextColor={Colors.textMuted}
        {...rest}
      />
      {valid ? (
        <View style={loginStyles.checkWrap} pointerEvents="none">
          <Ionicons name="checkmark" size={18} color={Colors.primary} />
        </View>
      ) : null}
    </View>
    {error ? <Text style={loginStyles.errTxt}>{error}</Text> : null}
  </View>
);

export default function Login() {
  const updateUser = useUserStore((state) => state.updateUser);

  const [name, setName] = useState("");
  const [userID, setUserID] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [locating, setLocating] = useState(false);
  // true once the image fails to load: fall back to the text
  const [logoFailed, setLogoFailed] = useState(false);

  // Next on the keyboard moves down the form
  const gitRef = useRef<TextInput>(null);
  const latRef = useRef<TextInput>(null);
  const lonRef = useRef<TextInput>(null);

  // typing in a field clears that field's error
  const edit = (set: (v: string) => void, key: keyof Errors) => (v: string) => {
    set(v);
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = () => {
    const lat = parseCoord(latitude, 90);
    const lon = parseCoord(longitude, 180);
    const next: Errors = {};
    if (!name.trim()) next.name = "Enter your name";
    if (!isGitId(userID)) {
      next.git = userID.trim()
        ? "Not a valid GitHub username"
        : "GitHub username is required";
    }
    if (lat === null) next.lat = "Number from -90 to 90";
    if (lon === null) next.lon = "Number from -180 to 180";
    setErrors(next);
    if (Object.keys(next).length > 0 || lat === null || lon === null) return;

    // the root layout's guard switches to the app screens once username is set
    updateUser(name.trim(), lat, lon, userID.trim());
  };

  const grabLocation = async () => {
    if (locating) return; // a second tap while the first is still working
    setLocating(true);
    const coords = await getCoords();
    setLocating(false);
    if (!coords) return;
    setLatitude(String(coords.latitude));
    setLongitude(String(coords.longitude));
    setErrors((e) => ({ ...e, lat: undefined, lon: undefined }));
  };

  const showImage = LOGO !== null && !logoFailed;

  return (
    <CtosScreen style={globalStyles.containerFull}>
      <ScrollView
        contentContainerStyle={loginStyles.scroll}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <View style={loginStyles.brand}>
          <View style={[loginStyles.logoBox, showImage && globalStyles.box]}>
            {showImage ? (
              <Image
                source={LOGO}
                style={globalStyles.image}
                resizeMode="contain"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <Text style={loginStyles.logoTxt}>{">_"}</Text>
            )}
          </View>
          <CtosText style={loginStyles.loginTitle}>{appName}</CtosText>
          <Text style={globalStyles.sectionLabel}>
            {"// INITIALIZE OPERATOR"}
          </Text>
        </View>

        <Panel title="Operator Profile">
          <View style={loginStyles.form}>
            <Field
              label="NAME"
              placeholder="Your name"
              value={name}
              onChangeText={edit(setName, "name")}
              error={errors.name}
              valid={!!name.trim()}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => gitRef.current?.focus()}
            />

            <Field
              ref={gitRef}
              label="GIT_ID"
              placeholder="github username"
              value={userID}
              onChangeText={edit(setUserID, "git")}
              error={errors.git}
              valid={isGitId(userID)}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => latRef.current?.focus()}
            />

            <View style={loginStyles.coordRow}>
              <View style={loginStyles.coordCol}>
                <Field
                  ref={latRef}
                  label="LATITUDE"
                  placeholder="28.6139"
                  value={latitude}
                  onChangeText={edit(setLatitude, "lat")}
                  error={errors.lat}
                  valid={parseCoord(latitude, 90) !== null}
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                  onSubmitEditing={() => lonRef.current?.focus()}
                />
              </View>
              <View style={loginStyles.coordCol}>
                <Field
                  ref={lonRef}
                  label="LONGITUDE"
                  placeholder="77.2090"
                  value={longitude}
                  onChangeText={edit(setLongitude, "lon")}
                  error={errors.lon}
                  valid={parseCoord(longitude, 180) !== null}
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="done"
                  onSubmitEditing={onSubmit}
                />
              </View>
            </View>

            <Pressable
              style={loginStyles.locateBtn}
              onPress={grabLocation}
              disabled={locating}
              accessibilityRole="button"
              accessibilityLabel="Use my location"
            >
              {locating ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={Colors.primary}
                />
              )}
              <Text style={loginStyles.locateTxt}>
                {locating ? "LOCATING…" : "USE MY LOCATION"}
              </Text>
            </Pressable>
            <Text style={loginStyles.hint}>
              Used only for weather. Stays on this phone.
            </Text>

            <Pressable style={loginStyles.submitBtn} onPress={onSubmit}>
              <Text style={loginStyles.submitTxt}>INITIALIZE</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.textOnPrimary}
              />
            </Pressable>
          </View>
        </Panel>

        <View style={loginStyles.footer}>
          <Text style={loginStyles.footerTxt}>
            {`v${Constants.expoConfig?.version ?? "1.0.0"} · LOCAL STORAGE ONLY`}
          </Text>
          <Text style={loginStyles.footerOk}>[ OK ] SYSTEM READY</Text>
        </View>
      </ScrollView>
    </CtosScreen>
  );
}
