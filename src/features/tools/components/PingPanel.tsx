import { useState } from "react";

import useAsyncAction from "@/global/useAsyncAction";
import { pingSite } from "../logic/network";
import { ActionButton, Field, ResultRow, Status, ToolPanel } from "../toolKit";

export default function PingPanel() {
  const [url, setUrl] = useState("");
  const { busy, data, error, run } = useAsyncAction(pingSite);

  return (
    <ToolPanel title="SERVER PING">
      <Field label="URL" value={url} onChangeText={setUrl} placeholder="example.com" />
      <ActionButton label="PING" busy={busy} disabled={!url.trim()} onPress={() => run(url)} />
      {error ? <Status tone="error">{error}</Status> : null}
      {data ? (
        <>
          <Status tone={data.ok ? "ok" : data.status < 500 ? "warn" : "error"}>
            {data.ok ? "ONLINE" : "ANSWERED WITH AN ERROR"}
          </Status>
          <ResultRow label="STATUS" value={`${data.status} ${data.statusText}`.trim()} />
          <ResultRow label="TIME" value={`${data.ms} MS`} />
          <ResultRow label="URL" value={data.url} />
        </>
      ) : null}
    </ToolPanel>
  );
}
