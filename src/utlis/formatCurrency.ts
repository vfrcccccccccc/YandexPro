// src/utils/formatCurrency.ts
export type FormatCurrencyOptions = {
  locale?: string; // e.g. 'ru-RU'
  currency?: string | null; // e.g. 'KGS' or null if you want no symbol
  minimumFractionDigits?: number; // e.g. 0, 1...
  maximumFractionDigits?: number;
  useCurrencySymbol?: boolean; // append/prepend currency code or rely on Intl currency symbol
};

export function formatCurrency(
  value: number | string | null | undefined,
  opts: FormatCurrencyOptions = {},
): string {
  if (value == null) return '—';

  // --- NEW: convert string → number safely ---
  let numericValue: number;

  if (typeof value === 'string') {
    const cleaned = value
      .replace(/\s+/g, '') // remove spaces
      .replace(',', '.'); // convert comma decimals to dot

    numericValue = Number(cleaned);

    if (Number.isNaN(numericValue)) {
      return '—'; // invalid string input
    }
  } else {
    numericValue = value;
  }

  if (Number.isNaN(numericValue)) return '—';

  // Options
  const {
    locale = 'ru-RU',
    currency = 'KGS',
    minimumFractionDigits = 1,
    maximumFractionDigits = 1,
    useCurrencySymbol = false,
  } = opts;

  const intlOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: true,
  };

  if (useCurrencySymbol && currency) {
    intlOptions.style = 'currency';
    intlOptions.currency = currency;
  }

  const nf = new Intl.NumberFormat(locale, intlOptions);
  let formatted = nf.format(numericValue);

  // Replace NBSP with normal space
  formatted = formatted.replace(/\u00A0/g, ' ');

  if (!useCurrencySymbol && currency) {
    formatted += ` ${currency}`;
  }

  return formatted;
}
