import srcHTML from "../srcDoc";
import React from "react";
interface PewPewProps
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {
  level: Uint8Array;
}

/**
 * This component renders a PewPew Live Level when a UInt8Array Zip of a level is given as the level prop.
 *
 * @component
 * @example
 * import { PewPew } from "react-pewpew";
 * import JSZip from "jszip";
 *
 * const zip = new JSZip();
 * zip.file("/level.lua", "pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)");
 * zip.file("/manifest.json", '{"name":"level","descriptions":["..."],"entry_point":"level.lua","has_score_leaderboard":false,}');
 * let level = await zip.generateAsync({type: "uint8array"});
 *
 * <PewPew level={level} />
 */
function PewPew(props: PewPewProps) {
  const iFrameRef = React.useRef<HTMLIFrameElement>(null);
  const [ready,setReady] = React.useState(false);
  const postToIFrame = () => {
    iFrameRef.current?.contentWindow?.postMessage(
      {
        type: "level",
        level: props.level,
      },
      "*"
    );
  };
  React.useEffect(() => {
    postToIFrame();
  }, [props.level]);
  React.useEffect(() => {
    const fn = (event:any) => {
      if (event.data.type === "ready"){
        setReady(true);
        setTimeout(postToIFrame, 1000);
      }
    }
    window.addEventListener("message", fn);
    return () => {
      window.removeEventListener("message", fn);
    }
  }, []);
  let { level, ...rest } = props;
  return (
    <iframe
      ref={iFrameRef}
      title="PewPew"
      srcDoc={srcHTML}
      onClick={() => {
        window.focus();
      }}
      {...rest}
    />
  );
}

export default PewPew;
