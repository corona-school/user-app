/**
 * Should only be used for dynamic keys.
 * Use with caution and double check that the possible combinations exist in the transaltion files.
 */
export const asTranslationKey = (key: string) => key as unknown as TemplateStringsArray;
