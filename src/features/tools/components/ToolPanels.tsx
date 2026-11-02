import { View } from "react-native";

import Base64Panel from "./Base64Panel";
import ColorPanel from "./ColorPanel";
import DnsPanel from "./DnsPanel";
import HashPanel from "./HashPanel";
import IpPortPanel from "./IpPortPanel";
import PasswordPanel from "./PasswordPanel";
import PingPanel from "./PingPanel";
import SslPanel from "./SslPanel";
import TimestampPanel from "./TimestampPanel";
import UrlPanel from "./UrlPanel";
import UuidPanel from "./UuidPanel";

// All the utility panels in one list: network, then security, then converters.
// Use the single panels on their own anywhere if you prefer.
export default function ToolPanels() {
  return (
    <View style={{ gap: 12 }}>
      <PingPanel />
      <SslPanel />
      <DnsPanel />
      <IpPortPanel />
      <HashPanel />
      <PasswordPanel />
      <UuidPanel />
      <Base64Panel />
      <UrlPanel />
      <TimestampPanel />
      <ColorPanel />
    </View>
  );
}
