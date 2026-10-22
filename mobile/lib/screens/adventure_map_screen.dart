import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/game_models.dart';
import '../data/level_generator.dart';
import '../widgets/greek_header.dart';
import '../art/landscape_painter.dart';

class AdventureMapScreen extends StatefulWidget {
  final PlayerProfile profile;
  final ValueChanged<int> onSelectLevel;
  final VoidCallback onBack;
  final VoidCallback onOpenSettings;
  final VoidCallback onToggleSound;

  const AdventureMapScreen({
    super.key,
    required this.profile,
    required this.onSelectLevel,
    required this.onBack,
    required this.onOpenSettings,
    required this.onToggleSound,
  });

  @override
  State<AdventureMapScreen> createState() => _AdventureMapScreenState();
}

class _AdventureMapScreenState extends State<AdventureMapScreen> {
  late int _activeRealmIdx;
  late int _subPageIndex;
  final TextEditingController _jumpController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _activeRealmIdx = ((widget.profile.currentLevel - 1) ~/ 100).clamp(0, realms.length - 1);
    _subPageIndex = (((widget.profile.currentLevel - 1) % 100) ~/ 20).clamp(0, 4);
  }

  @override
  void dispose() {
    _jumpController.dispose();
    super.dispose();
  }

  void _handleJump() {
    final text = _jumpController.text.trim();
    final lvl = int.tryParse(text);
    if (lvl != null && lvl >= 1 && lvl <= 1000) {
      setState(() {
        _activeRealmIdx = ((lvl - 1) ~/ 100).clamp(0, realms.length - 1);
        _subPageIndex = (((lvl - 1) % 100) ~/ 20).clamp(0, 4);
        _jumpController.clear();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentRealm = realms[_activeRealmIdx];
    final realmStart = _activeRealmIdx * 100 + 1;
    final pageStart = realmStart + _subPageIndex * 20;
    final pageEnd = (pageStart + 19).clamp(pageStart, realmStart + 99);

    final levels = [for (int i = pageStart; i <= pageEnd; i++) i];
    final isAtlantis = currentRealm.isUnderwater || widget.profile.settings.themeMode == 'atlantis';

    return Scaffold(
      backgroundColor: const Color(0xFF070D1E),
      body: Stack(
        children: [
          Positioned.fill(
            child: LandscapeWidget(theme: isAtlantis ? 'atlantis' : 'olympus'),
          ),

          SafeArea(
            child: Column(
              children: [
                GreekHeader(
                  title: 'ADVENTURE MAP',
                  subtitle: 'The 10 Legendary Realms',
                  profile: widget.profile,
                  showBack: true,
                  onBack: widget.onBack,
                  onOpenSettings: widget.onOpenSettings,
                  onToggleSound: widget.onToggleSound,
                ),

                // Realms Horizontal List
                SizedBox(
                  height: 44,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                    itemCount: realms.length,
                    itemBuilder: (context, idx) {
                      final r = realms[idx];
                      final isSelected = idx == _activeRealmIdx;
                      final isUnlocked = (idx * 100 + 1) <= widget.profile.maxUnlockedLevel || idx == 0;

                      return GestureDetector(
                        onTap: () {
                          SystemSound.play(SystemSoundType.click);
                          setState(() {
                            _activeRealmIdx = idx;
                            _subPageIndex = 0;
                          });
                        },
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? const Color(0xFFF59E0B)
                                : isUnlocked
                                    ? const Color(0xAA0B142B)
                                    : Colors.black45,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? const Color(0xFFFFD700) : const Color(0x33F59E0B),
                            ),
                          ),
                          child: Center(
                            child: Text(
                              '${r.name} (${idx * 100 + 1}-${idx * 100 + 100})',
                              style: TextStyle(
                                color: isSelected
                                    ? Colors.black
                                    : isUnlocked
                                        ? const Color(0xFFFDE68A)
                                        : Colors.grey,
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),

                // Realm Header & Level Jump Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            currentRealm.name,
                            style: const TextStyle(
                              color: Color(0xFFFFD700),
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            currentRealm.sub,
                            style: const TextStyle(color: Color(0xAAFDE68A), fontSize: 10),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          SizedBox(
                            width: 100,
                            height: 32,
                            child: TextField(
                              controller: _jumpController,
                              keyboardType: TextInputType.number,
                              style: const TextStyle(color: Colors.white, fontSize: 11),
                              decoration: InputDecoration(
                                hintText: 'Lvl 1-1000',
                                hintStyle: const TextStyle(color: Colors.white38, fontSize: 10),
                                contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                                filled: true,
                                fillColor: Colors.black45,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8),
                                  borderSide: const BorderSide(color: Color(0x66F59E0B)),
                                ),
                              ),
                              onSubmitted: (_) => _handleJump(),
                            ),
                          ),
                          const SizedBox(width: 4),
                          IconButton(
                            icon: const Icon(Icons.search, color: Color(0xFFFFD700), size: 18),
                            onPressed: _handleJump,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Sub-page selector
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Levels $pageStart - $pageEnd',
                        style: const TextStyle(color: Colors.white70, fontSize: 11),
                      ),
                      Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.chevron_left, color: Color(0xFFFDE68A), size: 20),
                            onPressed: _subPageIndex > 0
                                ? () => setState(() => _subPageIndex--)
                                : null,
                          ),
                          Text(
                            'Page ${_subPageIndex + 1} / 5',
                            style: const TextStyle(color: Color(0xFFFDE68A), fontSize: 11),
                          ),
                          IconButton(
                            icon: const Icon(Icons.chevron_right, color: Color(0xFFFDE68A), size: 20),
                            onPressed: _subPageIndex < 4
                                ? () => setState(() => _subPageIndex++)
                                : null,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Levels Grid (20 levels in current page)
                Expanded(
                  child: GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 4,
                      childAspectRatio: 0.95,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                    ),
                    itemCount: levels.length,
                    itemBuilder: (context, i) {
                      final lvl = levels[i];
                      final isUnlocked = lvl <= widget.profile.maxUnlockedLevel;
                      final isCurrent = lvl == widget.profile.currentLevel;
                      final progress = widget.profile.completedLevels[lvl];
                      final stars = progress?.stars ?? 0;

                      return GestureDetector(
                        onTap: () {
                          if (isUnlocked) {
                            SystemSound.play(SystemSoundType.click);
                            widget.onSelectLevel(lvl);
                          }
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: isCurrent
                                ? const Color(0xDD3E2D07)
                                : isUnlocked
                                    ? const Color(0xCC0F1B38)
                                    : Colors.black54,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isCurrent
                                  ? const Color(0xFFFFD700)
                                  : isUnlocked
                                      ? const Color(0x55F59E0B)
                                      : Colors.white12,
                              width: isCurrent ? 2 : 1,
                            ),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              if (!isUnlocked)
                                const Icon(Icons.lock, color: Colors.grey, size: 20)
                              else
                                Text(
                                  '$lvl',
                                  style: TextStyle(
                                    color: isCurrent ? const Color(0xFFFFD700) : Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: List.generate(3, (sIdx) {
                                  return Icon(
                                    Icons.star,
                                    size: 10,
                                    color: sIdx < stars ? const Color(0xFFFFD700) : Colors.grey.shade800,
                                  );
                                }),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
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
