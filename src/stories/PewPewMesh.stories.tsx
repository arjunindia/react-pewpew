import type { Story } from "@ladle/react";
import { PewPewMesh } from "../";

const meshString = `
meshes = {
  { -- A 500x500 square
    vertexes = {{0,0,0}, {500,0,0}, {500,500,0}, {0,500,0}},
    colors = {0xffffffff, 0xffff00ff, 0xff00ffff, 0xff0000ff},
    segments = {{0,1,2,3,0}}
  },
  { -- A right-angled triangle
    vertexes = {{0,0,0}, {500,0,0}, {0,500,0}},
    colors = {0xffff00ff, 0xff00ffff, 0xff0000ff},
    segments = {{0,1,2,0}}
  }
}
`;

type storyType = {
  mesh: string;
};
export const PewPewMeshStory: Story<storyType> = ({ mesh }) => (
  <PewPewMesh mesh={mesh} style={{ width: "100%", height: "100%" }} />
);

PewPewMeshStory.args = {
  mesh: meshString,
};
