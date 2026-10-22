import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'models/game_models.dart';
import 'data/level_generator.dart';
import 'services/storage_service.dart';
import 'screens/main_menu_screen.dart';
import 'screens/adventure_map_screen.dart';
import 'screens/character_collection_screen.dart';
import 'screens/puzzle_game_screen.dart';
import 'widgets/settings_dialog.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const GreekLegendsMobileApp());
}

class GreekLegendsMobileApp extends StatefulWidget {
  const GreekLegendsMobileApp({super.key});

  @override
  State<GreekLegendsMobileApp> createState() => _GreekLegendsMobileAppState();
}

class _GreekLegendsMobileAppState extends State<GreekLegendsMobileApp> {
  PlayerProfile? _profile;
  String _currentScreen = 'menu';
  int _activeLevel = 1;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final p = await StorageService.loadProfile();
    setState(() {
      _profile = p;
      _activeLevel = p.currentLevel;
    });
  }

  void _saveProfile() {
    if (_profile != null) {
      StorageService.saveProfile(_profile!);
    }
  }

  String get _effectiveTheme {
    if (_profile == null) return 'olympus';
    if (_profile!.settings.themeMode == 'atlantis') return 'atlantis';
    if (_profile!.settings.themeMode == 'olympus') return 'olympus';
    return (_activeLevel >= 201 && _activeLevel <= 300) ? 'atlantis' : 'olympus';
  }

  void _toggleTheme() {
    if (_profile == null) return;
    setState(() {
      final next = _effectiveTheme == 'atlantis' ? 'olympus' : 'atlantis';
      _profile!.settings.themeMode = next;
    });
    _saveProfile();
  }

  void _startLevel(int level) {
    setState(() {
      _activeLevel = level;
      _currentScreen = 'game';
    });
  }

  void _handleLevelComplete(int score, int stars) {
    if (_profile == null) return;
    setState(() {
      final existing = _profile!.completedLevels[_activeLevel];
      final finalScore = (existing != null && existing.highScore > score) ? existing.highScore : score;
      final finalStars = (existing != null && existing.stars > stars) ? existing.stars : stars;

      _profile!.completedLevels[_activeLevel] = LevelProgress(
        stars: finalStars,
        highScore: finalScore,
        completedAt: DateTime.now().toIso8601String(),
      );

      final nextLvl = (_activeLevel + 1).clamp(1, 1000);
      if (nextLvl > _profile!.maxUnlockedLevel) {
        _profile!.maxUnlockedLevel = nextLvl;
      }
      _profile!.currentLevel = nextLvl;
      _profile!.totalXp += _activeLevel * 100 + (score ~/ 10);
    });
    _saveProfile();

    if (_activeLevel < 1000) {
      _startLevel(_activeLevel + 1);
    } else {
      setState(() => _currentScreen = 'map');
    }
  }

  void _showSettings() {
    if (_profile == null) return;
    showDialog(
      context: context,
      builder: (context) => SettingsDialog(
        settings: _profile!.settings,
        onUpdateSettings: (newSettings) {
          setState(() => _profile!.settings = newSettings);
          _saveProfile();
        },
        onResetProgress: () async {
          final reset = await StorageService.resetProfile();
          setState(() {
            _profile = reset;
            _activeLevel = 1;
            _currentScreen = 'menu';
          });
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Greek Legends: Rise of the Gods',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF070D1E),
        fontFamily: 'serif',
      ),
      home: Builder(
        builder: (context) {
          if (_profile == null) {
            return const Scaffold(
              body: Center(
                child: CircularProgressIndicator(color: Color(0xFFFFD700)),
              ),
            );
          }

          if (_currentScreen == 'map') {
            return AdventureMapScreen(
              profile: _profile!,
              onSelectLevel: (lvl) => _startLevel(lvl),
              onBack: () => setState(() => _currentScreen = 'menu'),
              onOpenSettings: _showSettings,
              onToggleSound: () {
                setState(() => _profile!.settings.soundEnabled = !_profile!.settings.soundEnabled);
                _saveProfile();
              },
            );
          }

          if (_currentScreen == 'characters') {
            return CharacterCollectionScreen(
              profile: _profile!,
              onSelectGuardian: (id) {
                setState(() => _profile!.selectedCharacterId = id);
                _saveProfile();
              },
              onBack: () => setState(() => _currentScreen = 'menu'),
              onOpenSettings: _showSettings,
              onToggleSound: () {
                setState(() => _profile!.settings.soundEnabled = !_profile!.settings.soundEnabled);
                _saveProfile();
              },
            );
          }

          if (_currentScreen == 'game') {
            return PuzzleGameScreen(
              levelConfig: generateLevelConfig(_activeLevel),
              profile: _profile!,
              theme: _effectiveTheme,
              onLevelComplete: _handleLevelComplete,
              onExitToMap: () => setState(() => _currentScreen = 'map'),
            );
          }

          // Main Menu Screen
          return MainMenuScreen(
            profile: _profile!,
            theme: _effectiveTheme,
            onToggleTheme: _toggleTheme,
            onPlay: () => _startLevel(_profile!.currentLevel),
            onOpenMap: () => setState(() => _currentScreen = 'map'),
            onOpenCharacters: () => setState(() => _currentScreen = 'characters'),
            onOpenSettings: _showSettings,
          );
        },
      ),
    );
  }
}
