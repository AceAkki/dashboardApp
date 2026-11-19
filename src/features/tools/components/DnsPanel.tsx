import { useState } from "react";

import useAsyncAction from "@/hooks/useAsyncAction";
import { DNS_TYPE_LIST, lookupDns, type DnsType } from "../logic/network";
import ChipRow from "@/components/ctos/ChipRow";
import ResultRow from "@/components/ctos/ResultRow";
import Status from "@/components/ctos/Status";
import { ActionButton, Chip, Field, Stack } from "../toolKit";

export default function DnsPanel() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState<DnsType>("A");
  const { busy, data, error, run } = useAsyncAction(lookupDns);

  return (
    <Stack>
      <Field label="DOMAIN" value={domain} onChangeText={setDomain} placeholder="example.com" />
      <ChipRow>
        {DNS_TYPE_LIST.map((t) => (
          <Chip key={t} label={t} active={t === type} onPress={() => setType(t)} />
        ))}
      </ChipRow>
      <ActionButton label="LOOKUP" busy={busy} disabled={!domain.trim()} onPress={() => run(domain, type)} />
      {error ? <Status tone="err">{error}</Status> : null}
      {data && data.length === 0 ? <Status tone="warn">NO {type} RECORDS</Status> : null}
      {data?.map((r, i) => (
        <ResultRow reveal key={i} label={`${r.type} · ${r.ttl}S`} value={r.data} />
      ))}
    </Stack>
  );
}
