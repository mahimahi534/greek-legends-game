import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';
import '../data/characters_data.dart';
import '../art/character_painter.dart';
import '../art/landscape_painter.dart';
import '../services/storage_service.dart';

class MainMenuScreen extends StatelessWidget {
  final PlayerProfile profile;
  final String theme; // 'olympus' or 'atlantis'
  final VoidCallback onToggleTheme;
  final VoidCallback onPlay;
  final VoidCallback onOpenMap;
  final VoidCallback onOpenCharacters;
  final VoidCallback onOpenSettings;

  const MainMenuScreen({
    super.key,
    required this.profile,
    required this.theme,
    required this.onToggleTheme,
    required this.onPlay,
    required this.onOpenMap,
    required this.onOpenCharacters,
    required this.onOpenSettings,
  });

  @override
  Widget build(BuildContext context) {
    final rank = StorageService.getRankTitle(profile.totalXp);
    final activeGuardian = allCharacters.firstWhere(
      (c) => c.id == profile.selectedCharacterId,
      orElse: () => allCharacters.first,
    );

    return Scaffold(
      backgroundColor: const Color(0xFF070D1E),
      body: Stack(
        children: [
          // Background
          Positioned.fill(
            child: LandscapeWidget(theme: theme),
          ),

          // Main Menu Content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Top Bar: Guardian + Theme Toggle + Settings
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      GestureDetector(
                        onTap: () {
                          SystemSound.play(SystemSoundType.click);
                          onOpenCharacters();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0x99000000),
                            borderRadius: BorderRadius.circular(30),
                            border: Border.all(color: const Color(0x66F59E0B)),
                          ),
                          child: Row(
                            children: [
                              CharacterWidget(id: activeGuardian.id, size: 36),
                              const SizedBox(width: 8),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('GUARDIAN',
                                      style: TextStyle(color: Color(0xFFFDE68A), fontSize: 8, fontWeight: FontWeight.bold)),
                                  Text(activeGuardian.name,
                                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          // 1-Click Theme Toggle Button
                          GestureDetector(
                            onTap: () {
                              SystemSound.play(SystemSoundType.click);
                              onToggleTheme();
                            },
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(
                                color: theme == 'atlantis'
                                    ? const Color(0xCC042F40)
                                    : const Color(0xCC3E2D07),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: theme == 'atlantis' ? const Color(0xFF00CED1) : const Color(0xFFFFD700),
                                  width: 1.5,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Text(theme == 'atlantis' ? '🔱' : '⚡', style: const TextStyle(fontSize: 12)),
                                  const SizedBox(width: 4),
                                  Text(
                                    theme == 'atlantis' ? 'ATLANTIS' : 'OLYMPUS',
                                    style: TextStyle(
                                      color: theme == 'atlantis' ? const Color(0xFF67E8F9) : const Color(0xFFFFD700),
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      letterSpacing: 1.0,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          IconButton(
                            icon: const Icon(Icons.settings, color: Color(0xFFFDE68A)),
                            onPressed: () {
                              SystemSound.play(SystemSoundType.click);
                              onOpenSettings();
                            },
                          ),
                        ],
                      ),
                    ],
                  ),

                  // Center Logo & Buttons
                  Column(
                    children: [
                      Text(
                        theme == 'atlantis' ? 'SUNKEN KINGDOM OF ATLANTIS' : 'OLYMPIAN MYTHIC ADVENTURE',
                        style: TextStyle(
                          color: theme == 'atlantis' ? const Color(0xFF67E8F9) : const Color(0xFFFFD700),
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 2.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        theme == 'atlantis' ? 'ATLANTIS' : 'GREEK LEGENDS',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 38,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2.0,
                          foreground: Paint()
                            ..shader = LinearGradient(
                              colors: theme == 'atlantis'
                                  ? [Colors.white, const Color(0xFF67E8F9), const Color(0xFF0284C7)]
                                  : [const Color(0xFFFFFBEB), const Color(0xFFFFD700), const Color(0xFFB45309)],
                            ).createShader(const Rect.fromLTWH(0, 0, 300, 50)),
                        ),
                      ),
                      Text(
                        theme == 'atlantis' ? 'RISE OF THE SUNKEN GODS' : 'RISE OF THE GODS',
                        style: TextStyle(
                          color: theme == 'atlantis' ? const Color(0xFF2DD4BF) : const Color(0xFFFDE68A),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 3.0,
                        ),
                      ),
                      const SizedBox(height: 12),

                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0x80000000),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: const Color(0x33F59E0B)),
                        ),
                        child: Text(
                          'Quest: Level ${profile.currentLevel} / 1000',
                          style: const TextStyle(color: Color(0xFFFDE68A), fontSize: 12),
                        ),
                      ),

                      const SizedBox(height: 30),

                      // PLAY BUTTON
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFF59E0B),
                          foregroundColor: Colors.black,
                          minimumSize: const Size(240, 54),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                            side: const BorderSide(color: Color(0xFFFFF9C4), width: 1.5),
                          ),
                          elevation: 12,
                        ),
                        onPressed: () {
                          SystemSound.play(SystemSoundType.click);
                          onPlay();
                        },
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.play_arrow_rounded, size: 28),
                            const SizedBox(width: 8),
                            Text(
                              'PLAY LEVEL ${profile.currentLevel}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 12),

                      // ADVENTURE MAP
                      OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          backgroundColor: const Color(0x880B142B),
                          foregroundColor: Colors.white,
                          minimumSize: const Size(240, 46),
                          side: const BorderSide(color: Color(0x66F59E0B)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () {
                          SystemSound.play(SystemSoundType.click);
                          onOpenMap();
                        },
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Icon(Icons.map, color: Color(0xFFFFD700), size: 18),
                                SizedBox(width: 10),
                                Text('Adventure Map', style: TextStyle(fontWeight: FontWeight.bold)),
                              ],
                            ),
                            Text('1000 Realms >', style: TextStyle(color: Color(0xAAF59E0B), fontSize: 11)),
                          ],
                        ),
                      ),

                      const SizedBox(height: 10),

                      // PANTHEON GALLERY
                      OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          backgroundColor: const Color(0x880B142B),
                          foregroundColor: Colors.white,
                          minimumSize: const Size(240, 46),
                          side: const BorderSide(color: Color(0x66F59E0B)),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () {
                          SystemSound.play(SystemSoundType.click);
                          onOpenCharacters();
                        },
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Row(
                              children: [
                                Icon(Icons.people, color: Color(0xFF38BDF8), size: 18),
                                SizedBox(width: 10),
                                Text('Pantheon Gallery', style: TextStyle(fontWeight: FontWeight.bold)),
                              ],
                            ),
                            Text('${profile.unlockedCharacterIds.length} Gods >',
                                style: const TextStyle(color: Color(0xAAF59E0B), fontSize: 11)),
                          ],
                        ),
                      ),
                    ],
                  ),

                  // Footer Rank & Info
                  Text(
                    '$rank • ${profile.totalXp} XP',
                    style: const TextStyle(color: Color(0xAAFDE68A), fontSize: 11),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
