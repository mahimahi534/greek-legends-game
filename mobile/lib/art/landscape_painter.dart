import 'dart:math';
import 'package:flutter/material.dart';

class LandscapeWidget extends StatefulWidget {
  final String theme; // 'olympus' or 'atlantis'

  const LandscapeWidget({
    super.key,
    this.theme = 'olympus',
  });

  @override
  State<LandscapeWidget> createState() => _LandscapeWidgetState();
}

class _LandscapeWidgetState extends State<LandscapeWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 12),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          size: Size.infinite,
          painter: _LandscapePainter(
            theme: widget.theme,
            progress: _controller.value,
          ),
        );
      },
    );
  }
}

class _LandscapePainter extends CustomPainter {
  final String theme;
  final double progress;

  _LandscapePainter({
    required this.theme,
    required this.progress,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (theme == 'atlantis') {
      _paintAtlantis(canvas, size);
    } else {
      _paintOlympus(canvas, size);
    }
  }

  void _paintAtlantis(Canvas canvas, Size size) {
    // Deep Ocean Water Gradient
    final waterShader = const LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [Color(0xFF022F40), Color(0xFF041D30), Color(0xFF010D18)],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), Paint()..shader = waterShader);

    // God rays / Sunbeams
    final ray1 = Path()
      ..moveTo(size.width * 0.1, 0)
      ..lineTo(size.width * 0.35, 0)
      ..lineTo(size.width * 0.65, size.height)
      ..lineTo(size.width * 0.35, size.height)
      ..close();
    canvas.drawPath(
      ray1,
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0x5538BDF8), Color(0x2200CED1), Colors.transparent],
        ).createShader(Rect.fromLTWH(0, 0, size.width, size.height)),
    );

    final ray2 = Path()
      ..moveTo(size.width * 0.5, 0)
      ..lineTo(size.width * 0.75, 0)
      ..lineTo(size.width * 0.95, size.height)
      ..lineTo(size.width * 0.7, size.height)
      ..close();
    canvas.drawPath(
      ray2,
      Paint()
        ..shader = const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0x6667E8F9), Color(0x2206B6D4), Colors.transparent],
        ).createShader(Rect.fromLTWH(0, 0, size.width, size.height)),
    );

    // Rising Bubbles
    final bubblePaint = Paint()
      ..color = const Color(0x88E0F2FE)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1.5;

    for (int i = 0; i < 20; i++) {
      final seed = (i * 37) % 100 / 100.0;
      final bubbleY = (1.0 - (progress + seed) % 1.0) * (size.height + 60) - 30;
      final bubbleX = size.width * ((i * 19) % 100 / 100.0) + sin(progress * pi * 4 + i) * 12;
      final r = 4.0 + (i % 4) * 3;
      canvas.drawCircle(Offset(bubbleX, bubbleY), r, bubblePaint);
      canvas.drawCircle(Offset(bubbleX - 1.5, bubbleY - 1.5), 1.2, Paint()..color = Colors.white);
    }

    // Sunken Atlantean City Silhouette
    final cityPaint = Paint()..color = const Color(0x44083344);
    final city = Path()
      ..moveTo(0, size.height)
      ..lineTo(size.width * 0.1, size.height - 80)
      ..lineTo(size.width * 0.2, size.height - 120)
      ..lineTo(size.width * 0.3, size.height - 80)
      ..lineTo(size.width * 0.45, size.height - 180) // Central Spire
      ..lineTo(size.width * 0.5, size.height - 230)
      ..lineTo(size.width * 0.55, size.height - 180)
      ..lineTo(size.width * 0.7, size.height - 100)
      ..lineTo(size.width * 0.85, size.height - 140)
      ..lineTo(size.width, size.height - 70)
      ..lineTo(size.width, size.height)
      ..close();
    canvas.drawPath(city, cityPaint);

    // Seabed glow
    final seabed = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.bottomCenter,
        end: Alignment.topCenter,
        colors: [Color(0x8800CED1), Colors.transparent],
      ).createShader(Rect.fromLTWH(0, size.height - 70, size.width, 70));
    canvas.drawRect(Rect.fromLTWH(0, size.height - 70, size.width, 70), seabed);
  }

  void _paintOlympus(Canvas canvas, Size size) {
    // Sky gradient
    final sky = const LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [Color(0xFF070D1E), Color(0xFF0D1B2A), Color(0xFF1B263B)],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), Paint()..shader = sky);

    // Stars
    final starPaint = Paint()..color = const Color(0xCCFEF3C7);
    for (int i = 0; i < 28; i++) {
      final sx = size.width * ((i * 17) % 95 / 100.0) + 10;
      final sy = size.height * ((i * 29) % 65 / 100.0) + 15;
      final twinkle = sin(progress * pi * 4 + i) * 0.5 + 1.2;
      canvas.drawCircle(Offset(sx, sy), twinkle, starPaint);
    }

    // Mountain Olympus
    final mountain = Path()
      ..moveTo(0, size.height)
      ..lineTo(size.width * 0.2, size.height - 120)
      ..lineTo(size.width * 0.5, size.height - 240) // Peak
      ..lineTo(size.width * 0.8, size.height - 100)
      ..lineTo(size.width, size.height - 150)
      ..lineTo(size.width, size.height)
      ..close();
    canvas.drawPath(mountain, Paint()..color = const Color(0x551E293B));

    // Snow Cap
    final snow = Path()
      ..moveTo(size.width * 0.45, size.height - 200)
      ..lineTo(size.width * 0.5, size.height - 240)
      ..lineTo(size.width * 0.55, size.height - 200)
      ..close();
    canvas.drawPath(snow, Paint()..color = const Color(0xAAFFFFFF));

    // Sea at bottom
    final sea = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.bottomCenter,
        end: Alignment.topCenter,
        colors: [Color(0x660284C7), Colors.transparent],
      ).createShader(Rect.fromLTWH(0, size.height - 80, size.width, 80));
    canvas.drawRect(Rect.fromLTWH(0, size.height - 80, size.width, 80), sea);
  }

  @override
  bool shouldRepaint(covariant _LandscapePainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.theme != theme;
  }
}
