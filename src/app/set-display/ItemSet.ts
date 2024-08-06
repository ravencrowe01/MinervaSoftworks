import { Item } from "./Item";
import { ItemStatistics } from "./ItemStatistics";

export interface ItemSet {
  id: number;
  name: string;
  items: Item[];
  itemStatistics: ItemStatistics[];
  marketValue: number;
  itemTotals: number[];
}
