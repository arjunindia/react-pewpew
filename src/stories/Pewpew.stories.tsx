import type { Story } from "@ladle/react";
import { PewPew } from "../";
import JSZip from "jszip";
import React from "react";

async function zipLevel() {
  const zip = new JSZip();
  zip.file(
    "/level.lua",
    "pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)"
  );
  zip.file(
    "/manifest.json",
    '{"name":"level","descriptions":["..."],"entry_point":"level.lua","has_score_leaderboard":false,}'
  );
  let zipResult = await zip.generateAsync({ type: "uint8array" });
  return zipResult;
}

const level = await zipLevel();
export const PewPewStory: Story = () => {
  return (<PewPew level={level} style={{ width: "100%", height: "100%" }} />);
}
