import type { Meta, StoryObj } from "@storybook/react";
import { PewPewString } from "../";

const meta = {
  title: "PewPewString",
  component: PewPewString,
  tags: ["docsPage"],
  args: {
    level: `pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)`,
    style: {
      width: "100%",
      height: "85vh",
  },
  },
} satisfies Meta<typeof PewPewString>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    level: `pewpew.set_level_size(500fx, 500fx) pewpew.new_player_ship(10fx, 10fx, 0)`,
    style: {
      width: "100%",
      height: "85vh",
  },
  },
};