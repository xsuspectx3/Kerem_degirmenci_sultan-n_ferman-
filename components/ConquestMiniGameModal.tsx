import React, { useState, useMemo } from 'react';
import { Territory } from '../types';

// Simple SVG icons for siege equipment, defined locally to keep changes contained.
const BatteringRamIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 4H4V10H2V12H4V20H6V12H18V4H20V2H18V4ZM8 6H10V10H8V6ZM12 6H14V10H12V6Z"/></svg>
);

// Replaced CatapultIcon with a more thematic CannonIcon for "Topçular"
const CannonIcon = ({ className }: { className?: string }) => (
     <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6.5" cy="18.5" r="2.5" />
        <circle cx="15.5" cy="18.5" r="2.5" />
        <path d="M17 16H5V9h12l3-4H8v2h11l-3 4z" />
    </svg>
);

const SappersIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 2L6 7V13H2V15H3.2L6 20.8L7.8 20L5.3 15H11V22H13V15H18.7L16.2 20L18 20.8L20.8 15H22V13H18V7L13 2H11Z"/></svg>
);


type TacticID = 'batteringRam' | 'artillery' | 'sappers';
type WeakPointID = 'gate' | 'wall' | 'tower';

interface Tactic {
    id: TacticID;
    name: string;
    Icon: React.FC<{ className?: string }>;
}

const TACTICS: Record<TacticID, Tactic> = {
    batteringRam: { id: 'batteringRam', name: 'Koçbaşı', Icon: BatteringRamIcon },
    artillery: { id: 'artillery', name: 'Topçular', Icon: CannonIcon },
    sappers: { id: 'sappers', name: 'Lağımcılar', Icon: SappersIcon },
};

interface WeakPoint {
    id: WeakPointID;
    name: string;
    description: string;
    solution: TacticID;
}

const WEAK_POINTS: Record<WeakPointID, Omit<WeakPoint, 'id'>> = {
    gate: { name: 'Kale Kapısı', description: 'Gözcüler kapının zayıf ve çürük olduğunu rapor etti.', solution: 'batteringRam' },
    wall: { name: 'Surlar', description: 'Surların doğu kanadında yapısal bir çatlak tespit edildi.', solution: 'artillery' },
    tower: { name: 'Gözetleme Kulesi', description: 'Kulenin temelleri, altından bir tünel kazmak için uygun.', solution: 'sappers' },
};


interface ConquestMiniGameModalProps {
  territory: Territory;
  onClose: (bonusGold: number) => void;
}

