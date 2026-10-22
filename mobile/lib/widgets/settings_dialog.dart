import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';

class SettingsDialog extends StatefulWidget {
  final GameSettings settings;
  final ValueChanged<GameSettings> onUpdateSettings;
  final VoidCallback onResetProgress;

  const SettingsDialog({
    super.key,
    required this.settings,
    required this.onUpdateSettings,
    required this.onResetProgress,
  });

  @override
  State<SettingsDialog> createState() => _SettingsDialogState();
}

class _SettingsDialogState extends State<SettingsDialog> {
  bool _confirmReset = false;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0F1B38), Color(0xFF050B17)],
          ),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFF59E0B), width: 1.5),
          boxShadow: const [
            BoxShadow(
              color: Color(0x4DF59E0B),
              blurRadius: 20,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '⚙️ SETTINGS',
                  style: TextStyle(
                    color: Color(0xFFFFD700),
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.white70),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
            const Divider(color: Color(0x44F59E0B)),
            const SizedBox(height: 10),

            // Sound Effects Switch
            SwitchListTile(
              title: const Text('Sound Effects', style: TextStyle(color: Colors.white, fontSize: 14)),
              subtitle: const Text('Matches & chimes', style: TextStyle(color: Colors.white54, fontSize: 11)),
              value: widget.settings.soundEnabled,
              activeThumbColor: const Color(0xFFFFD700),
              activeTrackColor: const Color(0xFFB45309),
              onChanged: (val) {
                SystemSound.play(SystemSoundType.click);
                setState(() => widget.settings.soundEnabled = val);
                widget.onUpdateSettings(widget.settings);
              },
            ),

            // Atmosphere Theme Selector
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Text(
                'Visual Atmosphere Theme',
                style: TextStyle(color: Color(0xFFFDE68A), fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        backgroundColor: widget.settings.themeMode == 'olympus'
                            ? const Color(0xFFF59E0B)
                            : Colors.transparent,
                        foregroundColor: widget.settings.themeMode == 'olympus'
                            ? Colors.black
                            : const Color(0xFFFDE68A),
                        side: const BorderSide(color: Color(0xFFF59E0B)),
                      ),
                      onPressed: () {
                        SystemSound.play(SystemSoundType.click);
                        setState(() => widget.settings.themeMode = 'olympus');
                        widget.onUpdateSettings(widget.settings);
                      },
                      child: const Text('⚡ Olympus', style: TextStyle(fontSize: 11)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        backgroundColor: widget.settings.themeMode == 'atlantis'
                            ? const Color(0xFF00CED1)
                            : Colors.transparent,
                        foregroundColor: widget.settings.themeMode == 'atlantis'
                            ? Colors.black
                            : const Color(0xFF67E8F9),
                        side: const BorderSide(color: Color(0xFF00CED1)),
                      ),
                      onPressed: () {
                        SystemSound.play(SystemSoundType.click);
                        setState(() => widget.settings.themeMode = 'atlantis');
                        widget.onUpdateSettings(widget.settings);
                      },
                      child: const Text('🔱 Atlantis', style: TextStyle(fontSize: 11)),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Reset Progress
            if (!_confirmReset)
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Colors.redAccent),
                  foregroundColor: Colors.redAccent,
                ),
                icon: const Icon(Icons.refresh, size: 16),
                label: const Text('Reset Adventure Progress', style: TextStyle(fontSize: 12)),
                onPressed: () => setState(() => _confirmReset = true),
              )
            else
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0x26F44336),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.redAccent),
                ),
                child: Column(
                  children: [
                    const Text(
                      'Confirm complete reset? Progress will return to Level 1.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Colors.white, fontSize: 11),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
                            onPressed: () {
                              widget.onResetProgress();
                              Navigator.of(context).pop();
                            },
                            child: const Text('Yes, Reset', style: TextStyle(fontSize: 11, color: Colors.white)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => setState(() => _confirmReset = false),
                            child: const Text('Cancel', style: TextStyle(fontSize: 11, color: Colors.white70)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}
