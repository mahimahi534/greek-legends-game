import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';
import '../data/characters_data.dart';
import '../art/character_painter.dart';
import '../art/landscape_painter.dart';
import '../widgets/greek_header.dart';

class CharacterCollectionScreen extends StatefulWidget {
  final PlayerProfile profile;
  final ValueChanged<String> onSelectGuardian;
  final VoidCallback onBack;
  final VoidCallback onOpenSettings;
  final VoidCallback onToggleSound;

  const CharacterCollectionScreen({
    super.key,
    required this.profile,
    required this.onSelectGuardian,
    required this.onBack,
    required this.onOpenSettings,
    required this.onToggleSound,
  });

  @override
  State<CharacterCollectionScreen> createState() => _CharacterCollectionScreenState();
}

class _CharacterCollectionScreenState extends State<CharacterCollectionScreen> {
  late CharacterModel _selectedCharacter;

  @override
  void initState() {
    super.initState();
    _selectedCharacter = allCharacters.firstWhere(
      (c) => c.id == widget.profile.selectedCharacterId,
      orElse: () => allCharacters.first,
    );
  }

  @override
  Widget build(BuildContext context) {
    final isSelectedUnlocked = widget.profile.unlockedCharacterIds.contains(_selectedCharacter.id);
    final isEquipped = widget.profile.selectedCharacterId == _selectedCharacter.id;

    return Scaffold(
      backgroundColor: const Color(0xFF070D1E),
      body: Stack(
        children: [
          const Positioned.fill(
            child: LandscapeWidget(theme: 'olympus'),
          ),

          SafeArea(
            child: Column(
              children: [
                GreekHeader(
                  title: 'PANTHEON GALLERY',
                  subtitle: '${widget.profile.unlockedCharacterIds.length} / ${allCharacters.length} Gods Unlocked',
                  profile: widget.profile,
                  showBack: true,
                  onBack: widget.onBack,
                  onOpenSettings: widget.onOpenSettings,
                  onToggleSound: widget.onToggleSound,
                ),

                // Top Grid of Characters
                SizedBox(
                  height: 120,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    itemCount: allCharacters.length,
                    itemBuilder: (context, idx) {
                      final char = allCharacters[idx];
                      final isUnlocked = widget.profile.unlockedCharacterIds.contains(char.id);
                      final isCurrentSelected = _selectedCharacter.id == char.id;

                      return GestureDetector(
                        onTap: () {
                          SystemSound.play(SystemSoundType.click);
                          setState(() => _selectedCharacter = char);
                        },
                        child: Container(
                          margin: const EdgeInsets.only(right: 12),
                          padding: const EdgeInsets.all(6),
                          decoration: BoxDecoration(
                            color: isCurrentSelected
                                ? const Color(0x66F59E0B)
                                : Colors.black45,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isCurrentSelected
                                  ? const Color(0xFFFFD700)
                                  : isUnlocked
                                      ? const Color(0x44F59E0B)
                                      : Colors.grey.shade800,
                              width: isCurrentSelected ? 2 : 1,
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              CharacterWidget(id: char.id, size: 54, isUnlocked: isUnlocked),
                              const SizedBox(height: 4),
                              Text(
                                char.name,
                                style: TextStyle(
                                  color: isCurrentSelected ? const Color(0xFFFFD700) : Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Selected Character Detailed Sheet
                Expanded(
                  child: Container(
                    margin: const EdgeInsets.all(16),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Color(0xFF0F1B38), Color(0xFF050B17)],
                      ),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0x66F59E0B)),
                    ),
                    child: SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Row(
                            children: [
                              CharacterWidget(
                                id: _selectedCharacter.id,
                                size: 68,
                                isUnlocked: isSelectedUnlocked,
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _selectedCharacter.domain.toUpperCase(),
                                      style: const TextStyle(
                                        color: Color(0xFFFDE68A),
                                        fontSize: 9,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 1.2,
                                      ),
                                    ),
                                    Text(
                                      _selectedCharacter.name,
                                      style: const TextStyle(
                                        color: Color(0xFFFFD700),
                                        fontSize: 22,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      _selectedCharacter.title,
                                      style: const TextStyle(color: Colors.white70, fontSize: 11),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 14),

                          // Quote Box
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: const Color(0x443B1C0B),
                              borderRadius: BorderRadius.circular(10),
                              border: const Border(
                                left: BorderSide(color: Color(0xFFFFD700), width: 3),
                              ),
                            ),
                            child: Text(
                              '"${_selectedCharacter.quote}"',
                              style: const TextStyle(
                                color: Color(0xFFFDE68A),
                                fontStyle: FontStyle.italic,
                                fontSize: 11,
                              ),
                            ),
                          ),
                          const SizedBox(height: 14),

                          const Text('Mythology Lore',
                              style: TextStyle(color: Color(0xFFFFD700), fontSize: 12, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 4),
                          Text(
                            _selectedCharacter.mythDescription,
                            style: const TextStyle(color: Colors.white70, fontSize: 11, height: 1.4),
                          ),
                          const SizedBox(height: 12),

                          // Divine Blessing Card
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0x441E1B4B),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF38BDF8)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Icon(Icons.auto_awesome, color: Color(0xFF67E8F9), size: 14),
                                    const SizedBox(width: 6),
                                    Text(
                                      'DIVINE BLESSING: ${_selectedCharacter.blessing.name}',
                                      style: const TextStyle(
                                        color: Color(0xFF67E8F9),
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _selectedCharacter.blessing.description,
                                  style: const TextStyle(color: Colors.white, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Equip Button
                          if (isSelectedUnlocked)
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: isEquipped ? Colors.teal : const Color(0xFFF59E0B),
                                foregroundColor: Colors.black,
                                minimumSize: const Size.fromHeight(44),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                              onPressed: isEquipped
                                  ? null
                                  : () {
                                      SystemSound.play(SystemSoundType.click);
                                      widget.onSelectGuardian(_selectedCharacter.id);
                                    },
                              child: Text(
                                isEquipped ? '✓ ACTIVE GUARDIAN' : 'EQUIP AS GUARDIAN',
                                style: const TextStyle(fontWeight: FontWeight.bold),
                              ),
                            )
                          else
                            Container(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade900,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.white12),
                              ),
                              child: Center(
                                child: Text(
                                  'Unlocks at Level ${_selectedCharacter.unlockLevel}',
                                  style: const TextStyle(color: Colors.white54, fontSize: 12),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
