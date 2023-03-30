import type { Preview } from "@storybook/react";
import JSZip from "jszip";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

async function generateZip() {
  const zip = new JSZip();
  zip.file("/level.lua", "pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)");
  zip.file("/manifest.json", '{"name":"level","descriptions":["..."],"entry_point":"level.lua","has_score_leaderboard":false,}');
  let level = await zip.generateAsync({type: "uint8array"});
  return level;
}
export const loaders = [
  async () => ({
    level: await generateZip(),
  }),
];

export default preview;
