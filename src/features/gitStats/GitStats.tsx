import { ActivityIndicator, Pressable, Text, View } from "react-native";

// styles
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import gitStatsStyles from "./gitStatsStyles";
import { Ionicons } from "@expo/vector-icons";

import CtosText from "@/components/CtosText";
import Corners from "@/components/ctos/Corners";
import { useGitStats } from "./hooks/useGitStats";
import { openLink } from "../favLinks/utils/openLink";
import { dateFormat } from "@/global/globalFunctions";

const GitStats = () => {
  let { data, loading, error, storageTime, refetch } = useGitStats();

  if (!data) {
    return (
      <View style={[globalStyles.card, globalStyles.center]}>
        <Corners />
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <>
            <Text style={globalStyles.centerTxt}>
              {error ?? "Unable to find GitHub Profile"}
            </Text>
            <Pressable style={globalStyles.retryBtn} onPress={refetch}>
              <Text style={globalStyles.retryTxt}>Try again</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  const needsUpdate =
    data?.lastPushDate &&
    new Date(data.lastPushDate).getDate() < new Date().getDate();

  return (
    <View style={gitStatsStyles.cardBase}>
      <Pressable
        style={globalStyles.cardHead}
        onPress={() => openLink(data.html_url, data.html_url)}
      >
        <View>
          <CtosText style={globalStyles.cardTitle}>{"// Git Stats"}</CtosText>
        </View>
        <Ionicons
          name="expand-outline"
          size={20}
          color={Colors.textSecondary}
        />
      </Pressable>

      <View>
        <CtosText style={globalStyles.sectionTitle}>{data.login}</CtosText>

        <View style={globalStyles.divider}></View>

        <Text style={globalStyles.sectionLabel}>Repo Name</Text>
        <CtosText style={[globalStyles.sectionSubTitle, { marginVertical: 5 }]}>
          {data.lastPushedRepo?.name}
        </CtosText>

        <Text style={globalStyles.sectionLabel}>Last Update</Text>
        <CtosText style={[globalStyles.sectionSubTitle, { marginVertical: 5 }]}>
          {data?.lastPushDate &&
            dateFormat(data?.lastPushDate).replace(/\/|\-/g, ".")}
        </CtosText>

        <Text style={globalStyles.sectionLabel}>Needs Update</Text>
        <CtosText
          style={[
            globalStyles.sectionSubTitle,
            { marginVertical: 5 },
            needsUpdate
              ? { backgroundColor: Colors.danger }
              : { backgroundColor: Colors.primary },
          ]}
        >
          {needsUpdate ? "true" : "false"}
        </CtosText>
      </View>

      {storageTime ? (
        <Text style={globalStyles.expiry}>
          Expiry Time :{" "}
          {new Date(storageTime).toLocaleString(undefined, {
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      ) : null}
      <Corners />
    </View>
  );
};

export default GitStats;
