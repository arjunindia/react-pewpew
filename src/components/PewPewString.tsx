import React from "react";
import PewPew from "./PewPew";
import JSZip from "jszip";

interface PewPewStringProps
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {
  level: string;
}

/**
 * This component renders a PewPew Live Level when a string of Lua Level code is given as the level prop.
 * This component is a wrapper around the PewPew component and uses JSZip to create a zip file from the string.
 *
 * @component
 * @example
 * import { PewPewString } from "react-pewpew";
 *
 * <PewPewString level="pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)" />
 */
function PewPewString(props: PewPewStringProps) {
  const [levelString, setLevel] = React.useState<Uint8Array>(new Uint8Array(0));
  React.useEffect(() => {
    const zip = new JSZip();
    zip.file("/level.lua", props.level);
    zip.file(
      "/manifest.json",
      '{"name":"level","descriptions":["..."],"entry_point":"level.lua","has_score_leaderboard":false,}'
    );
    zip.generateAsync({ type: "uint8array" }).then((level) => {
      setLevel(level);
    });
  }, [props.level]);

  const { level, ...rest } = props;
  return <PewPew level={levelString} {...rest} />;
}
export default PewPewString;
