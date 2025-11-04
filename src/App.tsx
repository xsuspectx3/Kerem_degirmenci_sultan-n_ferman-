import React, { useState, useCallback } from 'react';
import type { Territory, InitialState, GameRewards } from './types';
import { GoldIcon, PopulationIcon, SwordIcon, FoodIcon, HouseIcon, BarracksIcon, FarmIcon, MarketplaceIcon, GranaryIcon, WatchtowerIcon, MadrassaIcon, GarrisonIcon } from './components/icons';
import { MiniGameModal } from './components/MiniGameModal';
import { Tooltip } from './components/Tooltip';
import { ConquestMiniGameModal } from './components/ConquestMiniGameModal';
import LandingPage from './components/LandingPage';

type Building = 'house' | 'barracks' | 'farm' | 'marketplace' | 'granary' | 'watchtower' | 'madrassa';

const BuildingCosts: Record<Building, { gold: number }> = {
    house: { gold: 1000 },
    barracks: { gold: 3500 },
    farm: { gold: 500 },
    marketplace: { gold: 2000 },
    granary: { gold: 800 },
    watchtower: { gold: 1500 },
    madrassa: { gold: 3000 },
};

const initialTerritories: Territory[] = [
    // Scaled by 3x, added garrisonedTroops
    { id: 'sogut', name: 'Söğüt', owner: 'player', militaryStrength: 5, baseGoldIncome: 100, houses: 1, barracks: 0, farms: 1, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M65610 113724 L118098 113724 L118098 157464 L65610 157464 Z", labelCoords: { x: 91854, y: 135594 } },
    { id: 'karacahisar', name: 'Karacahisar', owner: 'neutral', militaryStrength: 10, baseGoldIncome: 50, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M122472 113724 L174960 113724 L174960 157464 L122472 157464 Z", labelCoords: { x: 148716, y: 135594 } },
    { id: 'yarhisar', name: 'Yarhisar', owner: 'neutral', militaryStrength: 30, baseGoldIncome: 80, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M179334 113724 L231822 113724 L231822 157464 L179334 157464 Z", labelCoords: { x: 205578, y: 135594 } },
    { id: 'bilecik', name: 'Bilecik', owner: 'neutral', militaryStrength: 25, baseGoldIncome: 75, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M65610 161838 L118098 161838 L118098 205578 L65610 205578 Z", labelCoords: { x: 91854, y: 183708 } },
    { id: 'inegol', name: 'İnegöl', owner: 'neutral', militaryStrength: 40, baseGoldIncome: 120, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M122472 161838 L174960 161838 L174960 205578 L122472 205578 Z", labelCoords: { x: 148716, y: 183708 } },
    { id: 'yenisehir', name: 'Yenişehir', owner: 'neutral', militaryStrength: 60, baseGoldIncome: 150, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M65610 209952 L118098 209952 L118098 253692 L65610 253692 Z", labelCoords: { x: 91854, y: 231822 } },
    { id: 'bursa', name: 'Bursa', owner: 'neutral', militaryStrength: 150, baseGoldIncome: 300, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M179334 161838 L231822 161838 L231822 205578 L179334 205578 Z", labelCoords: { x: 205578, y: 183708 } },
    { id: 'iznik', name: 'İznik', owner: 'neutral', militaryStrength: 120, baseGoldIncome: 250, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M122472 209952 L174960 209952 L174960 253692 L122472 253692 Z", labelCoords: { x: 148716, y: 231822 } },
    { id: 'eskisehir', name: 'Eskişehir', owner: 'neutral', militaryStrength: 90, baseGoldIncome: 180, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M65610 258066 L118098 258066 L118098 301806 L65610 301806 Z", labelCoords: { x: 91854, y: 279936 } },
    { id: 'karesiogullari', name: 'Karesioğulları', owner: 'locked', militaryStrength: 220, baseGoldIncome: 350, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M236196 161838 L288684 161838 L288684 205578 L236196 205578 Z", labelCoords: { x: 262440, y: 183708 } },
    { id: 'germiyanogullari', name: 'Germiyanoğulları', owner: 'locked', militaryStrength: 250, baseGoldIncome: 400, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M122472 258066 L174960 258066 L174960 301806 L122472 301806 Z", labelCoords: { x: 148716, y: 279936 } },
    { id: 'saruhanogullari', name: 'Saruhanoğulları', owner: 'locked', militaryStrength: 240, baseGoldIncome: 380, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M236196 209952 L288684 209952 L288684 253692 L236196 253692 Z", labelCoords: { x: 262440, y: 231822 } },
    { id: 'aydinogullari', name: 'Aydınoğulları', owner: 'locked', militaryStrength: 260, baseGoldIncome: 420, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M179334 258066 L231822 258066 L231822 301806 L179334 301806 Z", labelCoords: { x: 205578, y: 279936 } },
    { id: 'ankara', name: 'Ankara', owner: 'neutral', militaryStrength: 180, baseGoldIncome: 280, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M179334 209952 L231822 209952 L231822 253692 L179334 253692 Z", labelCoords: { x: 205578, y: 231822 } },
    { id: 'candarogullari', name: 'Candaroğulları', owner: 'locked', militaryStrength: 280, baseGoldIncome: 450, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M236196 113724 L288684 113724 L288684 157464 L236196 157464 Z", labelCoords: { x: 262440, y: 135594 } },
    { id: 'konstantiniyye', name: 'Konstantiniyye', owner: 'locked', militaryStrength: 1000, baseGoldIncome: 1000, houses: 0, barracks: 0, farms: 0, marketplaces: 0, granaries: 0, watchtowers: 0, madrassas: 0, garrisonedTroops: 0, pathData: "M131220 8748 L218700 8748 L218700 52488 L131220 52488 Z", labelCoords: { x: 174960, y: 30618 } }
];

const initialNeutralIds = initialTerritories.filter(t => t.owner === 'neutral' && t.id.indexOf('oglu') === -1).map(t => t.id);
const secondaryLockedIds = initialTerritories.filter(t => t.owner === 'locked' && t.id !== 'konstantiniyye').map(t => t.id);


const initialState: InitialState = {
    day: 1,
    gold: 10000,
    population: 10,
    populationCapacity: 10 + 5, // Base + 1 initial house
    militaryPower: 0,
    foodProduction: 10, // 1 initial farm
    foodStorage: 20,
    foodStorageCapacity: 50, // Base capacity
    foodConsumption: 1,
    territories: initialTerritories,
    sciencePoints: 0,
    purchasedTechs: [],
};

const roosterSound = new Audio('https://www.soundjay.com/misc/sounds/rooster-crowing-1.mp3');

function App() {
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [gameState, setGameState] = useState<InitialState>(initialState);
    const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
    const [gameLog, setGameLog] = useState<string[]>(["Osmanoğulları Beyliği kuruldu!"]);
    const [activeMiniGame, setActiveMiniGame] = useState<'ottomanTrivia' | 'villagerDispute' | null>(null);
    const [conquestGameTerritory, setConquestGameTerritory] = useState<Territory | null>(null);
    const [isVictory, setIsVictory] = useState(false);

    const addLog = useCallback((message: string) => {
        setGameLog(prev => [`Gün ${gameState.day}: ${message}`, ...prev.slice(0, 9)]);
    }, [gameState.day]);

    const handleBuild = useCallback((building: Building, territoryId: string) => {
        setGameState(prev => {
            const cost = BuildingCosts[building].gold;
            if (prev.gold < cost) {
                addLog("Yeterli altınınız yok!");
                return prev;
            }

            const territoryIndex = prev.territories.findIndex(t => t.id === territoryId);
            if (territoryIndex === -1) return prev;
            
            const territory = prev.territories[territoryIndex];
            if (building === 'barracks' && territory.barracks >= territory.houses) {
                addLog("Yeni kışla için bu bölgede daha fazla eve ihtiyacınız var!");
                return prev;
            }

            const newTerritories = [...prev.territories];
            const updatedTerritory = { ...newTerritories[territoryIndex] };

            let newState = { ...prev, gold: prev.gold - cost };

            switch (building) {
                case 'house':
                    updatedTerritory.houses++;
                    newState.populationCapacity += 5;
                    addLog(`${updatedTerritory.name} bölgesine 1 Ev inşa edildi.`);
                    break;
                case 'barracks':
                    updatedTerritory.barracks++;
                    newState.militaryPower += 5;
                    addLog(`${updatedTerritory.name} bölgesine 1 Kışla inşa edildi.`);
                    break;
                case 'farm':
                    updatedTerritory.farms++;
                    newState.foodProduction += 10;
                    addLog(`${updatedTerritory.name} bölgesine 1 Tarla inşa edildi.`);
                    break;
                case 'marketplace':
                    updatedTerritory.marketplaces++;
                    addLog(`${updatedTerritory.name} bölgesine 1 Pazar Yeri inşa edildi. (+100 Altın/Gün)`);
                    break;
                case 'granary':
                    updatedTerritory.granaries++;
                    newState.foodStorageCapacity += 100; // Her ambar kapasiteyi 100 artırır
                    addLog(`${updatedTerritory.name} bölgesine 1 Tahıl Ambarı inşa edildi. (Kapasite +100)`);
                    break;
                case 'watchtower':
                    updatedTerritory.watchtowers++;
                    addLog(`${updatedTerritory.name} bölgesine 1 Gözcü Kulesi inşa edildi.`);
                    break;
                case 'madrassa':
                    updatedTerritory.madrassas++;
                    addLog(`${updatedTerritory.name} bölgesine 1 Medrese inşa edildi.`);
                    break;
            }
            newTerritories[territoryIndex] = updatedTerritory;
            newState.territories = newTerritories;

            if(selectedTerritory?.id === territoryId) {
                setSelectedTerritory(updatedTerritory);
            }

            return newState;
        });
    }, [addLog, selectedTerritory]);

    const handleGarrisonTroops = useCallback((territoryId: string, amount: number) => {
        setGameState(prev => {
            if (amount > 0 && prev.militaryPower < amount) {
                addLog("Ana orduda yeterli asker yok!");
                return prev;
            }

            const newTerritories = [...prev.territories];
            const territoryIndex = newTerritories.findIndex(t => t.id === territoryId);
            const territory = newTerritories[territoryIndex];

            if (amount < 0 && territory.garrisonedTroops < Math.abs(amount)) {
                 addLog("Garnizonda o kadar asker yok!");
                 return prev;
            }
            
            const newMilitaryPower = prev.militaryPower - amount;
            const newGarrison = territory.garrisonedTroops + amount;

            const updatedTerritory = { ...territory, garrisonedTroops: newGarrison };
            newTerritories[territoryIndex] = updatedTerritory;
            
            if(selectedTerritory?.id === territoryId) {
                setSelectedTerritory(updatedTerritory);
            }

            const action = amount > 0 ? "yerleştirildi" : "geri çekildi";
            addLog(`${territory.name} garnizonuna ${Math.abs(amount)} asker ${action}.`);

            return { ...prev, militaryPower: newMilitaryPower, territories: newTerritories };
        });
    }, [addLog, selectedTerritory]);
    
    // --- DIPLOMACY HANDLERS START ---
    const handleSendEnvoy = useCallback((territoryId: string) => {
        const territory = gameState.territories.find(t => t.id === territoryId);
        if (!territory) return;

        const successChance = Math.min(0.75, (gameState.militaryPower / (territory.militaryStrength + 1)) * 0.4);

        if (Math.random() < successChance) {
            setGameState(prev => ({
                ...prev,
                territories: prev.territories.map(t => t.id === territoryId ? { ...t, owner: 'player' } : t)
            }));
            addLog(`${territory.name} beyliği, gücünüzden etkilenerek barışçıl bir şekilde sancağınız altına girdi!`);
            setSelectedTerritory(null);
        } else {
            addLog(`Elçimiz, ${territory.name} beyi tarafından reddedildi. Barışçıl ilhak teklifi geri çevrildi.`);
        }
    }, [gameState.militaryPower, gameState.territories, addLog]);

    const handleTradeAgreement = useCallback((territoryId: string) => {
        const cost = 500;
        if (gameState.gold < cost) {
            addLog("Ticaret anlaşması için yeterli altın yok!");
            return;
        }
        const territory = gameState.territories.find(t => t.id === territoryId);
        if (!territory) return;

        setGameState(prev => ({
            ...prev,
            gold: prev.gold - cost,
            territories: prev.territories.map(t => t.id === territoryId ? { ...t, tradeAgreementUntil: prev.day + 20 } : t)
        }));
        addLog(`${territory.name} ile 20 günlük ticaret anlaşması imzalandı.`);
    }, [gameState.gold, gameState.territories, addLog]);

    const handleNonAggressionPact = useCallback((territoryId: string) => {
        const cost = 1000;
        if (gameState.gold < cost) {
            addLog("Saldırmazlık paktı için yeterli altın yok!");
            return;
        }
        const territory = gameState.territories.find(t => t.id === territoryId);
        if (!territory) return;

        setGameState(prev => ({
            ...prev,
            gold: prev.gold - cost,
            territories: prev.territories.map(t => t.id === territoryId ? { ...t, nonAggressionPactUntil: prev.day + 15 } : t)
        }));
        addLog(`${territory.name} ile 15 günlük saldırmazlık paktı imzalandı.`);
    }, [gameState.gold, gameState.territories, addLog]);

    const handleDemandTribute = useCallback((territoryId: string) => {
        const territory = gameState.territories.find(t => t.id === territoryId);
        if (!territory) return;
        
        const successChance = Math.min(0.8, (gameState.militaryPower / (territory.militaryStrength + 1)) * 0.5);

        if (Math.random() < successChance) {
            const tribute = territory.baseGoldIncome * 4;
            setGameState(prev => ({ ...prev, gold: prev.gold + tribute }));
            addLog(`${territory.name} beyliği, gücünüzden çekinerek ${tribute} altın haraç ödemeyi kabul etti.`);
        } else {
            setGameState(prev => ({
                ...prev,
                territories: prev.territories.map(t => t.id === territoryId ? { ...t, hostileUntil: prev.day + 10 } : t)
            }));
            addLog(`Haraç talebiniz ${territory.name} tarafından hakaret olarak kabul edildi! Önümüzdeki 10 gün boyunca size saldırma ihtimalleri arttı.`);
        }
    }, [gameState.militaryPower, gameState.territories, addLog]);
    // --- DIPLOMACY HANDLERS END ---

    const handleConquer = useCallback((territoryId: string) => {
        const territory = gameState.territories.find(t => t.id === territoryId);
        if (!territory || territory.owner !== 'neutral') return;

        if (gameState.militaryPower > territory.militaryStrength) {
            setConquestGameTerritory(territory);
        } else {
            const totalWatchtowers = gameState.territories.reduce((sum, t) => t.owner === 'player' ? sum + t.watchtowers : sum, 0);
            const baseLostPower = Math.min(gameState.militaryPower, 15);
            const lostPower = Math.max(1, baseLostPower - totalWatchtowers);

            setGameState(prev => ({ ...prev, militaryPower: prev.militaryPower - lostPower }));
            addLog(`${territory.name} fethi başarısız! ${lostPower} askeri güç kaybedildi.`);
            setSelectedTerritory(null);
        }
    }, [gameState.militaryPower, gameState.territories, addLog]);
    
    const handleConquestMiniGameClose = (bonusGold: number) => {
        if (!conquestGameTerritory) return;
    
        const territory = conquestGameTerritory;
        const lostMilitaryPower = Math.floor(territory.militaryStrength / 2);
    
        setGameState(prev => {
            const newMilitaryPower = prev.militaryPower - lostMilitaryPower;
            return {
                ...prev,
                gold: prev.gold + bonusGold,
                militaryPower: newMilitaryPower,
                territories: prev.territories.map(t =>
                    t.id === territory.id ? { ...t, owner: 'player' as const } : t
                ),
            }
        });
    
        addLog(`${territory.name} fethedildi! Askeri kayıp: ${lostMilitaryPower}`);
        if (bonusGold > 0) {
            addLog(`Fetih ganimeti olarak ${bonusGold} altın kazandınız!`);
        } else {
            addLog(`Ganimet fırsatı kaçırıldı!`);
        }
        
        if (territory.id === 'konstantiniyye') {
            setIsVictory(true);
        }
        
        setConquestGameTerritory(null);
        setSelectedTerritory(null);
    };

    const handleEndDay = () => {
        roosterSound.play();
        const miniGames: Array<'ottomanTrivia' | 'villagerDispute'> = ['ottomanTrivia', 'villagerDispute', 'villagerDispute', 'villagerDispute'];
        const chosenGame = miniGames[Math.floor(Math.random() * miniGames.length)];
        setActiveMiniGame(chosenGame);
    };

    const closeMiniGame = (rewards: GameRewards) => {
        setActiveMiniGame(null);
    
        setGameState(prev => {
            let goldChange = rewards.gold || 0;
            let popChange = rewards.population || 0;
    
            if (goldChange !== 0) addLog(`Günün olayı: ${goldChange > 0 ? '+' : ''}${goldChange} altın.`);
            if (popChange !== 0) addLog(`Günün olayı: ${popChange > 0 ? '+' : ''}${popChange} nüfus.`);
    
            // --- Start of Day Calculations ---
            const prevPlayerTerritories = prev.territories.filter(t => t.owner === 'player');
            const territoryIncome = prevPlayerTerritories.reduce((sum, t) => sum + t.baseGoldIncome, 0);
            const marketplaceIncome = prevPlayerTerritories.reduce((sum, t) => sum + (t.marketplaces * 100), 0);
            
            const tradeIncomeTerritories = prev.territories.filter(t => t.tradeAgreementUntil && t.tradeAgreementUntil > prev.day);
            const tradeIncome = tradeIncomeTerritories.reduce((sum, t) => sum + Math.floor(t.baseGoldIncome * 0.25), 0);
            if (tradeIncome > 0) addLog(`Ticaret anlaşmalarından ${tradeIncome} altın geldi.`);
            
            const totalMadrassas = prevPlayerTerritories.reduce((sum, t) => sum + t.madrassas, 0);
            let madrassaBonus = 0;
            for (let i = 0; i < totalMadrassas; i++) {
                if (Math.random() < 0.15) madrassaBonus += 50;
            }
            if (madrassaBonus > 0) addLog(`Medreselerden ${madrassaBonus} altın bonus geldi!`);
    
            let foodStorageBonus = 0;
            const storageRatio = prev.foodStorage / prev.foodStorageCapacity;
            if (storageRatio > 0.8) {
                foodStorageBonus = 150;
                addLog(`Dolu ambarlar refah getirdi! (+${foodStorageBonus} Altın)`);
            } else if (storageRatio < 0.1 && prev.foodStorage > 0) {
                foodStorageBonus = -100;
                addLog(`Kıtlık riski! Hazine etkilendi. (${foodStorageBonus} Altın)`);
            }
    
            const goldIncome = 500 + territoryIncome + marketplaceIncome + tradeIncome + madrassaBonus + foodStorageBonus;
            addLog(`Günlük gelir: ${goldIncome}.`);
            let newGold = prev.gold + goldIncome + goldChange;
    
            let newTerritories = prev.territories.map(t => ({ ...t }));
    
            let newPopulationCapacity = prev.populationCapacity;
            let newMilitaryPower = prev.militaryPower;
            let newFoodProduction = prev.foodProduction;
            let newFoodStorageCapacity = prev.foodStorageCapacity;
    
            // --- WAR DECLARATION PHASE (Day 25+) ---
            if (prev.day >= 25) {
                const potentialAttackers = newTerritories.filter(t => secondaryLockedIds.includes(t.id) && t.owner === 'neutral');
                const currentPlayerTerritories = newTerritories.filter(t => t.owner === 'player');
    
                if (potentialAttackers.length > 0 && currentPlayerTerritories.length > 0) {
                    potentialAttackers.forEach(attacker => {
                        if (attacker.nonAggressionPactUntil && attacker.nonAggressionPactUntil > prev.day) {
                            return; // Skip attack due to pact
                        }
                        
                        const attackChance = attacker.hostileUntil && attacker.hostileUntil > prev.day ? 0.60 : 0.15;
                        if (Math.random() < attackChance) {
                            const targetTerritory = currentPlayerTerritories[Math.floor(Math.random() * currentPlayerTerritories.length)];
                            const defenseStrength = targetTerritory.militaryStrength + targetTerritory.garrisonedTroops;
                            const attackStrength = attacker.militaryStrength;
    
                            if (defenseStrength >= attackStrength) {
                                addLog(`${attacker.name} beyliği ${targetTerritory.name} toprağınıza saldırdı! Güçlü garnizonunuz sayesinde saldırı püskürtüldü.`);
                                const attackerIndex = newTerritories.findIndex(t => t.id === attacker.id);
                                if (attackerIndex > -1) newTerritories[attackerIndex].militaryStrength = Math.floor(attacker.militaryStrength * 0.95);
                            } else {
                                addLog(`${attacker.name} beyliği ${targetTerritory.name} toprağınıza saldırdı! Savunma yetersiz kaldı ve bölgeyi kaybettiniz!`);
                                
                                newPopulationCapacity -= targetTerritory.houses * 5;
                                newMilitaryPower -= targetTerritory.barracks * 5;
                                newFoodProduction -= targetTerritory.farms * 10;
                                newFoodStorageCapacity -= targetTerritory.granaries * 100;
    
                                const targetTerritoryIndex = newTerritories.findIndex(t => t.id === targetTerritory.id);
                                if (targetTerritoryIndex > -1) {
                                    const originalTerritoryState = initialTerritories.find(it => it.id === targetTerritory.id);
                                    if (originalTerritoryState) {
                                        newTerritories[targetTerritoryIndex] = { ...originalTerritoryState };
                                    }
                                }
                            }
                        }
                    });
                }
            }
            if (newMilitaryPower < 0) newMilitaryPower = 0;
    
            let newPopulation = prev.population + popChange;
            if (newPopulation < 0) newPopulation = 0;
    
            const totalGarrisonedTroops = newTerritories.filter(t => t.owner === 'player').reduce((sum, t) => sum + t.garrisonedTroops, 0);
            const newFoodConsumption = Math.ceil(newPopulation / 10) + Math.ceil(totalGarrisonedTroops / 5);
    
            const dailyFoodBalance = newFoodProduction - newFoodConsumption;
            let newFoodStorage = Math.max(0, prev.foodStorage + dailyFoodBalance);
            newFoodStorage = Math.min(newFoodStorage, newFoodStorageCapacity);
    
            if (dailyFoodBalance >= 0 && newPopulation < newPopulationCapacity) {
                newPopulation = Math.min(newPopulation + 1, newPopulationCapacity);
            } else if (newFoodStorage <= 0 && dailyFoodBalance < 0) {
                addLog("Kıtlık! Nüfus azalıyor!");
                if (newPopulation > 0) newPopulation--;
            } else if (newPopulation >= newPopulationCapacity && newPopulation > 0) {
                 addLog("Nüfus kapasitesi dolu!");
            }
    
            const conqueredInitialNeutrals = newTerritories.filter(t => initialNeutralIds.includes(t.id) && t.owner === 'player').length === initialNeutralIds.length;
            const conqueredSecondaries = newTerritories.filter(t => secondaryLockedIds.includes(t.id) && t.owner === 'player').length === secondaryLockedIds.length;
    
            let territoryUnlocked = false;
            const finalTerritories = newTerritories.map(t => {
                if (secondaryLockedIds.includes(t.id) && t.owner === 'locked' && conqueredInitialNeutrals) {
                    if (!territoryUnlocked) addLog(`Büyük beyliklerin kilidi açıldı! Artık fethedilebilirler ama dikkatli olun, size saldırabilirler!`);
                    territoryUnlocked = true;
                    return { ...t, owner: 'neutral' as const };
                }
                if (t.id === 'konstantiniyye' && t.owner === 'locked' && conqueredSecondaries) {
                    addLog("Tüm beylikler fethedildi! Konstantiniyye'nin kapıları açıldı!");
                    return { ...t, owner: 'neutral' as const };
                }
                return t;
            });
    
            return {
                ...prev,
                day: prev.day + 1,
                gold: newGold,
                population: newPopulation,
                populationCapacity: newPopulationCapacity,
                militaryPower: newMilitaryPower,
                foodProduction: newFoodProduction,
                foodStorage: newFoodStorage,
                foodStorageCapacity: newFoodStorageCapacity,
                foodConsumption: newFoodConsumption,
                territories: finalTerritories,
            };
        });
    };

    const territoryColors: Record<Territory['owner'], string> = {
        player: '#D7263D', neutral: '#F4E2CD', locked: '#545454'
    };
    
    if (!isGameStarted) {
        return <LandingPage onStartGame={() => setIsGameStarted(true)} />;
    }

    return (
        <div className="bg-cover bg-center min-h-screen" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1590922494220-a21e643666c0?q=80&w=2500&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
            <div className="flex flex-col md:flex-row h-screen p-4 gap-4 bg-black bg-opacity-40">
                <div className="flex-grow flex flex-col items-center justify-center p-4 rounded-lg bg-[#F3EADF] bg-opacity-90 shadow-2xl">
                    <h1 className="text-6xl font-serif text-[#5a2d0c] mb-6 drop-shadow-lg">Sultan'ın Fermanı</h1>
                    <svg viewBox="0 0 295000 310000" className="w-full h-full">
                        {gameState.territories.map(t => (
                            <g key={t.id} onClick={() => setSelectedTerritory(t)} className="cursor-pointer group">
                                <path d={t.pathData} fill={territoryColors[t.owner]} stroke="#5a2d0c" strokeWidth="150" className="transition-all duration-300 group-hover:opacity-80" />
                                <text x={t.labelCoords.x} y={t.labelCoords.y} textAnchor="middle" alignmentBaseline="middle" fontSize="6000" fill={t.owner === 'player' || t.owner === 'locked' ? 'white' : '#5a2d0c'} className="font-serif font-bold pointer-events-none drop-shadow-md">
                                    {t.name}
                                </text>
                                {t.owner === 'locked' && <text x={t.labelCoords.x} y={t.labelCoords.y + 7000} textAnchor="middle" fontSize="10000" fill="white">🔒</text>}
                            </g>
                        ))}
                    </svg>
                </div>
                <div className="w-full md:w-[450px] flex-shrink-0 flex flex-col gap-4">
                    <div className="bg-[#F3EADF] bg-opacity-90 p-4 rounded-lg shadow-xl border-2 border-[#C19A6B]">
                        <h2 className="text-3xl font-serif text-[#5a2d0c] mb-4 text-center">Beylik Durumu - Gün {gameState.day}</h2>
                        <div className="grid grid-cols-2 gap-4 text-lg text-[#3D2B1F]">
                            <Tooltip text="Altın, bina inşa etmek ve ordu kurmak için kullanılır. Pazaryerlerinden, fethedilen topraklardan ve olaylardan kazanılır.">
                                <div className="flex items-center gap-2"><GoldIcon className="w-8 h-8 text-yellow-500" /> <strong>Altın:</strong> {gameState.gold}</div>
                            </Tooltip>
                             <Tooltip text="Nüfus, yiyecek tüketir ve ordu için asker kaynağıdır. Evler nüfus kapasitesini artırır.">
                                <div className="flex items-center gap-2"><PopulationIcon className="w-8 h-8 text-blue-600" /> <strong>Nüfus:</strong> {gameState.population} / {gameState.populationCapacity}</div>
                            </Tooltip>
                            <Tooltip text="Ordu gücü, toprakları fethetmek ve savunmak için kullanılır. Kışlalarda eğitilir ve garnizonlara yerleştirilebilir.">
                                <div className="flex items-center gap-2"><SwordIcon className="w-8 h-8 text-red-700" /> <strong>Ordu:</strong> {gameState.militaryPower}</div>
                            </Tooltip>
                            <Tooltip text={`Yiyecek, nüfusun ve garnizonların günlük tüketimini karşılar. Tarlalarda üretilir ve ambarlarda depolanır. Dolu ambarlar hazineye bonus altın sağlar. (Üretim: +${gameState.foodProduction} / Tüketim: -${gameState.foodConsumption})`}>
                                <div className="flex items-center gap-2"><FoodIcon className="w-8 h-8 text-green-600" /> <strong>Ambar:</strong> {gameState.foodStorage} / {gameState.foodStorageCapacity}</div>
                            </Tooltip>
                        </div>
                        <button onClick={handleEndDay} className="w-full mt-4 bg-[#8B4513] text-white py-3 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 text-xl font-bold shadow-lg">Huzur'a Çekil</button>
                    </div>

                    <div className="bg-[#F3EADF] bg-opacity-90 p-4 rounded-lg shadow-xl flex-grow border-2 border-[#C19A6B] overflow-y-auto">
                        {selectedTerritory ? (
                            <div>
                                <h3 className="text-3xl font-serif text-[#5a2d0c] mb-3">{selectedTerritory.name}</h3>
                                <p><strong>Durum:</strong> {selectedTerritory.owner === 'player' ? 'Sizin' : selectedTerritory.owner === 'neutral' ? 'Tarafsız' : 'Kilitli'}</p>
                                <p><strong>Askeri Güç:</strong> {selectedTerritory.owner === 'player' ? `${selectedTerritory.militaryStrength} (+${selectedTerritory.garrisonedTroops})` : selectedTerritory.militaryStrength}</p>
                                <p><strong>Temel Gelir:</strong> {selectedTerritory.baseGoldIncome}</p>
                                
                                {selectedTerritory.owner === 'locked' && (
                                    <div className="mt-4 p-3 bg-[#e0d3bf] rounded-md border border-[#c19a6b]">
                                        <h4 className="font-bold text-[#5a2d0c]">Fetih Şartı</h4>
                                        {secondaryLockedIds.includes(selectedTerritory.id) && (
                                            <p className="text-sm text-[#3D2B1F] mt-1">
                                                Bu beyliğe meydan okumak için önce çevredeki tüm tarafsız toprakları (beyaz renkliler) fethetmelisiniz. Komşularınıza gücünüzü gösterin!
                                            </p>
                                        )}
                                        {selectedTerritory.id === 'konstantiniyye' && (
                                            <p className="text-sm text-[#3D2B1F] mt-1">
                                                Konstantiniyye'nin fethi için Anadolu'daki tüm Türk beyliklerini sancağınız altında birleştirmelisiniz. Birlik olmadan bu güçlü kaleyi fethetmek imkansızdır.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {selectedTerritory.owner === 'player' && (
                                  <>
                                    <div className="mt-4 border-t-2 border-[#C19A6B] pt-3">
                                        <h4 className="text-xl font-serif text-[#5a2d0c] mb-2">Binalar</h4>
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <Tooltip text="Nüfus kapasitesini 5 artırır. Daha fazla kışla inşa etmek için gereklidir.">
                                                <p className="flex items-center gap-1"><HouseIcon className="w-5 h-5"/> Ev: {selectedTerritory.houses}</p>
                                            </Tooltip>
                                            <Tooltip text="Ordu gücünü 5 artırır. İnşa edilebilecek kışla sayısı, bölgedeki ev sayısını geçemez.">
                                                <p className="flex items-center gap-1"><BarracksIcon className="w-5 h-5"/> Kışla: {selectedTerritory.barracks}</p>
                                            </Tooltip>
                                            <Tooltip text="Günlük yiyecek üretimini 10 artırır.">
                                                <p className="flex items-center gap-1"><FarmIcon className="w-5 h-5"/> Tarla: {selectedTerritory.farms}</p>
                                            </Tooltip>
                                            <Tooltip text="Günlük altın gelirini 100 artırır.">
                                                <p className="flex items-center gap-1"><MarketplaceIcon className="w-5 h-5"/> Pazar: {selectedTerritory.marketplaces}</p>
                                            </Tooltip>
                                            <Tooltip text="Yiyecek depolama kapasitesini 100 artırır. Depolar %80'den fazlaysa bonus altın kazandırır.">
                                                <p className="flex items-center gap-1"><GranaryIcon className="w-5 h-5"/> Ambar: {selectedTerritory.granaries}</p>
                                            </Tooltip>
                                            <Tooltip text="Başarısız fetih girişimlerindeki asker kaybını azaltır.">
                                                <p className="flex items-center gap-1"><WatchtowerIcon className="w-5 h-5"/> Kule: {selectedTerritory.watchtowers}</p>
                                            </Tooltip>
                                            <Tooltip text="Her gün küçük bir şansla hazineye bonus altın ekler.">
                                                <p className="flex items-center gap-1"><MadrassaIcon className="w-5 h-5"/> Medrese: {selectedTerritory.madrassas}</p>
                                            </Tooltip>
                                            <Tooltip text="Bölgede konuşlanmış asker sayısı. Bölgenin savunma gücünü artırır ancak yiyecek tüketir.">
                                                <p className="flex items-center gap-1"><GarrisonIcon className="w-5 h-5"/> Garnizon: {selectedTerritory.garrisonedTroops}</p>
                                            </Tooltip>
                                        </div>
                                        <h4 className="text-xl font-serif text-[#5a2d0c] mb-2">İnşa Et</h4>
                                        <div className="space-y-2">
                                            <button onClick={() => handleBuild('house', selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Ev İnşa Et ({BuildingCosts.house.gold} Altın)</button>
                                            <button onClick={() => handleBuild('barracks', selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Kışla İnşa Et ({BuildingCosts.barracks.gold} Altın)</button>
                                            <button onClick={() => handleBuild('farm', selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Tarla İnşa Et ({BuildingCosts.farm.gold} Altın)</button>
                                            <button onClick={() => handleBuild('marketplace', selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Pazar Yeri İnşa Et ({BuildingCosts.marketplace.gold} Altın)</button>
                                            <button onClick={() => handleBuild('granary', selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Tahıl Ambarı İnşa Et ({BuildingCosts.granary.gold} Altın)</button>
                                            <button onClick={() => handleBuild('watchtower', selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Gözcü Kulesi İnşa Et ({BuildingCosts.watchtower.gold} Altın)</button>
                                            <button onClick={() => handleBuild('madrassa', selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Medrese İnşa Et ({BuildingCosts.madrassa.gold} Altın)</button>
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t-2 border-[#C19A6B] pt-3">
                                        <h4 className="text-xl font-serif text-[#5a2d0c] mb-2">Garnizon Yönetimi</h4>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <button onClick={() => handleGarrisonTroops(selectedTerritory.id, 10)} className="p-2 bg-green-700 text-white rounded w-full hover:bg-green-800 transition text-sm">+10 Asker Yerleştir</button>
                                            <button onClick={() => handleGarrisonTroops(selectedTerritory.id, -10)} className="p-2 bg-red-800 text-white rounded w-full hover:bg-red-900 transition text-sm">-10 Asker Geri Çek</button>
                                            <button onClick={() => handleGarrisonTroops(selectedTerritory.id, 1)} className="p-2 bg-green-600 text-white rounded w-full hover:bg-green-700 transition text-sm">+1 Asker Yerleştir</button>
                                            <button onClick={() => handleGarrisonTroops(selectedTerritory.id, -1)} className="p-2 bg-red-700 text-white rounded w-full hover:bg-red-800 transition text-sm">-1 Asker Geri Çek</button>
                                        </div>
                                    </div>
                                  </>
                                )}
                                {selectedTerritory.owner === 'neutral' && (
                                    <>
                                        <button onClick={() => handleConquer(selectedTerritory.id)} className="w-full mt-4 bg-red-800 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition duration-200 font-bold">Fethet (Güç: {selectedTerritory.militaryStrength})</button>
                                        <div className="mt-4 border-t-2 border-[#C19A6B] pt-3">
                                            <h4 className="text-xl font-serif text-[#5a2d0c] mb-2">Diplomatik Hamleler</h4>
                                            <div className="space-y-2">
                                                <Tooltip text="Barışçıl ilhak teklifi gönder. Başarı şansı askeri gücünüze bağlıdır. Başarısız olursa hiçbir şey olmaz.">
                                                    <button onClick={() => handleSendEnvoy(selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Elçi Gönder</button>
                                                </Tooltip>
                                                <Tooltip text="20 gün boyunca bu beylikten ek gelir elde et. Maliyet: 500 Altın.">
                                                    <button onClick={() => handleTradeAgreement(selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition" disabled={!!selectedTerritory.tradeAgreementUntil}>Ticaret Anlaşması Yap</button>
                                                </Tooltip>
                                                <Tooltip text="Bu beyliğin 15 gün boyunca size saldırmasını engelle. Maliyet: 1000 Altın.">
                                                     <button onClick={() => handleNonAggressionPact(selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition" disabled={!!selectedTerritory.nonAggressionPactUntil}>Saldırmazlık Paktı İmzala</button>
                                                </Tooltip>
                                                <Tooltip text="Anında altın talep et. Başarı şansı gücünüze bağlı. Başarısızlık, beyliği düşman yapar ve saldırı riskini artırır.">
                                                    <button onClick={() => handleDemandTribute(selectedTerritory.id)} className="w-full p-2 bg-[#D2B48C] text-left rounded hover:bg-[#C19A6B] transition">Haraç Talep Et</button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full"><p className="text-xl text-gray-500 font-serif">Detaylar için bir bölge seçin.</p></div>
                        )}
                    </div>

                    <div className="bg-[#F3EADF] bg-opacity-90 p-4 rounded-lg shadow-xl h-48 overflow-y-auto border-2 border-[#C19A6B]">
                        <h3 className="text-xl font-serif text-[#5a2d0c] mb-2">Vakanüvis</h3>
                        <div className="space-y-1">
                            {gameLog.map((log, index) => (<p key={index} className="text-sm text-[#3D2B1F] border-b border-[#C19A6B] pb-1">{log}</p>))}
                        </div>
                    </div>
                </div>
                {activeMiniGame && <MiniGameModal day={gameState.day} gameType={activeMiniGame} onClose={closeMiniGame} />}
                {conquestGameTerritory && <ConquestMiniGameModal territory={conquestGameTerritory} onClose={handleConquestMiniGameClose} />}
                {isVictory && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                        <div className="bg-[#F3EADF] p-10 rounded-lg shadow-2xl border-4 border-yellow-500 text-center">
                            <h2 className="text-5xl font-serif text-yellow-700 mb-4">ZAFER!</h2>
                            <p className="text-2xl text-[#5a2d0c]">Konstantiniyye düştü! Osmanoğulları artık bir İmparatorluk!</p>
                            <p className="text-lg mt-2">Oyunu {gameState.day} günde tamamladınız.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
