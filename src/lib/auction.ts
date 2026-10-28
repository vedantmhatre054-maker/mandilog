export type AuctionCategory = 'Vegetables' | 'Fruits' | 'Grains';

export interface LocalMarketplaceListing {
  id: string;
  slug: string;
  title: string;
  category: AuctionCategory;
  grade: string;
  quantity: string;
  location: string;
  currentBid: number;
  floorPrice: number;
  totalBids: number;
  timeLeft: string;
  farmer: string;
  imageEmoji: string;
}

export interface LocalAuctionOffer {
  id: string;
  buyer: string;
  amount: number;
  createdAt: string;
}

const listingsKey = 'mandilog-auction-listings';
const offersKey = 'mandilog-auction-offers';

function isListing(value: unknown): value is LocalMarketplaceListing {
  if (typeof value !== 'object' || value === null) return false;
  const listing = value as Record<string, unknown>;
  return (
    typeof listing.id === 'string' &&
    typeof listing.slug === 'string' &&
    typeof listing.title === 'string' &&
    (listing.category === 'Vegetables' ||
      listing.category === 'Fruits' ||
      listing.category === 'Grains') &&
    typeof listing.grade === 'string' &&
    typeof listing.quantity === 'string' &&
    typeof listing.location === 'string' &&
    typeof listing.currentBid === 'number' &&
    typeof listing.floorPrice === 'number' &&
    typeof listing.totalBids === 'number' &&
    typeof listing.timeLeft === 'string' &&
    typeof listing.farmer === 'string' &&
    typeof listing.imageEmoji === 'string'
  );
}

export function getLocalMarketplaceListings(): LocalMarketplaceListing[] {
  const raw = window.localStorage.getItem(listingsKey);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('Saved auction listings have an invalid format.');
  }
  return parsed.filter(isListing);
}

export function saveLocalMarketplaceListing(
  listing: LocalMarketplaceListing,
): void {
  const current = getLocalMarketplaceListings();
  window.localStorage.setItem(
    listingsKey,
    JSON.stringify([listing, ...current]),
  );
}

export function getLocalAuctionOffers(slug: string): LocalAuctionOffer[] {
  const raw = window.localStorage.getItem(offersKey);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Saved auction offers have an invalid format.');
  }
  const offers = (parsed as Record<string, unknown>)[slug];
  if (!Array.isArray(offers)) return [];
  return offers.filter(
    (offer): offer is LocalAuctionOffer =>
      typeof offer === 'object' &&
      offer !== null &&
      typeof offer.id === 'string' &&
      typeof offer.buyer === 'string' &&
      typeof offer.amount === 'number' &&
      typeof offer.createdAt === 'string',
  );
}

export function saveLocalAuctionOffers(
  slug: string,
  offers: LocalAuctionOffer[],
): void {
  const raw = window.localStorage.getItem(offersKey);
  const parsed: unknown = raw ? JSON.parse(raw) : {};
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Saved auction offers have an invalid format.');
  }
  window.localStorage.setItem(
    offersKey,
    JSON.stringify({ ...parsed, [slug]: offers }),
  );
}
