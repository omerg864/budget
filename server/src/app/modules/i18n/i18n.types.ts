import en from '../../../locale/en.json';
import he from '../../../locale/he.json';

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
