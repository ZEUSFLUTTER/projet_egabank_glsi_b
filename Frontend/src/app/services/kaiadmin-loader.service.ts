import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class KaiadminLoaderService {
  private scriptsLoaded = false;

  constructor() {}

  loadKaiadminScripts(): Promise<void> {
    if (this.scriptsLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      if (typeof $ === 'undefined') {
        console.warn('jQuery n\'est pas chargé. Kaiadmin nécessite jQuery.');
        resolve();
        return;
      }

      try {
        if (typeof $.fn.scrollbar === 'function') {
          $('.scrollbar-inner').scrollbar();
        }

        this.scriptsLoaded = true;
        resolve();
      } catch (error) {
        console.warn('Erreur lors de l\'initialisation de Kaiadmin:', error);
        resolve();
      }
    });
  }

  initializeScrollbars(): void {
    if (typeof $ !== 'undefined' && typeof $.fn.scrollbar === 'function') {
      setTimeout(() => {
        $('.scrollbar-inner').scrollbar();
      }, 100);
    }
  }
}