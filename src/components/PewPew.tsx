import { useEffect,useRef,memo,useState } from "react";

import type { RefObject } from 'react';
interface PewPewProps extends React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement> {
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
  const iFrameRef = useRef<HTMLIFrameElement>(null);
  const postToIFrame = () => {
    iFrameRef.current?.contentWindow?.postMessage(
      {
        type: "level",
        level: props.level,
      },
      "*"
    );
  };
  useEffect(() => {
    setTimeout(postToIFrame, 1000);
  }, [props.level]);

  let { level, ...rest } = props;
  return <iframe ref={iFrameRef} title="PewPew" src={`wasm/index.html`} onClick={()=>{window.focus()}} {...rest} />;
}


export default PewPew;