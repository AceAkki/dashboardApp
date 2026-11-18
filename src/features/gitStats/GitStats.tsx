import { Text, View } from "react-native";

// styles
import { Colors } from "@/constants/Colors";
import globalStyles from "@/style/globalStyles";
import gitStatsStyles from "./gitStatsStyles";

import CtosText from "@/components/CtosText";
import LoadState from "@/components/ctos/LoadState";
import Corners from "@/components/ctos/Corners";
import Panel from "@/components/ctos/Panel";
import IconButton from "@/components/ctos/IconButton";
import { useGitStats } from "./hooks/useGitStats";
import { openLink } from "../favLinks/utils/openLink";
import { dateFormat } from "@/global/globalFunctions";

const GitStats = () => {
  let { data, loading, error, storageTime, refetch } = useGitStats();

  if (!data) {
    return (
      <View style={[globalStyles.card, globalStyles.center]}>
        <Corners />
        <LoadState
          loading={loading}
          error={error}
          notice="Unable to find GitHub Profile"
          onRetry={refetch}
        />
      </View>
    );
  }

  const needsUpdate =
    data?.lastPushDate &&
    new Date(data.lastPushDate).getDate() < new Date().getDate();

  return (
    <Panel
      style={gitStatsStyles.cardBase}
      title="Git Stats"
      right={
        <IconButton
          variant="plain"
          icon="expand-outline"
          label="Open GitHub profile"
          onPress={() => openLink(data.html_url, data.html_url)}
        />
      }
    >
      <View>
        <CtosText style={globalStyles.sectionTitle}>{data.login}</CtosText>

        <View style={globalStyles.divider}></View>

        <Text style={globalStyles.sectionLabel}>Repo Name</Text>
        <CtosText style={[globalStyles.sectionSubTitle, { marginVertical: 5 }]}>
          {data.lastPushedRepo?.name}
        </CtosText>

        <Text style={globalStyles.sectionLabel}>Last Update</Text>
        <CtosText
          style={[
            globalStyles.sectionSubTitle,
            { marginVertical: 5 },
            needsUpdate ? { color: Colors.danger } : { color: Colors.primary },
          ]}
        >
          {data?.lastPushDate &&
            dateFormat({
              dateString: data.lastPushDate,
              hasTime: false,
            }).replace(/\/|\-/g, ".")}
        </CtosText>

        <Text style={globalStyles.sectionLabel}>Needs Update</Text>
        <CtosText
          style={[
            globalStyles.sectionTitle,
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
          Expiry Time : {dateFormat({ dateString: storageTime, hasTime: true })}
        </Text>
      ) : null}
    </Panel>
  );
};

export default GitStats;
