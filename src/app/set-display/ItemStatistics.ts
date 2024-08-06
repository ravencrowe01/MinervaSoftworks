import { Item } from './Item';
import { Listing } from './Listing';

export class ItemStatistics {
  public id: number;

  public name: string;

  public listings: Listing[];

  public marketValue: number = 0;
  
  public topAvgs: number [] = [ 0, 0, 0, 0]

  constructor(item: Item, listings: Listing[], marketValue: number) {
    this.id = item.id;
    this.name = item.name;
    this.listings = listings;
    this.marketValue = marketValue;

    this.calcAvgs();
  }

  private calcAvgs() {
    let total = 0;

    for (let i = 0; i < this.listings.length; i++) {
      total += this.listings[i].cost;

      if (i === 2) {
        this.topAvgs[0] = Math.ceil(total / 3);
      }

      if (i === 4) {
        this.topAvgs[1] = Math.ceil(total / 5);
      }

      if (i === 9) {
        this.topAvgs[2] = Math.ceil(total / 10);
      }

      if (i === 24) {
        this.topAvgs[3] = Math.ceil(total / 25);
      }

      // if (i === 49) {
      //   this.topAvgs[4] = Math.ceil(total / 50);
      // }

      // if (i === 99) {
      //   this.topAvgs[5] = Math.ceil(total / 100);
      // }
    }
  }
}
