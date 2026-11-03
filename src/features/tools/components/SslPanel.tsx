import { useState } from "react";

import useAsyncAction from "@/global/useAsyncAction";
import { checkSsl } from "../logic/network";
import { ActionButton, Field, ResultRow, Status, ToolPanel } from "../toolKit";

export default function SslPanel() {
  const [host, setHost] = useState("");
  const { busy, data, error, run } = useAsyncAction(checkSsl);

  const days = data?.daysLeft ?? 0;
  const tone = days < 0 || days <= 7 ? "error" : days <= 30 ? "warn" : "ok";

  return (
    <ToolPanel title="SSL EXPIRY" iconName="lock-closed">
      <Field
        label="DOMAIN"
        value={host}
        onChangeText={setHost}
        placeholder="example.com"
      />
      <ActionButton
        label="CHECK"
        busy={busy}
        disabled={!host.trim()}
        onPress={() => run(host)}
      />
      {error ? <Status tone="error">{error}</Status> : null}
      {data ? (
        <>
          <Status tone={tone}>
            {days < 0
              ? `EXPIRED ${-days} DAYS AGO`
              : `VALID · ${days} DAYS LEFT`}
          </Status>
          <ResultRow label="EXPIRES" value={data.validTo.slice(0, 10)} />
          <ResultRow label="ISSUED BY" value={data.issuedBy} />
          <ResultRow label="ISSUED TO" value={data.issuedTo} />
          <ResultRow label="NAMES" value={data.names.join(", ")} />
        </>
      ) : null}
    </ToolPanel>
  );
}
