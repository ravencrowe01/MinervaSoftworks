import { Component, OnInit } from '@angular/core';
import { Listing } from './Listing';
import { Item } from './Item';
import { ItemStatistics } from './ItemStatistics';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import * as plushiesJson from '../data/plushies.json';
import * as flowersJson from '../data/flowers.json';
import { IPointsMarket } from './PointsMarket';
import { IPointsMarketEntry } from './PointMarketItem';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ItemSet } from './ItemSet';

@Component({
  selector: 'set-display',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './set-display.component.html',
  styleUrl: './set-display.component.css'
})
export class SetDisplayComponent implements OnInit {
  baseUrl: string = "https://api.torn.com/";
  apiVersion: string = "";
  apiKey: string = "";
  apiKeyForm: FormControl = new FormControl ('');
  pointsListings: IPointsMarketEntry[] = [];

  data = [
    {
      name: "Plushies",
      json: plushiesJson.plushies.sort ((a, b) => a.name.localeCompare (b.name))
    },
    {
      name: "Flowers",
      json: flowersJson.flowers.sort ((a, b) => a.name.localeCompare (b.name))
    }
  ]

  public sets: ItemSet [] = [];

  public pointValue = 0;

  public pointSetValue = 0;

  async ngOnInit(): Promise<void> {
    this.init ();
    this.loadApiKey ();

    if(this.apiKey.length > 0) {
      await this.loadData ();
    }
  }

  init () : void {
    this.sets = [];

    for (let set of this.data) {
      this.sets.push({
        name: set.name,
        items: set.json,
        itemStatistics: [],
        marketValue: 0,
        itemTotals: [ 0, 0, 0, 0 ]
      });
    }
  }

  async loadData (): Promise<void> {
    this.init ();
    
    this.pointsListings = await this.fetchPointsListings ();

    this.calculcatePointValue ();

    this.calculcatePointSetValue ();

    if(this.shouldLoadLocalData ()){
      
      this.loadLocalData ();

      for (let set of this.sets) {
        set.itemTotals = this.calculateTotalAvgs (set.itemStatistics);
      }
    }
    else {
      for (let set of this.sets) {
        await this.buildItemsStatisticsCollection (set.items, set.itemStatistics);

        set.marketValue = this.calculateSetMarketValue (set);

        set.itemTotals = this.calculateTotalAvgs (set.itemStatistics);
      }

      this.saveLocalData ();
    }
  }

  shouldLoadLocalData(): boolean {
    let storedTimestamp = localStorage.getItem("timestamp");
    let currentTime = Date.now();
    
    if (!storedTimestamp) {
      return false;
    }
  
    let lastTimestamp = parseInt(storedTimestamp, 10);

    return currentTime - lastTimestamp <= 60000;
  }

  loadLocalData () : void {
    this.sets = JSON.parse (localStorage.getItem ("sets") || "{}");
  }

  loadApiKey () : void {
    this.apiKeyForm.setValue(localStorage.getItem ("key") || "");
  }

  saveLocalData () : void {
    localStorage.setItem ("sets", JSON.stringify (this.sets));

    localStorage.setItem ("timestamp", JSON.stringify(Date.now () as number));

    localStorage.setItem ("key", this.apiKeyForm.value);
  }

  calculateTotalAvgs (items: ItemStatistics []) : number [] {
    let tops = [ 0, 0, 0, 0 ]

    items.forEach (stats => {
      tops[0] += stats.topAvgs [0]
      tops[1] += stats.topAvgs [1]
      tops[2] += stats.topAvgs [2]
      tops[3] += stats.topAvgs [3]
    });

    return tops;
  }

  async buildItemsStatisticsCollection (items: Item [], statsCollection: ItemStatistics []) : Promise<void> {
    for(let i = 0; i < items.length; i++) {
      let stats = await this.buildItemStatistics (items[i]);

      statsCollection.push (stats);
    }

    statsCollection.sort ((a, b) => a.name.localeCompare (b.name));

  }

  async buildItemStatistics (item: Item): Promise<ItemStatistics> {
    let listings = await this.fetchItemListings (item.id);

    let mv = await this.fetchItemMarketValue (item.id);

    return new ItemStatistics (item, listings, mv);
  }

  async fetchItemListings (id: number): Promise<Listing []> {
    let fetchUrl = this.buildItemListingsFetchUrl (id);

    let response = await fetch (fetchUrl);

    let items = (await response.json ())["bazaar"];

    return items;
  }

  buildItemListingsFetchUrl (id: number) : string {
    return `${this.baseUrl}${this.apiVersion}market/${id}?key=${this.apiKeyForm.value}&selections=bazaar`;
  }

  async fetchItemMarketValue (id: number) : Promise<number> {
    let fetchUrl = `${this.baseUrl}${this.apiVersion}torn/${id}?key=${this.apiKeyForm.value}&selections=items`;

    let response = await fetch (fetchUrl);

    return (await response.json ())["items"][`${id}`]["market_value"];
  }

  calculateSetMarketValue (set: ItemSet) : number {
    let mv = 0;

    for (let item of  set.itemStatistics) {
      mv += item.marketValue;
    }

    return mv;
  }

  calculcatePointValue () : void {
    let total = 0;

    this.pointsListings.forEach(listing => {
      total += listing.cost;
    });

    this.pointValue = (total / this.pointsListings.length);
  }

  calculcatePointSetValue () : void {
    this.pointSetValue = this.pointValue * 10;
  }

  async fetchPointsListings () : Promise<IPointsMarketEntry []> {
    let fetchUrl = `${this.baseUrl}${this.apiVersion}market/?key=${this.apiKeyForm.value}&selections=pointsmarket`;

    let response = await fetch (fetchUrl);

    let json = JSON.stringify((await response.json())["pointsmarket"]);

    let marketData: IPointsMarket = JSON.parse(json);

    let listings = [];

    for (let itemId in marketData) {
      if (marketData.hasOwnProperty(itemId)) {
          let item = marketData[itemId];
          listings.push(item);
      }
    }

    return listings;
  }

  public calculateSetProfit (set: number [], index: number) : number {
    return this.pointSetValue - set [index];
  }

  public calculateSetProfitPercent (set: number [], index: number) : number {
    return this.calculateSetProfit (set, index) / this.pointSetValue;
  }
}
