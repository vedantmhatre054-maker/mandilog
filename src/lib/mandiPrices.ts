export interface MandiPriceRecord {
  market: string;
  commodity: string;
  variety: string;
  modalPricePerQuintal: number;
  reportedOn: string;
  source: 'official' | 'demonstration';
  fetchedAt: string;
}

const CACHE_KEY = 'mandilog-official-mandi-prices-v1';

function isMandiPriceRecord(value: unknown): value is MandiPriceRecord {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Partial<MandiPriceRecord>;
  return (
    typeof record.market === 'string' &&
    typeof record.commodity === 'string' &&
    typeof record.variety === 'string' &&
    typeof record.modalPricePerQuintal === 'number' &&
    Number.isFinite(record.modalPricePerQuintal) &&
    typeof record.reportedOn === 'string' &&
    record.source === 'official' &&
    typeof record.fetchedAt === 'string'
  );
}

export function getCachedMandiPrices(): MandiPriceRecord[] {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const cached: unknown = JSON.parse(raw);
    if (!Array.isArray(cached) || !cached.every(isMandiPriceRecord)) return [];
    return cached;
  } catch (error) {
    console.error('Could not read the cached mandi price feed.', error);
    return [];
  }
}

export function cacheMandiPrices(records: MandiPriceRecord[]): void {
  if (!records.every(isMandiPriceRecord)) {
    throw new Error('Only validated official market-price records may be cached.');
  }
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Could not cache official mandi prices.', error);
  }
}

export function sortMandiPrices(
  records: MandiPriceRecord[],
  commodity: string,
): MandiPriceRecord[] {
  return records
    .filter((record) =>
      commodity === 'All'
        ? true
        : record.commodity.toLowerCase() === commodity.toLowerCase(),
    )
    .toSorted((left, right) => right.modalPricePerQuintal - left.modalPricePerQuintal);
}
