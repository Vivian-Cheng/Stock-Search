import { Injectable } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router/';
import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';


interface RouteStorageObj {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}
@Injectable({
  providedIn: 'root'
})
export class CacheRouteService implements RouteReuseStrategy {

  constructor() { }

  /**
   * @type {{ [key: string]: RouteStorageObj }}
   * Object that will store RouteStorageObj and allows us to see if we've got a route for the requested path
   * key: a path (as in route.routeConfig.path)
   */
  storedRoutes: { [key: string]: RouteStorageObj } = {};

  /**
   * @private
   * @type {string[]}
   * An array of paths we want to store
   */
  private acceptedRoutes: string[] = [":ticker", "search"];
  private allowDetch: boolean = true;

  private getPath(route: ActivatedRouteSnapshot): string {
    //console.log(route.routeConfig);
    if (route.routeConfig !== null && route.routeConfig.path !== null) {
      return route.routeConfig.path!;
    }
    return '';
  }

  private compareObj(base: any, cmp: any): boolean {
    for (let prop in base) {
      if (cmp.hasOwnProperty(prop)) {
        switch (typeof base[prop]) {
          case 'object':
            if (typeof cmp[prop] !== 'object' || !this.compareObj(base[prop], cmp[prop]))
              return false;
            break;
          case 'function':
            if (typeof cmp[prop] !== 'function' || base[prop].toString() !== cmp[prop].toString())
              return false;
            break;
          default:
            if (base[prop] != cmp[prop])
              return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

  /**
   * Determine whether the current route should be reused
   * @param future the route we're landing
   * @param curr the route we're leaving
   */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    //console.log("deciding to reuse", "future", future.routeConfig, "current", curr.routeConfig, "return: ", future.routeConfig === curr.routeConfig);
    //console.log("stored route: ", this.storedRoutes);
    if ((this.getPath(future) == ':ticker' && this.getPath(curr) == 'home') || (this.getPath(future) == 'home' && this.getPath(curr) == ':ticker')) {
      //console.log("not use");
      this.allowDetch = false;
    } else {
      this.allowDetch = true;
    }

    return future.routeConfig === curr.routeConfig;
  }

  /**
   * The method is called for the route just opened when we land on the component of this route.
   * Determin whether there is a stored route and whether it should be rendered in place of requested route
   * @param route the route we're landing
   */
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = this.getPath(route);
    // check whether the route has been stored
    if (!!this.storedRoutes[path] && this.allowDetch) {
      // check whether the route should be rendered in place of the requested route
      return this.compareObj(route.params, this.storedRoutes[path].snapshot.params)
    }
    return false;
  }

  /**
   * The method is called if shouldAttach returns TRUE
   * Find the stored DetachedRouteHandle of the requested route
   * @param route the current route we just land
   */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    //console.log("retrieving", "return: ", this.storedRoutes[this.getPath(route)]);
    return this.storedRoutes[this.getPath(route)].handle;
  }

  /**
   * The method is called when we leave the current route
   * Determine whether the route should be stored
   * @param route the current route we're leaving
   */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    //console.log("shouldDetch", this.getPath(route));
    //console.log(route);
    if (this.allowDetch && this.acceptedRoutes.indexOf(this.getPath(route)) > -1) {
      //console.log("detaching", route);
      return true;
    }

    return false;
  }

  /**
   * The method is called if the shouldDetach returns TRUE
   * @param route
   * @param handle
   */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    let storedRoute: RouteStorageObj = {
      snapshot: route,
      handle: handle
    };
    //console.log("store:", storedRoute, "into: ", this.storedRoutes);
    this.storedRoutes[this.getPath(route)] = storedRoute;
  }

}
