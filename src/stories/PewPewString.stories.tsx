import type { Story } from "@ladle/react";
import { PewPewString } from "../";

export const PewPewStringStory: Story<{ level: string }> = ({ level }) => (
  <PewPewString level={level} style={{ width: "100%", height: "100%" }} />
);
PewPewStringStory.args = {
  level:
    "pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)",
};
