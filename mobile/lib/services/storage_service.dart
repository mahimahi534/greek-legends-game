import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/game_models.dart';

class StorageService {
  static const String _key = 'GREEK_LEGENDS_MOBILE_DATA_V1';

  static PlayerProfile getDefaultProfile() {
    return PlayerProfile(
      currentLevel: 1,
      maxUnlockedLevel: 1,
      totalXp: 0,
      completedLevels: {},
      unlockedCharacterIds: ['zeus', 'athena'],
      selectedCharacterId: 'zeus',
      settings: GameSettings(),
    );
  }

  static String getRankTitle(int xp) {
    if (xp >= 50000) return '👑 Supreme God of Olympus';
    if (xp >= 25000) return '⚡ Titan Slayer';
    if (xp >= 12000) return '🏛️ Divine Champion';
    if (xp >= 6000) return '🛡️ Hero of Hellas';
    if (xp >= 2500) return '⚔️ Mythic Demigod';
    if (xp >= 800) return '📜 Spartan Initiate';
    return '🌿 Mortal Seeker';
  }

  static Future<PlayerProfile> loadProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_key);
      if (raw == null) return getDefaultProfile();

      final Map<String, dynamic> data = jsonDecode(raw);
      final completedMap = <int, LevelProgress>{};
      if (data['completedLevels'] != null) {
        final Map<String, dynamic> comp = data['completedLevels'];
        comp.forEach((k, v) {
          final lvl = int.tryParse(k);
          if (lvl != null && v is Map<String, dynamic>) {
            completedMap[lvl] = LevelProgress.fromJson(v);
          }
        });
      }

      final unlockedChars = <String>[];
      if (data['unlockedCharacterIds'] != null) {
        for (final id in data['unlockedCharacterIds']) {
          unlockedChars.add(id.toString());
        }
      }
      if (!unlockedChars.contains('zeus')) unlockedChars.add('zeus');
      if (!unlockedChars.contains('athena')) unlockedChars.add('athena');

      final settings = data['settings'] != null
          ? GameSettings.fromJson(data['settings'])
          : GameSettings();

      return PlayerProfile(
        currentLevel: data['currentLevel'] ?? 1,
        maxUnlockedLevel: data['maxUnlockedLevel'] ?? 1,
        totalXp: data['totalXp'] ?? 0,
        completedLevels: completedMap,
        unlockedCharacterIds: unlockedChars,
        selectedCharacterId: data['selectedCharacterId'] ?? 'zeus',
        settings: settings,
      );
    } catch (e) {
      return getDefaultProfile();
    }
  }

  static Future<void> saveProfile(PlayerProfile profile) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final completedJson = <String, dynamic>{};
      profile.completedLevels.forEach((k, v) {
        completedJson[k.toString()] = v.toJson();
      });

      final Map<String, dynamic> data = {
        'currentLevel': profile.currentLevel,
        'maxUnlockedLevel': profile.maxUnlockedLevel,
        'totalXp': profile.totalXp,
        'completedLevels': completedJson,
        'unlockedCharacterIds': profile.unlockedCharacterIds,
        'selectedCharacterId': profile.selectedCharacterId,
        'settings': profile.settings.toJson(),
      };

      await prefs.setString(_key, jsonEncode(data));
    } catch (_) {}
  }

  static Future<PlayerProfile> resetProfile() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_key);
    return getDefaultProfile();
  }
}
