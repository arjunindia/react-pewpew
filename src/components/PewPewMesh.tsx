import { useEffect,useState } from "react";
import PewPew from "./PewPew";
import JSZip from "jszip";


interface PewPewMeshProps extends React.DetailedHTMLProps<React.IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement> {
    mesh: string;
}
/**
 * This component renders a PewPew Live Mesh when a string of Lua Mesh code is given as the mesh prop.
 * This component is a wrapper around the PewPew component and uses JSZip to create a zip file from the string.
 * This component only renders the first mesh in the string.
 * 
 * @component
 * @example
 * import { PewPewMesh } from "react-pewpew";
 * 
 * <PewPewMesh mesh={`
 * function f1(angle)
 *  return 100 * (1.0 - math.cos(angle) * math.sin(3 * angle)
 * end
 * 
 * function mesh_from_polar_function(f)
  computed_vertexes = {}

  local index = 0
  local line = {}
  for angle = 0, math.pi * 2, 0.05 do
    local radius = f(angle)
    local x = math.cos(angle) * radius
    local y = math.sin(angle) * radius
    table.insert(computed_vertexes, {x, y})
    table.insert(line, index)
    index = index + 1
  end

  -- Close the loop
  table.insert(line, 0)

  return  {
    vertexes = computed_vertexes,
    segments = {line},
  }
end
meshes = {
  mesh_from_polar_function(f1),
}`} />

 */
function PewPewMesh(props: PewPewMeshProps) {
    const [meshString, setMesh] = useState<Uint8Array>(new Uint8Array(0));
    useEffect(() => {
        const zip = new JSZip();
        zip.file("/level.lua", `
        pewpew.set_level_size(5000fx, 5000fx)

        local background1 = pewpew.new_customizable_entity(0fx, 0fx)
        pewpew.customizable_entity_set_mesh(background1, "/dynamic/mesh.lua", 0)
        
        pewpew.new_player_ship(100fx, 100fx, 0)
        `);
        zip.file("/manifest.json", '{"name":"level","descriptions":["..."],"entry_point":"level.lua","has_score_leaderboard":false,}');
        zip.file("/mesh.lua", props.mesh);
        zip.generateAsync({ type: "uint8array" }).then((mesh) => {
            setMesh(mesh);
        });
    }, [props.mesh]);

    const { mesh, ...rest } = props;
    return <PewPew level={meshString} {...rest} />;
}
export default PewPewMesh;