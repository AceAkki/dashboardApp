import { ScrollView, Text, View } from "react-native";

import CtosScreen from "@/components/ctos/CtosScreen";
import CtosText from "@/components/CtosText";
import globalStyles from "@/style/globalStyles";
import TerminalPanel from "@/features/tools/components/TerminalPanel";
import ToolRoutesPanel from "@/features/tools/components/ToolRoutesPanel";
import { ToolGroup } from "@/features/tools/toolKit";

import Base64Panel from "@/features/tools/components/Base64Panel";
import ColorPanel from "@/features/tools/components/ColorPanel";
import DnsPanel from "@/features/tools/components/DnsPanel";
import HashPanel from "@/features/tools/components/HashPanel";
import IpPortPanel from "@/features/tools/components/IpPortPanel";
import PasswordPanel from "@/features/tools/components/PasswordPanel";
import PingPanel from "@/features/tools/components/PingPanel";
import SslPanel from "@/features/tools/components/SslPanel";
import TimestampPanel from "@/features/tools/components/TimestampPanel";
import UrlPanel from "@/features/tools/components/UrlPanel";
import UuidPanel from "@/features/tools/components/UuidPanel";
import { APP_TAG } from "@/global/globalFunctions";

import toolsStyles from "@/features/tools/toolsStyles";

export default function Tools() {
  return (
    <CtosScreen nav>
      <ScrollView
        contentContainerStyle={toolsStyles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={globalStyles.sectionLabel}>{`${APP_TAG}Toolkit`}</Text>
          <CtosText style={[globalStyles.textHeading, { marginTop: 6 }]}>
            Utilities
          </CtosText>
        </View>
        <TerminalPanel />

        <ToolGroup title="Network">
          <IpPortPanel />
          <PingPanel />
          <SslPanel />
          <DnsPanel />
        </ToolGroup>
        <ToolGroup title="Security">
          <HashPanel />
          <PasswordPanel />
          <UuidPanel />
        </ToolGroup>
        <ToolGroup title="Converters">
          <Base64Panel />
          <UrlPanel />
          <TimestampPanel />
          <ColorPanel />
        </ToolGroup>
        <ToolRoutesPanel />
      </ScrollView>
    </CtosScreen>
  );
}
