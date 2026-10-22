import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';
import '../art/character_painter.dart';

class LevelCompleteDialog extends StatelessWidget {
  final int levelNumber;
  final int score;
  final int highScore;
  final int stars;
  final int xpEarned;
  final CharacterModel? unlockedChar;
  final VoidCallback onNextLevel;
  final VoidCallback onReplay;
  final VoidCallback onGoToMap;

  const LevelCompleteDialog({
    super.key,
    required this.levelNumber,
    required this.score,
    required this.highScore,
    required this.stars,
    required this.xpEarned,
    this.unlockedChar,
    required this.onNextLevel,
    required this.onReplay,
    required this.onGoToMap,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF101D38), Color(0xFF040812)],
          ),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: const Color(0xFFFFD700), width: 2),
          boxShadow: const [
            BoxShadow(
              color: Color(0x66FFD700),
              blurRadius: 30,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'OLYMPIAN TRIUMPH',
              style: TextStyle(
                color: Color(0xFFFDE68A),
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 2.0,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'LEVEL $levelNumber CONQUERED!',
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: Color(0xFFFFD700),
                fontSize: 22,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 16),

            // Stars
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(3, (index) {
                final isEarned = index < stars;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  child: Icon(
                    Icons.star,
                    size: index == 1 ? 44 : 36,
                    color: isEarned ? const Color(0xFFFFD700) : Colors.grey.shade800,
                  ),
                );
              }),
            ),
            const SizedBox(height: 16),

            // Score Box
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black45,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0x33F59E0B)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Final Score', style: TextStyle(color: Colors.white70, fontSize: 13)),
                      Text(
                        '$score pts',
                        style: const TextStyle(
                          color: Color(0xFFFFD700),
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Experience Gained', style: TextStyle(color: Colors.white70, fontSize: 13)),
                      Text(
                        '+$xpEarned XP',
                        style: const TextStyle(
                          color: Color(0xFF67E8F9),
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            if (unlockedChar != null) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color(0x443B1C0B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFFD700)),
                ),
                child: Row(
                  children: [
                    CharacterWidget(id: unlockedChar!.id, size: 40),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('NEW GUARDIAN UNLOCKED!',
                              style: TextStyle(color: Color(0xFFFFD700), fontSize: 9, fontWeight: FontWeight.bold)),
                          Text(unlockedChar!.name,
                              style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 20),

            // Next Level Button
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF59E0B),
                foregroundColor: Colors.black,
                minimumSize: const Size.fromHeight(44),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                SystemSound.play(SystemSoundType.click);
                Navigator.of(context).pop();
                onNextLevel();
              },
              child: Text(
                levelNumber < 1000 ? 'ADVANCE TO LEVEL ${levelNumber + 1}' : 'COMPLETED!',
                style: const TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2),
              ),
            ),
            const SizedBox(height: 8),

            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFFDE68A)),
                    onPressed: () {
                      Navigator.of(context).pop();
                      onReplay();
                    },
                    child: const Text('Replay', style: TextStyle(fontSize: 12)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFFDE68A)),
                    onPressed: () {
                      Navigator.of(context).pop();
                      onGoToMap();
                    },
                    child: const Text('Realm Map', style: TextStyle(fontSize: 12)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
