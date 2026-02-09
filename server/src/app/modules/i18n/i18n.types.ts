import en from '../../../i18n/en/translations.json';
import he from '../../../i18n/he/translations.json';

type Flatten<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends string
    ? `${P}${K & string}`
    : Flatten<T[K], `${P}${K & string}.`>;
}[keyof T];

export type ScopedKeys<
  T,
  Prefix extends string,
> = T extends `${Prefix}.${infer Rest}` ? Rest : never;

type TranslationKeysHE = Flatten<typeof he>;
type TranslationKeysEN = Flatten<typeof en>;

export type I18nPath = TranslationKeysHE | TranslationKeysEN;
