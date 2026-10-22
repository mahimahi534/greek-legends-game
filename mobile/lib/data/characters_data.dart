import '../models/game_models.dart';

final List<CharacterModel> allCharacters = [
  CharacterModel(
    id: 'zeus',
    name: 'Zeus',
    title: 'King of the Gods',
    domain: 'Sky, Thunder & Justice',
    unlockLevel: 1,
    symbolType: SymbolType.zeus,
    quote: 'The skies bow to righteous thunder!',
    mythDescription:
        'Father of gods and men, Zeus reigns from Mount Olympus wielding crackling thunderbolts forged by the Cyclopes.',
    lore:
        'As the sovereign of Mount Olympus, Zeus maintains the cosmic balance. His lightning combinations gain divine potency.',
    blessing: DivineBlessing(
      name: 'Wrath of Olympus',
      description: '+25% score on all Lightning and Golden Symbol matches.',
      bonusType: 'lightning_boost',
      bonusValue: 0.25,
    ),
  ),
  CharacterModel(
    id: 'athena',
    name: 'Athena',
    title: 'Goddess of Wisdom',
    domain: 'Wisdom, Warfare & Strategy',
    unlockLevel: 1,
    symbolType: SymbolType.athena,
    quote: 'Strategy and intellect conquer brute force.',
    mythDescription:
        'Born armed from the brow of Zeus, Athena guides heroes with tactical acumen, protected by her owl of vigilance.',
    lore:
        'Patron protector of Athens, Athena invented the chariot and olive tree. Solvers receive extra turns to achieve their victory objectives.',
    blessing: DivineBlessing(
      name: 'Aegis of Wisdom',
      description: '+3 bonus moves on every puzzle level.',
      bonusType: 'extra_moves',
      bonusValue: 3.0,
    ),
  ),
  CharacterModel(
    id: 'poseidon',
    name: 'Poseidon',
    title: 'Earth-Shaker & Sea Sovereign',
    domain: 'Oceans, Earthquakes & Storms',
    unlockLevel: 5,
    symbolType: SymbolType.poseidon,
    quote: 'The fathomless depths obey my call.',
    mythDescription:
        'Ruler of the ocean deeps and subterranean torrents, Poseidon strikes the earth with his trident to forge surging tides.',
    lore:
        'Brother to Zeus and Hades, Poseidon commands the sapphire oceans surrounding the Greek archipelago and sunken Atlantis.',
    blessing: DivineBlessing(
      name: 'Tidal Crest',
      description: '+30% bonus score on Ocean and Amphora matches.',
      bonusType: 'water_score',
      bonusValue: 0.30,
    ),
  ),
  CharacterModel(
    id: 'amphitrite',
    name: 'Amphitrite',
    title: 'Queen of Atlantis',
    domain: 'The Sunken Kingdom & Coral Depths',
    unlockLevel: 15,
    symbolType: SymbolType.poseidon,
    quote: 'The sunken heart of Atlantis whispers its ancient secrets.',
    mythDescription:
        'Nereid queen of the sea and consort to Poseidon, commanding the tidal currents, coral gardens, and sacred pearls of Atlantis.',
    lore:
        'Adorned in glowing bioluminescent pearls and sea-glass, Amphitrite reigns over the sunken palaces of Atlantis.',
    blessing: DivineBlessing(
      name: 'Atlantean Pearl',
      description: '+25% bonus score and extra +1 move on ocean levels.',
      bonusType: 'water_score',
      bonusValue: 0.25,
    ),
  ),
  CharacterModel(
    id: 'hercules',
    name: 'Hercules',
    title: 'Champion of Mortals',
    domain: 'Strength, Heroism & Endurance',
    unlockLevel: 10,
    symbolType: SymbolType.amphora,
    quote: 'No obstacle withstands unbroken will.',
    mythDescription:
        'The greatest Greek hero, renowned for his Twelve Labors, clad in the invulnerable pelt of the Nemean Lion.',
    lore:
        'Renowned from Thebes to the furthest pillars of the Mediterranean, Hercules shatters obstacle stones and marble blocks across the grid.',
    blessing: DivineBlessing(
      name: 'Nemean Might',
      description: 'Marble obstacles take double damage when matched adjacent.',
      bonusType: 'marble_crush',
      bonusValue: 2.0,
    ),
  ),
  CharacterModel(
    id: 'pegasus',
    name: 'Pegasus',
    title: 'The Winged Celestial',
    domain: 'The High Heavens & Pure Springs',
    unlockLevel: 20,
    symbolType: SymbolType.pegasus,
    quote: 'Soar above earthly burdens.',
    mythDescription:
        'Born from celestial mists, the immortal winged stallion whose hooves struck Mount Helicon to unleash the sacred Hippocrene spring.',
    lore:
        'With luminous feathers shimmering like morning frost, Pegasus carries thunderbolts and elevates your experience point gains.',
    blessing: DivineBlessing(
      name: 'Celestial Flight',
      description: '+35% bonus Experience Points (XP) earned on all completed levels.',
      bonusType: 'xp_boost',
      bonusValue: 0.35,
    ),
  ),
  CharacterModel(
    id: 'helios',
    name: 'Helios',
    title: 'Titan of the Golden Sun',
    domain: 'Solar Light, Dawn & Day',
    unlockLevel: 35,
    symbolType: SymbolType.sun,
    quote: 'Light dispels all shadows and illusions.',
    mythDescription:
        'Crowned with a radiant aureole of sunlight, Helios drives his golden chariot across the celestial dome each dawn.',
    lore:
        'The Colossus of Rhodes once stood as testament to Helios’s warmth and clarity. Matching Sun Medallions charges solar flares.',
    blessing: DivineBlessing(
      name: 'Solar Flare',
      description: '5-tile Supernovas clear an extra random row of tiles.',
      bonusType: 'solar_blast',
      bonusValue: 1.0,
    ),
  ),
  CharacterModel(
    id: 'hades',
    name: 'Hades',
    title: 'Lord of the Underworld',
    domain: 'The Subterranean & Hidden Riches',
    unlockLevel: 50,
    symbolType: SymbolType.pandora,
    quote: 'All rivers ultimately flow into eternity.',
    mythDescription:
        'Silent and majestic guardian of the underworld, wearing the Helm of Invisibility and surrounded by the subterranean gems of the earth.',
    lore:
        'Reigning over the Elysian Fields and the River Styx, Hades transforms Pandora’s Box tiles into supercharged 5x5 soul detonations.',
    blessing: DivineBlessing(
      name: 'Underworld Resonance',
      description: 'Pandora’s Box explosive radius increases from 3x3 to 5x5 burst.',
      bonusType: 'blast_boost',
      bonusValue: 2.0,
    ),
  ),
  CharacterModel(
    id: 'medusa',
    name: 'Medusa',
    title: 'Guardian of the Sacred Aegis',
    domain: 'Petrification, Protection & Warding',
    unlockLevel: 75,
    symbolType: SymbolType.temple,
    quote: 'None shall disturb the ancient sanctum.',
    mythDescription:
        'Formidable gorgon guardian, her serpentine silhouette and petrifying visage ward off the unworthy from sacred sanctuaries.',
    lore:
        'Crowned by emerald serpents with hypnotic golden irises, Medusa guards the most secluded temples of ancient Greece.',
    blessing: DivineBlessing(
      name: 'Gorgon Gaze',
      description: 'Combo score multipliers increase by +50% on consecutive cascades.',
      bonusType: 'combo_boost',
      bonusValue: 0.50,
    ),
  ),
];
