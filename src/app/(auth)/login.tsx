import { useState } from "react";
import { Pressable, Text, TextInput, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

import globalStyles from "@/style/globalStyles";
import { useUserStore } from "@/features/auth/useAuthStore";
import loginStyles from "@/features/auth/loginStyles";
import CtosText from "@/components/CtosText";

const locationRegx = /-?\d+\.\d+/m;

type Errors = { latitudeErr?: string; longitudeErr?: string };

export default function Login() {
  const updateUser = useUserStore((state) => state.updateUser);

  // controlled inputs replace <Form>, FormData and the refs
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  // replaces the web action(): validate, then log the user in
  const onSubmit = () => {
    const nextErrors: Errors = {};
    if (!locationRegx.test(latitude)) nextErrors.latitudeErr = "Invalid input";
    if (!locationRegx.test(longitude))
      nextErrors.longitudeErr = "Invalid input";
    setErrors(nextErrors);
    if (!name.trim() || Object.keys(nextErrors).length > 0) return;

    // the root layout's guard switches to the app screens once username is set
    updateUser(name.trim(), Number(latitude), Number(longitude));
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
    } catch (err: any) {
      Alert.alert("Couldn't get location", err?.message ?? "Unknown error");
    }
  };

  return (
    <SafeAreaView style={globalStyles.containerFull}>
      <View style={loginStyles.loginSection}>
        <View style={loginStyles.formWrap}>
          <View style={loginStyles.formIcon}>
            <Ionicons name="bulb-outline" size={32} />
          </View>
          <CtosText style={loginStyles.loginTitle}>Login</CtosText>

          <TextInput
            style={loginStyles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <View style={loginStyles.locationMainWrap}>
            <View style={loginStyles.locationGrpWrap}>
              <View>
                <TextInput
                  style={loginStyles.input}
                  placeholder="latitude"
                  value={latitude}
                  onChangeText={setLatitude}
                  keyboardType="numbers-and-punctuation"
                />
                {errors.latitudeErr && (
                  <Text style={loginStyles.errTxt}>{errors.latitudeErr}</Text>
                )}
              </View>
              <View>
                <TextInput
                  style={loginStyles.input}
                  placeholder="longitude"
                  value={longitude}
                  onChangeText={setLongitude}
                  keyboardType="numbers-and-punctuation"
                />
                {errors.longitudeErr && (
                  <Text style={loginStyles.errTxt}>{errors.longitudeErr}</Text>
                )}
              </View>
            </View>
            <Pressable style={loginStyles.locationBtn} onPress={grabLocation}>
              <Ionicons name="location-outline" size={32} />
            </Pressable>
          </View>

          <Pressable style={loginStyles.submitBtn} onPress={onSubmit}>
            <Text style={loginStyles.submitTxt}>Submit</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
