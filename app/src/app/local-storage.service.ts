import { Injectable } from '@angular/core';

export interface HoldStock {
  ticker: string,
  name: string,
  quantity: number,
  total: number
}

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {
  localStorage: Storage;

  constructor() {
    this.localStorage = window.localStorage;
    this.init('watch');
    this.init('portfo');
    this.init('wallet');

  }

  init(type: string) {
    if (!this.localStorage.hasOwnProperty(type)) {
      if (type == 'wallet')
        this.localStorage.setItem(type, JSON.stringify(25000));
      else
        this.localStorage.setItem(type, JSON.stringify([]));
    }
  }

  inStorage(type: string, key: string): boolean {
    let list = JSON.parse(this.localStorage.getItem(type)!);
    for (let i = 0; i < list.length; i++) {
      if (list[i].symbol == key)
        return true;
    }
    return false;
  }

  set(type: string, key: string, value: any): boolean {
    let insertAt = this.getAll(type).length;
    if (this.inStorage(type, key))
      insertAt = this.remove(type, key);
    if (type == "portfo" && value.quantity == 0)
      return true;
    let list = JSON.parse(this.localStorage.getItem(type)!);
    list.splice(insertAt, 0, { symbol: key, content: value });
    this.localStorage.setItem(type, JSON.stringify(list));
    return true;
  }

  get(type: string, key: string): any {
    let list = JSON.parse(this.localStorage.getItem(type)!);
    for (let i = 0; i < list.length; i++) {
      if (list[i].symbol == key)
        return list[i];
    }
    return {};
  }

  remove(type: string, key: string): number {
    let list = JSON.parse(this.localStorage.getItem(type)!);

    for (let i = 0; i < list.length; i++) {
      if (list[i].symbol == key) {
        list.splice(i, 1);
        this.localStorage.setItem(type, JSON.stringify(list));
        return i;
      }
    }
    return this.getAll(type).length;
  }

  setToWatch(key: string, value: any): boolean {
    return this.set('watch', key, value);
  }

  getFromWatch(key: string): any {
    return this.get('watch', key);
  }

  rmFromWatch(key: string): number {
    return this.remove('watch', key);
  }

  /**
   * The method is called when user click to buy or sell the stock
   * @param type 'Buy' or 'Sell'
   * @param key ticker of the stock from company description
   * @param value ticker: ticker of the stock from input box,
   *        name: name of the company,
   *        quantity: quantity of bought or sold stock, always be positive number,
   *        total: total cost of this trasaction(quantity * current price), always be positive number
   */
  setToPortfo(type: string, key: string, value: any): boolean {
    let data = this.getFromPortfo(key);
    if (type == 'Buy')
      this.setWallet(-value.total);
    else
      this.setWallet(value.total);
    if (Object.keys(data).length != 0) {
      if (type == 'Buy') {
        value.quantity += data.content.quantity;
        value.total += data.content.total;
      } else {
        value.quantity = data.content.quantity - value.quantity;
        value.total = data.content.total - (data.content.total / data.content.quantity);
      }
    }
    return this.set('portfo', key, value);
  }

  getFromPortfo(key: string): any {
    return this.get('portfo', key);
  }

  rmFromPortfo(key: string): number {
    return this.remove('portfo', key);
  }

  getAll(type: string): any {
    return JSON.parse(this.localStorage.getItem(type)!);
  }

  getAllWatch(): any {
    return this.getAll('watch');
  }

  getAllPortfo(): any {
    return this.getAll('portfo');
  }

  getWallet(): number {
    return JSON.parse(this.localStorage.getItem('wallet')!);
  }

  setWallet(value: number) {
    this.localStorage.setItem('wallet', JSON.stringify(this.getWallet() + value));
  }

}
