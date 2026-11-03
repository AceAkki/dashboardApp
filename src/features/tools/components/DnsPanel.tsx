import { useState } from "react";

import useAsyncAction from "@/global/useAsyncAction";
import { DNS_TYPE_LIST, lookupDns, type DnsType } from "../logic/network";
import { ActionButton, Chip, ChipRow, Field, ResultRow, Status, ToolPanel } from "../toolKit";

export default function DnsPanel() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState<DnsType>("A");
  const { busy, data, error, run } = useAsyncAction(lookupDns);

  return (
    <ToolPanel title="DNS LOOKUP" iconName="globe-outline">
      <Field label="DOMAIN" value={domain} onChangeText={setDomain} placeholder="example.com" />
      <ChipRow>
        {DNS_TYPE_LIST.map((t) => (
          <Chip key={t} label={t} active={t === type} onPress={() => setType(t)} />
        ))}
      </ChipRow>
      <ActionButton label="LOOKUP" busy={busy} disabled={!domain.trim()} onPress={() => run(domain, type)} />
      {error ? <Status tone="error">{error}</Status> : null}
      {data && data.length === 0 ? <Status tone="warn">NO {type} RECORDS</Status> : null}
      {data?.map((r, i) => (
        <ResultRow key={i} label={`${r.type} · ${r.ttl}S`} value={r.data} />
      ))}
    </ToolPanel>
  );
}
