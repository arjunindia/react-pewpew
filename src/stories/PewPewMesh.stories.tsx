import type { Meta, StoryObj } from "@storybook/react";
import { PewPewMesh } from "../";

const meta = {
  title: "PewPewMesh",
  component: PewPewMesh,
  tags: ["docsPage"],
  args: {
    mesh:`
    meshes = {
        {
          vertexes = {{0,0}, {500,0}, {500,500}, {0,500}},
          colors = {0xffffffff, 0xffff00ff, 0xff00ffff, 0x00ff0000},
          segments = {{0,1,2,3,0}}
        }
      }
    `,

  },
} satisfies Meta<typeof PewPewMesh>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Primary: Story = {
  args: {
    mesh:`
    meshes = {
        {
          vertexes = {{0,0}, {500,0}, {500,500}, {0,500}},
          colors = {0xffffffff, 0xffff00ff, 0xff00ffff, 0x00ff0000},
          segments = {{0,1,2,3,0}}
        }
      }
    `,
    style: {
        width: "100%",
        height: "85vh",
    },
  },
};