import { BoonCard, BoonId } from './types.ts';

// Note: confirm against physical card text
export const DEFAULT_BOONS: Record<BoonId, BoonCard> = {
  base_camp: {
    id: 'base_camp',
    name: 'Base Camp',
    flavorText: 'A secure clearing among ancient banyans where relics can be stashed.',
    rulesText:
      'Place any one exposed card here to hold it. Safe from Peril and not scored. You can take it back out onto an empty stack later. Stays in play while holding a card.',
    targeting: 'card',
  },
  machete: {
    id: 'machete',
    name: 'Machete',
    flavorText: 'Forged tempered steel to slice through tangled vines and stubborn blockages.',
    rulesText: 'Discard any one exposed non-Idol card, whatever its suit.',
    targeting: 'card',
  },
  rope_bridge: {
    id: 'rope_bridge',
    name: 'Rope Bridge',
    flavorText: 'Frayed hemp suspended across a treacherous canyon.',
    rulesText: 'Move any exposed card onto any other stack (not just into an empty space).',
    targeting: 'twoStacks',
  },
  map: {
    id: 'map',
    name: 'Map',
    flavorText: 'Faded cartography pointing towards upcoming terrain hazards.',
    rulesText: 'Look at the next 4 Adventure cards before they are dealt (until the round ends).',
    targeting: 'none',
  },
  lantern: {
    id: 'lantern',
    name: 'Lantern',
    flavorText: 'Brass oil lamp illuminating paths between alternate routes.',
    rulesText: 'Swap the positions of any two whole stacks.',
    targeting: 'twoStacks',
  },
};

export function getAllBoons(): BoonCard[] {
  return Object.values(DEFAULT_BOONS).map((b) => ({ ...b }));
}
