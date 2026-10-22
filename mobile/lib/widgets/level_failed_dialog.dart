import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';

class LevelFailedDialog extends StatelessWidget {
  final int levelNumber;
  final List<LevelObjective> objectives;
  final VoidCallback onRetry;
  final VoidCallback onGoToMap;

  const LevelFailedDialog({
    super.key,
    required this.levelNumber,
    required this.objectives,
    required this.onRetry,
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
            colors: [Color(0xFF260D0D), Color(0xFF0F0404)],
          ),
          borderRadius: BorderRadius.circular(22),
          border: Border.all(color: Colors.redAccent, width: 2),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'THE FATES INTERVENE',
              style: TextStyle(
                color: Colors.redAccent,
                fontSize: 12,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 4),
            const Text(
              'OUT OF MOVES!',
              style: TextStyle(
                color: Colors.white,
                fontSize: 22,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 16),

            // Remaining objectives
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black54,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0x4DF44336)),
              ),
              child: Column(
                children: objectives.map((obj) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          obj.type == ObjectiveType.score
                              ? 'Target Score'
                              : obj.type == ObjectiveType.clearMarble
                                  ? 'Break Marble Blocks'
                                  : 'Collect Symbols',
                          style: TextStyle(
                            color: obj.isComplete ? Colors.greenAccent : Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                        Text(
                          '${obj.current} / ${obj.target}',
                          style: TextStyle(
                            color: obj.isComplete ? Colors.greenAccent : Colors.redAccent,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 20),

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
                onRetry();
              },
              child: Text(
                'TRY LEVEL $levelNumber AGAIN',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            const SizedBox(height: 8),

            OutlinedButton(
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.white70,
                minimumSize: const Size.fromHeight(40),
              ),
              onPressed: () {
                Navigator.of(context).pop();
                onGoToMap();
              },
              child: const Text('Return to Realm Map', style: TextStyle(fontSize: 12)),
            ),
          ],
        ),
      ),
    );
  }
}
