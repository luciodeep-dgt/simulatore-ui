import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import localeEnglish from '@angular/common/locales/en';
import localeEnglishExtra from '@angular/common/locales/extra/en';
import localeItalian from '@angular/common/locales/it';
import localeItalianExtra from '@angular/common/locales/extra/it';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { of } from 'rxjs';
import * as moment from 'moment';
import { BrowserStorageService } from './browser-storage.service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const LOCALE_STORAGE_KEY = 'locale';

const localeData = {
  en: { data: localeEnglish, extraData: localeEnglishExtra },
  it: { data: localeItalian, extraData: localeItalianExtra },
};

/**
 * @author Geremia Nappo <ge.nappo@almaviva.it>
 * @version 1.0.0
 * @summary Service per la localizzazione
 */
@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  constructor(
    @Inject(LOCALE_ID) private readonly defaultLocale: string,
    private readonly browserStorage: BrowserStorageService,
    private readonly translate: TranslateService) {

    this.translate.onLangChange.subscribe(language => {
      this.browserStorage.set(LOCALE_STORAGE_KEY, language.lang);
    });

    this.registerLocales();
  }

  init() {
    this.translate.setDefaultLang(this.defaultLocale);

    const locale = this.browserStorage.get(LOCALE_STORAGE_KEY) || this.translate.getDefaultLang();
    this.setLocale(locale).subscribe();
  }

  setLocale(locale: string) {
    moment.locale(locale);
    return this.translate.use(locale);
  }

  getLocale() {
    return of(this.translate.currentLang || this.defaultLocale);
  }

  private registerLocales() {
    this.translate.addLangs(Object.keys(localeData));
    Object.keys(localeData).forEach(localeId => {
      const locale = localeData[localeId];
      registerLocaleData(locale.data, localeId, locale.extraData);
    });
  }

}
