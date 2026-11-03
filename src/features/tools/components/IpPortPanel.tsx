import { useEffect, useState } from "react";

import useAsyncAction from "@/global/useAsyncAction";
import { checkPort, lookupIp } from "../logic/network";
import {
  ActionButton,
  Field,
  Hint,
  ResultRow,
  Status,
  Sub,
  ToolPanel,
} from "../toolKit";

function IpSection() {
  const [target, setTarget] = useState("");
  const { busy, data, error, run } = useAsyncAction(lookupIp);

  // opening the panel shows your own address straight away
  useEffect(() => {
    run("");
  }, [run]);

  return (
    <>
      <Sub>IP LOOKUP</Sub>
      <Field
        label="IP ADDRESS (EMPTY = YOURS)"
        value={target}
        onChangeText={setTarget}
        placeholder="8.8.8.8"
      />
      <ActionButton label="LOOKUP" busy={busy} onPress={() => run(target)} />
      {error ? <Status tone="error">{error}</Status> : null}
      {data ? (
        <>
          <ResultRow label="IP" value={data.ip} />
          <ResultRow label="PLACE" value={data.place || "UNKNOWN"} />
          <ResultRow label="ISP" value={data.isp} />
          <ResultRow label="TIMEZONE" value={data.timezone} />
        </>
      ) : null}
    </>
  );
}

function PortSection() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState("443");
  const { busy, data, error, run } = useAsyncAction(checkPort);

  const tone =
    data?.state === "open"
      ? "ok"
      : data?.state === "no-answer"
        ? "warn"
        : "error";

  return (
    <>
      <Sub>PORT CHECK</Sub>
      <Field
        label="HOST"
        value={host}
        onChangeText={setHost}
        placeholder="example.com"
      />
      <Field
        label="PORT"
        value={port}
        onChangeText={setPort}
        placeholder="443"
        keyboardType="number-pad"
      />
      <ActionButton
        label="CHECK"
        busy={busy}
        disabled={!host.trim() || !port.trim()}
        onPress={() => run(host, port)}
      />
      {error ? <Status tone="error">{error}</Status> : null}
      {data ? (
        <Status tone={tone}>
          {data.state === "open"
            ? "OPEN"
            : data.state === "no-answer"
              ? "NO ANSWER"
              : "CLOSED"}{" "}
          · {data.detail} · {data.ms} MS
        </Status>
      ) : null}
      <Hint>
        SENDS AN HTTP REQUEST FROM THIS PHONE, SO IT ONLY TESTS WEB PORTS. SSH
        OR DATABASE PORTS SHOW AS CLOSED.
      </Hint>
    </>
  );
}

export default function IpPortPanel() {
  return (
    <ToolPanel title="IP & PORT CHECK" iconName="wifi-outline">
      <IpSection />
      <PortSection />
    </ToolPanel>
  );
}
