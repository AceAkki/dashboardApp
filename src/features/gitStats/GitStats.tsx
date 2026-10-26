import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useGitStats } from "./hooks/useGitStats";
import { Ionicons } from "@expo/vector-icons";
import CtosText from "@/components/CtosText";
import { dateFormat } from "@/global/globalFunctions";
import { Colors } from "@/constants/Colors";
import gitStatsStyles from "./gitStatsStyles";
import globalStyles from "@/style/globalStyles";
import { openLink } from "../favLinks/utils/openLink";

const GitStats = () => {
  let { data, loading, error, storageTime, refetch } = useGitStats();
  console.log(error);
  console.log(loading);
  console.log(data, "data");

  if (!data) {
    return (
      <View style={[globalStyles.card, globalStyles.center]}>
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

  console.log(data.lastPushDate, Date.now());
  return (
    <View style={[gitStatsStyles.cardBase, { flex: 1 }]}>
      <Pressable
        style={globalStyles.cardHead}
        onPress={() => openLink(data.html_url, data.html_url)}
      >
        <View>
          <CtosText style={globalStyles.cardTitle}>Git Stats</CtosText>
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
        <CtosText style={globalStyles.sectionSubTitle}>
          {data.lastPushedRepo?.name}
        </CtosText>

        <Text style={globalStyles.sectionLabel}>Last Update</Text>
        <CtosText style={globalStyles.sectionSubTitle}>
          {data.lastPushDate}
        </CtosText>

        <Text style={globalStyles.sectionLabel}>Needs Update</Text>
        <CtosText style={globalStyles.sectionSubTitle}>
          {data?.lastPushDate ? dateFormat(data?.lastPushDate) }
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
    </View>
  );
};

export default GitStats;
