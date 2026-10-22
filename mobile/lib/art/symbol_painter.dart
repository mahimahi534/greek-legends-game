import 'dart:math';
import 'package:flutter/material.dart';
import '../models/game_models.dart';

class SymbolWidget extends StatelessWidget {
  final SymbolType symbol;
  final SpecialTileType special;
  final double size;
  final bool isAtlantis;

  const SymbolWidget({
    super.key,
    required this.symbol,
    this.special = SpecialTileType.none,
    this.size = 46.0,
    this.isAtlantis = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _SymbolPainter(
          symbol: symbol,
          special: special,
          isAtlantis: isAtlantis,
        ),
      ),
    );
  }
}

class _SymbolPainter extends CustomPainter {
  final SymbolType symbol;
  final SpecialTileType special;
  final bool isAtlantis;

  _SymbolPainter({
    required this.symbol,
    required this.special,
    required this.isAtlantis,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Outer backing circle
    final bgPaint = Paint()
      ..shader = RadialGradient(
        colors: _getBgColors(symbol, isAtlantis),
      ).createShader(Rect.fromCircle(center: center, radius: radius))
      ..style = PaintingStyle.fill;
    canvas.drawCircle(center, radius - 2, bgPaint);

    final borderPaint = Paint()
      ..color = _getBorderColor(symbol, isAtlantis)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;
    canvas.drawCircle(center, radius - 2, borderPaint);

    // Draw Symbol Glyph
    switch (symbol) {
      case SymbolType.zeus:
        _drawZeusLightning(canvas, center, size);
        break;
      case SymbolType.poseidon:
        _drawPoseidonTrident(canvas, center, size);
        break;
      case SymbolType.athena:
        _drawAthenaOwl(canvas, center, size);
        break;
      case SymbolType.sun:
        _drawSunMedallion(canvas, center, size);
        break;
      case SymbolType.amphora:
        _drawAmphora(canvas, center, size);
        break;
      case SymbolType.pandora:
        _drawPandoraBox(canvas, center, size);
        break;
      case SymbolType.temple:
        _drawTemple(canvas, center, size);
        break;
      case SymbolType.pegasus:
        _drawPegasusWings(canvas, center, size);
        break;
    }

    // Special Overlays
    if (special == SpecialTileType.lightningH) {
      final linePaint = Paint()
        ..color = const Color(0xFFFFEB3B)
        ..strokeWidth = 3.0
        ..style = PaintingStyle.stroke;
      canvas.drawLine(
        Offset(0, center.dy),
        Offset(size.width, center.dy),
        linePaint,
      );
    } else if (special == SpecialTileType.lightningV) {
      final linePaint = Paint()
        ..color = const Color(0xFFFFEB3B)
        ..strokeWidth = 3.0
        ..style = PaintingStyle.stroke;
      canvas.drawLine(
        Offset(center.dx, 0),
        Offset(center.dx, size.height),
        linePaint,
      );
    } else if (special == SpecialTileType.pandoraBlast) {
      final blastPaint = Paint()
        ..color = const Color(0xFFC084FC)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 2.0;
      canvas.drawCircle(center, radius - 4, blastPaint);
    } else if (special == SpecialTileType.sunSupernova) {
      final novaPaint = Paint()
        ..color = const Color(0xFFF59E0B)
        ..style = PaintingStyle.stroke
        ..strokeWidth = 3.0;
      canvas.drawCircle(center, radius - 2, novaPaint);
    }
  }

  List<Color> _getBgColors(SymbolType s, bool atlantis) {
    if (atlantis) {
      return [const Color(0xFF0C4A6E), const Color(0xFF021B2A)];
    }
    switch (s) {
      case SymbolType.zeus:
        return [const Color(0xFF3E2D07), const Color(0xFF1A1201)];
      case SymbolType.poseidon:
        return [const Color(0xFF064E3B), const Color(0xFF021E17)];
      case SymbolType.athena:
        return [const Color(0xFF0C4A6E), const Color(0xFF041C2E)];
      case SymbolType.sun:
        return [const Color(0xFF451A03), const Color(0xFF1F0B01)];
      case SymbolType.amphora:
        return [const Color(0xFF3B1C0B), const Color(0xFF170802)];
      case SymbolType.pandora:
        return [const Color(0xFF2E1065), const Color(0xFF12032E)];
      case SymbolType.temple:
        return [const Color(0xFF363124), const Color(0xFF17140B)];
      case SymbolType.pegasus:
        return [const Color(0xFF1E1B4B), const Color(0xFF0B0924)];
    }
  }

  Color _getBorderColor(SymbolType s, bool atlantis) {
    if (atlantis) return const Color(0xFF00CED1);
    switch (s) {
      case SymbolType.zeus:
      case SymbolType.sun:
        return const Color(0xFFFFD700);
      case SymbolType.poseidon:
        return const Color(0xFF00CED1);
      case SymbolType.athena:
      case SymbolType.pegasus:
        return const Color(0xFF38BDF8);
      case SymbolType.amphora:
        return const Color(0xFFCD7F32);
      case SymbolType.pandora:
        return const Color(0xFFA855F7);
      case SymbolType.temple:
        return const Color(0xFFF5E6CA);
    }
  }

  void _drawZeusLightning(Canvas canvas, Offset c, Size s) {
    final p = Path();
    final w = s.width;
    final h = s.height;
    p.moveTo(w * 0.55, h * 0.15);
    p.lineTo(w * 0.32, h * 0.48);
    p.lineTo(w * 0.52, h * 0.48);
    p.lineTo(w * 0.42, h * 0.88);
    p.lineTo(w * 0.72, h * 0.44);
    p.lineTo(w * 0.52, h * 0.44);
    p.close();

    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFFF9C4), Color(0xFFFFD700), Color(0xFFB45309)],
      ).createShader(Rect.fromLTWH(0, 0, w, h))
      ..style = PaintingStyle.fill;
    canvas.drawPath(p, paint);
  }

  void _drawPoseidonTrident(Canvas canvas, Offset c, Size s) {
    final paint = Paint()
      ..color = const Color(0xFF00CED1)
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final w = s.width;
    final h = s.height;
    // Shaft
    canvas.drawLine(Offset(w * 0.5, h * 0.3), Offset(w * 0.5, h * 0.85), paint);
    // Center tip
    final fillPaint = Paint()..color = const Color(0xFF00CED1);
    final p = Path();
    p.moveTo(w * 0.5, h * 0.15);
    p.lineTo(w * 0.44, h * 0.35);
    p.lineTo(w * 0.56, h * 0.35);
    p.close();
    canvas.drawPath(p, fillPaint);

    // Left and right prongs
    final prongs = Path();
    prongs.moveTo(w * 0.32, h * 0.25);
    prongs.quadraticBezierTo(w * 0.32, h * 0.55, w * 0.5, h * 0.55);
    prongs.quadraticBezierTo(w * 0.68, h * 0.55, w * 0.68, h * 0.25);
    canvas.drawPath(prongs, paint);
  }

  void _drawAthenaOwl(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    final fillPaint = Paint()..color = const Color(0xFF38BDF8);
    canvas.drawOval(
      Rect.fromCenter(center: Offset(w * 0.5, h * 0.52), width: w * 0.5, height: h * 0.55),
      fillPaint,
    );

    // Eyes
    final eyePaint = Paint()..color = Colors.white;
    canvas.drawCircle(Offset(w * 0.4, h * 0.45), w * 0.11, eyePaint);
    canvas.drawCircle(Offset(w * 0.6, h * 0.45), w * 0.11, eyePaint);

    final pupil = Paint()..color = const Color(0xFF0F172A);
    canvas.drawCircle(Offset(w * 0.4, h * 0.45), w * 0.05, pupil);
    canvas.drawCircle(Offset(w * 0.6, h * 0.45), w * 0.05, pupil);

    // Beak
    final beak = Path()
      ..moveTo(w * 0.5, h * 0.48)
      ..lineTo(w * 0.45, h * 0.58)
      ..lineTo(w * 0.55, h * 0.58)
      ..close();
    canvas.drawPath(beak, Paint()..color = const Color(0xFFFBBF24));
  }

  void _drawSunMedallion(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;

    // Rays
    final rayPaint = Paint()
      ..color = const Color(0xFFF59E0B)
      ..style = PaintingStyle.fill;
    for (int i = 0; i < 8; i++) {
      final angle = (i * pi / 4);
      final rayP = Path();
      final rx = c.dx + cos(angle) * (w * 0.35);
      final ry = c.dy + sin(angle) * (h * 0.35);
      rayP.addOval(Rect.fromCenter(center: Offset(rx, ry), width: 6, height: 6));
      canvas.drawPath(rayP, rayPaint);
    }

    // Core
    final core = Paint()
      ..shader = const RadialGradient(
        colors: [Color(0xFFFFFBEB), Color(0xFFF59E0B), Color(0xFFB45309)],
      ).createShader(Rect.fromCircle(center: c, radius: w * 0.25));
    canvas.drawCircle(c, w * 0.22, core);
  }

  void _drawAmphora(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    final p = Path();
    p.moveTo(w * 0.4, h * 0.25);
    p.lineTo(w * 0.6, h * 0.25);
    p.lineTo(w * 0.6, h * 0.32);
    p.quadraticBezierTo(w * 0.75, h * 0.5, w * 0.58, h * 0.72);
    p.lineTo(w * 0.42, h * 0.72);
    p.quadraticBezierTo(w * 0.25, h * 0.5, w * 0.4, h * 0.32);
    p.close();

    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [Color(0xFFFDE68A), Color(0xFFCD7F32), Color(0xFF7C2D12)],
      ).createShader(Rect.fromLTWH(0, 0, w, h));
    canvas.drawPath(p, paint);
  }

  void _drawPandoraBox(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Box
    final boxRect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(w * 0.5, h * 0.58), width: w * 0.52, height: h * 0.38),
      const Radius.circular(4),
    );
    canvas.drawRRect(boxRect, Paint()..color = const Color(0xFFA855F7));

    // Lid
    final lid = Path()
      ..moveTo(w * 0.2, h * 0.42)
      ..quadraticBezierTo(w * 0.5, h * 0.28, w * 0.8, h * 0.42)
      ..close();
    canvas.drawPath(lid, Paint()..color = const Color(0xFFC084FC));

    // Gold Lock
    canvas.drawCircle(Offset(w * 0.5, h * 0.5), 3.5, Paint()..color = const Color(0xFFFFD700));
  }

  void _drawTemple(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    final paint = Paint()..color = const Color(0xFFF5E6CA);

    // Pediment triangle
    final pediment = Path()
      ..moveTo(w * 0.5, h * 0.22)
      ..lineTo(w * 0.22, h * 0.38)
      ..lineTo(w * 0.78, h * 0.38)
      ..close();
    canvas.drawPath(pediment, paint);

    // Columns
    canvas.drawRect(Rect.fromLTWH(w * 0.28, h * 0.42, w * 0.08, h * 0.28), paint);
    canvas.drawRect(Rect.fromLTWH(w * 0.46, h * 0.42, w * 0.08, h * 0.28), paint);
    canvas.drawRect(Rect.fromLTWH(w * 0.64, h * 0.42, w * 0.08, h * 0.28), paint);

    // Base
    canvas.drawRect(Rect.fromLTWH(w * 0.2, h * 0.72, w * 0.6, h * 0.08), paint);
  }

  void _drawPegasusWings(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    final wing = Path();
    // Left wing
    wing.moveTo(w * 0.5, h * 0.65);
    wing.quadraticBezierTo(w * 0.2, h * 0.4, w * 0.15, h * 0.2);
    wing.quadraticBezierTo(w * 0.35, h * 0.38, w * 0.5, h * 0.55);
    // Right wing
    wing.moveTo(w * 0.5, h * 0.65);
    wing.quadraticBezierTo(w * 0.8, h * 0.4, w * 0.85, h * 0.2);
    wing.quadraticBezierTo(w * 0.65, h * 0.38, w * 0.5, h * 0.55);

    final paint = Paint()
      ..color = const Color(0xFFE0E7FF)
      ..style = PaintingStyle.fill;
    canvas.drawPath(wing, paint);

    // Center star
    canvas.drawCircle(Offset(w * 0.5, h * 0.6), 3.5, Paint()..color = const Color(0xFFFFD700));
  }

  @override
  bool shouldRepaint(covariant _SymbolPainter oldDelegate) {
    return oldDelegate.symbol != symbol ||
        oldDelegate.special != special ||
        oldDelegate.isAtlantis != isAtlantis;
  }
}
