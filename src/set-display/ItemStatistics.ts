import { Item } from './Item';
import { Listing } from './Listing';

export class ItemStatistics {
  public id: number;

  public name: string;

  public listings: Listing[];

  public avgTop3: number = 0;

  public avgTop5: number = 0;

  public avgTop10: number = 0;

  public avgTop25: number = 0;

  public avgTop50: number = 0;

  public avgTop100: number = 0;

  constructor(item: Item, listings: Listing[]) {
    this.id = item.id;
    this.name = item.name;
    this.listings = listings;

    this.calcAvgs();
  }

  private calcAvgs() {
    let total = 0;

    for (let i = 0; i < this.listings.length; i++) {
      total += this.listings[i].cost;

      if (i === 2) {
        this.avgTop3 = Math.ceil(total / 3);
      }

      if (i === 4) {
        this.avgTop5 = Math.ceil(total / 5);
      }

      if (i === 9) {
        this.avgTop10 = Math.ceil(total / 10);
      }

      if (i === 24) {
        this.avgTop25 = Math.ceil(total / 25);
      }

      if (i === 49) {
        this.avgTop50 = Math.ceil(total / 50);
      }

      if (i === 99) {
        this.avgTop100 = Math.ceil(total / 100);
      }
    }
  }
}