export const ConquestMiniGameModal: React.FC<ConquestMiniGameModalProps> = ({ territory, onClose }) => {
    const [gameState, setGameState] = useState<'planning' | 'success' | 'failure'>('planning');
    const [assignments, setAssignments] = useState<Record<WeakPointID, TacticID | null>>({ gate: null, wall: null, tower: null });
    const [selectedTactic, setSelectedTactic] = useState<TacticID | null>(null);

    const { scenario, potentialReward } = useMemo(() => {
        const strength = territory.militaryStrength;
        const reward = Math.floor(strength * 5);

        let weakPointKeys: WeakPointID[];
        let tacticKeys: TacticID[];

        if (strength < 80) { // Easy: 2 weak points, 2 obvious tactics
            weakPointKeys = ['gate', 'wall'];
            tacticKeys = ['batteringRam', 'artillery'];
        } else if (strength < 250) { // Medium: 2 weak points, 3 tactics (1 distractor)
            weakPointKeys = ['wall', 'tower'];
            tacticKeys = ['artillery', 'sappers', 'batteringRam'];
        } else { // Hard: 3 weak points, 3 tactics
            weakPointKeys = ['gate', 'wall', 'tower'];
            tacticKeys = ['batteringRam', 'artillery', 'sappers'];
        }

        const scenarioWeakPoints = weakPointKeys.map(id => ({ ...WEAK_POINTS[id], id }));
        const availableTactics = tacticKeys.map(id => TACTICS[id]);
        
        return { scenario: { weakPoints: scenarioWeakPoints, tactics: availableTactics }, potentialReward: reward };
    }, [territory]);

    const handleAssignTactic = (weakPointId: WeakPointID) => {
        if (!selectedTactic) return;
        setAssignments(prev => ({...prev, [weakPointId]: selectedTactic}));
        setSelectedTactic(null); // Deselect after assigning
    };

    const handleSubmit = () => {
        const isSuccess = scenario.weakPoints.every(wp => assignments[wp.id] === wp.solution);
        setGameState(isSuccess ? 'success' : 'failure');
    };

    const renderPlanning = () => (
        <>
            <h2 className="text-3xl font-serif text-[#5a2d0c] mb-2 text-center">Kuşatma Stratejisi</h2>
            <p className="text-lg text-[#3D2B1F] mb-4 text-center">Doğru birliği doğru zayıf noktaya ata.</p>
            
            <div className="space-y-4 mb-4">
                {scenario.weakPoints.map(wp => {
                    const assignedTactic = assignments[wp.id] ? TACTICS[assignments[wp.id]!] : null;
                    return (
                        <div key={wp.id} className="bg-[#D2B48C] p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-[#5a2d0c]">{wp.name}</h4>
                                <p className="text-sm text-[#3D2B1F]">{wp.description}</p>
                            </div>
                            <button 
                                onClick={() => handleAssignTactic(wp.id)}
                                className="w-20 h-16 bg-[#C19A6B] rounded-md flex items-center justify-center text-3xl hover:bg-[#b58d5e] transition-colors"
                            >
                                {assignedTactic ? <assignedTactic.Icon className="w-10 h-10 text-white" /> : '?'}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="border-t-2 border-[#C19A6B] pt-4">
                <h3 className="text-xl font-serif text-[#5a2d0c] mb-2 text-center">Mevcut Birlikler</h3>
                <div className="flex justify-center gap-4">
                    {scenario.tactics.map(tactic => {
                        const isAssigned = Object.values(assignments).includes(tactic.id);
                        return (
                            <button 
                                key={tactic.id} 
                                onClick={() => !isAssigned && setSelectedTactic(tactic.id)}
                                disabled={isAssigned}
                                className={`p-2 rounded-lg border-4 transition-all duration-200 ${selectedTactic === tactic.id ? 'border-yellow-500 scale-110' : 'border-transparent'} ${isAssigned ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#C19A6B]'}`}
                            >
                                <div className="w-20 h-20 bg-[#D2B48C] rounded-md flex flex-col items-center justify-center">
                                    <tactic.Icon className="w-10 h-10 text-[#5a2d0c]" />
                                    <span className="text-xs font-bold text-[#5a2d0c] mt-1">{tactic.name}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <button onClick={handleSubmit} className="w-full mt-6 bg-[#8B4513] text-white py-3 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 text-xl font-bold">
                Hücum Emri Ver!
            </button>
        </>
    );

    const renderResult = () => {
        const isSuccess = gameState === 'success';
        return (
            <div className="text-center">
                <h2 className="text-4xl font-serif text-[#5a2d0c] mb-4">{isSuccess ? "Kuşatma Başarılı!" : "Stratejik Hata!"}</h2>
                <p className="text-xl text-[#3D2B1F] mb-6">
                    {isSuccess 
                        ? `Zekice planınız kaleyi düşürdü! Hazineye ${potentialReward} ganimet altını ekleniyor.`
                        : "Yanlış taktikler yüzünden saldırı püskürtüldü. Ganimet fırsatı kaçırıldı."
                    }
                </p>
                <button onClick={() => onClose(isSuccess ? potentialReward : 0)} className="w-full mt-4 bg-[#8B4513] text-white py-3 px-4 rounded-lg hover:bg-[#A0522D] transition duration-200 text-xl font-bold">
                    Devam Et
                </button>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-[#F3EADF] p-8 rounded-lg shadow-2xl border-4 border-[#C19A6B] w-full max-w-lg">
                {gameState === 'planning' ? renderPlanning() : renderResult()}
            </div>
        </div>
    );
};