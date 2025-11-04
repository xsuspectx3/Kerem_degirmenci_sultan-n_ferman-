// FIX: Removed self-import of TerritoryOwner which caused a conflict.
export type TerritoryOwner = 'player' | 'neutral' | 'locked';

export interface Territory {
  id: string;
  name: string;
  owner: TerritoryOwner;
  militaryStrength: number;
  baseGoldIncome: number;
  pathData: string;
  labelCoords: { x: number; y: number };
  // Building counts per territory
  houses: number;
  barracks: number;
  farms: number;
  marketplaces: number;
  granaries: number;
  watchtowers: number;
  madrassas: number;
  garrisonedTroops: number;
  nonAggressionPactUntil?: number;
  tradeAgreementUntil?: number; // YENİ: Ticaret anlaşması bitiş günü
  hostileUntil?: number; // YENİ: Başarısız diplomasiden kaynaklanan düşmanlık bitiş günü
}

export interface InitialState {
  day: number;
  gold: number;
  population: number;
  populationCapacity: number;
  militaryPower: number; // This will now represent the 'base' military power from barracks
  foodProduction: number; // YENİ İSİM: Günlük yiyecek üretimi
  foodStorage: number; // YENİ: Depolanan yiyecek miktarı
  foodStorageCapacity: number; // YENİ: Yiyecek depolama kapasitesi
  foodConsumption: number; // Represents food consumption per day
  territories: Territory[];
  sciencePoints: number; // YENİ: İlim puanları
  purchasedTechs: string[]; // YENİ: Satın alınan teknolojiler
}

export type GameRewards = {
  gold?: number;
  population?: number;
};
