import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import { favLinks } from "../favLinksData";
import type { SearchEnginesProps } from "../favLinkTypes";
import LinkIcon from "./LinkIcon";

// Tapping an engine only selects it. The search runs from the search bar,
// so you can't launch the wrong thing by tapping while typing.
const SearchEngines = ({ selected, onSelect }: SearchEnginesProps) => (
  <ChipRow layout="scroll">
    {favLinks.SearchLinks.map((item) => (
      <Chip
        key={item.name}
        label={item.name}
        left={<LinkIcon uri={item.favicon} name={item.name} />}
        selected={item.name === selected}
        onPress={() => onSelect(item.name)}
      />
    ))}
  </ChipRow>
);

export default SearchEngines;
