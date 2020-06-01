export = reloadCSS;
export = reloadCSS;
declare function reloadCSS(): void;
declare namespace reloadCSS {
  export {
    getBundleURLCached as getBundleURL,
    getBaseURL,
    __esModule,
    deepcopy as default,
    store,
  };
}
declare function getBundleURLCached(): any;
declare function getBaseURL(url: any): string;
declare var __esModule: boolean;
declare function deepcopy(value: any): any;
declare var store: any;
