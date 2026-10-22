import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';
import '../services/storage_service.dart';

class GreekHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final PlayerProfile profile;
  final bool showBack;
  final VoidCallback? onBack;
  final VoidCallback onOpenSettings;
  final VoidCallback onToggleSound;

  const GreekHeader({
    super.key,
    required this.title,
    this.subtitle,
    required this.profile,
    this.showBack = false,
    this.onBack,
    required this.onOpenSettings,
    required this.onToggleSound,
  });

  @override
  Widget build(BuildContext context) {
    final rank = StorageService.getRankTitle(profile.totalXp);

    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 8,
        left: 12,
        right: 12,
        bottom: 8,
      ),
      decoration: BoxDecoration(
        color: const Color(0xDD0B142B),
        border: const Border(
          bottom: BorderSide(color: Color(0x66F59E0B), width: 1.5),
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x80000000),
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              if (showBack && onBack != null)
                IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new, color: Color(0xFFFDE68A), size: 18),
                  onPressed: () {
                    SystemSound.play(SystemSoundType.click);
                    onBack!();
                  },
                ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      color: Color(0xFFFDE68A),
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.2,
                    ),
                  ),
                  Text(
                    subtitle ?? rank,
                    style: const TextStyle(
                      color: Color(0xAAFDE68A),
                      fontSize: 10,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0x553B1C0B),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0x66F59E0B)),
                ),
                child: Text(
                  'LVL ${profile.currentLevel}',
                  style: const TextStyle(
                    color: Color(0xFFFFD700),
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              IconButton(
                icon: Icon(
                  profile.settings.soundEnabled ? Icons.volume_up : Icons.volume_off,
                  color: profile.settings.soundEnabled ? const Color(0xFFFFD700) : Colors.grey,
                  size: 20,
                ),
                onPressed: () {
                  SystemSound.play(SystemSoundType.click);
                  onToggleSound();
                },
              ),
              IconButton(
                icon: const Icon(Icons.settings, color: Color(0xFFFDE68A), size: 20),
                onPressed: () {
                  SystemSound.play(SystemSoundType.click);
                  onOpenSettings();
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}
