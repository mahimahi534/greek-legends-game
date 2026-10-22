import 'dart:math';
import 'package:flutter/material.dart';

class CharacterWidget extends StatelessWidget {
  final String id;
  final double size;
  final bool isUnlocked;

  const CharacterWidget({
    super.key,
    required this.id,
    this.size = 72.0,
    this.isUnlocked = true,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        SizedBox(
          width: size,
          height: size,
          child: CustomPaint(
            painter: _CharacterPainter(id: id),
          ),
        ),
        if (!isUnlocked)
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xBF000000),
              border: Border.all(color: const Color(0xFF78350F), width: 2),
            ),
            child: const Center(
              child: Icon(Icons.lock, color: Color(0xFFFDE68A), size: 24),
            ),
          ),
      ],
    );
  }
}

class _CharacterPainter extends CustomPainter {
  final String id;

  _CharacterPainter({required this.id});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Background circle
    final bgPaint = Paint()
      ..shader = RadialGradient(
        colors: _getBgColors(id),
      ).createShader(Rect.fromCircle(center: center, radius: radius));
    canvas.drawCircle(center, radius - 2, bgPaint);

    final borderPaint = Paint()
      ..color = _getBorderColor(id)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(center, radius - 2, borderPaint);

    // Draw Portrait elements
    switch (id) {
      case 'zeus':
        _drawZeus(canvas, center, size);
        break;
      case 'poseidon':
        _drawPoseidon(canvas, center, size);
        break;
      case 'amphitrite':
        _drawAmphitrite(canvas, center, size);
        break;
      case 'athena':
        _drawAthena(canvas, center, size);
        break;
      case 'hercules':
        _drawHercules(canvas, center, size);
        break;
      case 'pegasus':
        _drawPegasus(canvas, center, size);
        break;
      case 'helios':
        _drawHelios(canvas, center, size);
        break;
      case 'hades':
        _drawHades(canvas, center, size);
        break;
      case 'medusa':
        _drawMedusa(canvas, center, size);
        break;
      default:
        _drawZeus(canvas, center, size);
    }
  }

  List<Color> _getBgColors(String charId) {
    switch (charId) {
      case 'zeus':
        return [const Color(0xFF312E81), const Color(0xFF1E1B4B)];
      case 'poseidon':
        return [const Color(0xFF0F766E), const Color(0xFF042F2E)];
      case 'amphitrite':
        return [const Color(0xFF0891B2), const Color(0xFF042F40)];
      case 'athena':
        return [const Color(0xFF0C4A6E), const Color(0xFF082F49)];
      case 'hercules':
        return [const Color(0xFF7C2D12), const Color(0xFF431407)];
      case 'pegasus':
        return [const Color(0xFF3730A3), const Color(0xFF1E1B4B)];
      case 'helios':
        return [const Color(0xFF78350F), const Color(0xFF451A03)];
      case 'hades':
        return [const Color(0xFF2E1065), const Color(0xFF0F051D)];
      case 'medusa':
        return [const Color(0xFF064E3B), const Color(0xFF022C22)];
      default:
        return [const Color(0xFF1E1B4B), const Color(0xFF0B0924)];
    }
  }

  Color _getBorderColor(String charId) {
    switch (charId) {
      case 'zeus':
      case 'helios':
        return const Color(0xFFFFD700);
      case 'poseidon':
      case 'amphitrite':
        return const Color(0xFF00CED1);
      case 'athena':
        return const Color(0xFF38BDF8);
      case 'hercules':
        return const Color(0xFFEA580C);
      case 'pegasus':
        return const Color(0xFF818CF8);
      case 'hades':
        return const Color(0xFFA855F7);
      case 'medusa':
        return const Color(0xFF10B981);
      default:
        return const Color(0xFFFFD700);
    }
  }

  void _drawZeus(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Beard & hair
    final beard = Paint()..color = const Color(0xFFF8FAFC);
    canvas.drawCircle(Offset(w * 0.5, h * 0.55), w * 0.28, beard);

    // Face
    final face = Paint()..color = const Color(0xFFF8C4A5);
    canvas.drawCircle(Offset(w * 0.5, h * 0.45), w * 0.18, face);

    // Laurel Crown
    final crown = Paint()
      ..color = const Color(0xFFFFD700)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3;
    canvas.drawArc(
      Rect.fromCircle(center: Offset(w * 0.5, h * 0.38), radius: w * 0.18),
      pi,
      pi,
      false,
      crown,
    );

    // Glowing Eyes
    final eye = Paint()..color = const Color(0xFF38BDF8);
    canvas.drawCircle(Offset(w * 0.42, h * 0.42), 2.5, eye);
    canvas.drawCircle(Offset(w * 0.58, h * 0.42), 2.5, eye);
  }

  void _drawPoseidon(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    final beard = Paint()..color = const Color(0xFF38BDF8);
    canvas.drawCircle(Offset(w * 0.5, h * 0.55), w * 0.28, beard);

    final face = Paint()..color = const Color(0xFFF5CBA7);
    canvas.drawCircle(Offset(w * 0.5, h * 0.45), w * 0.18, face);

    // Coral Crown
    final crown = Paint()..color = const Color(0xFFFFD700);
    final p = Path()
      ..moveTo(w * 0.35, h * 0.3)
      ..lineTo(w * 0.42, h * 0.18)
      ..lineTo(w * 0.5, h * 0.25)
      ..lineTo(w * 0.58, h * 0.18)
      ..lineTo(w * 0.65, h * 0.3)
      ..close();
    canvas.drawPath(p, crown);

    // Eyes
    final eye = Paint()..color = const Color(0xFF00CED1);
    canvas.drawCircle(Offset(w * 0.42, h * 0.43), 2.5, eye);
    canvas.drawCircle(Offset(w * 0.58, h * 0.43), 2.5, eye);
  }

  void _drawAmphitrite(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Mermaid hair
    final hair = Paint()..color = const Color(0xFF2DD4BF);
    canvas.drawCircle(Offset(w * 0.35, h * 0.55), w * 0.2, hair);
    canvas.drawCircle(Offset(w * 0.65, h * 0.55), w * 0.2, hair);

    // Face
    final face = Paint()..color = const Color(0xFFFDE2D2);
    canvas.drawCircle(Offset(w * 0.5, h * 0.48), w * 0.16, face);

    // Shell tiara with pearl
    final tiara = Paint()..color = const Color(0xFFFDE047);
    canvas.drawArc(
      Rect.fromCircle(center: Offset(w * 0.5, h * 0.38), radius: w * 0.15),
      pi,
      pi,
      false,
      tiara,
    );
    canvas.drawCircle(Offset(w * 0.5, h * 0.34), 3.5, Paint()..color = Colors.white);

    // Eyes
    final eye = Paint()..color = const Color(0xFF0891B2);
    canvas.drawCircle(Offset(w * 0.44, h * 0.46), 2.5, eye);
    canvas.drawCircle(Offset(w * 0.56, h * 0.46), 2.5, eye);
  }

  void _drawAthena(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Helmet
    final helm = Paint()..color = const Color(0xFFD97706);
    final p = Path()
      ..moveTo(w * 0.3, h * 0.45)
      ..lineTo(w * 0.3, h * 0.25)
      ..lineTo(w * 0.7, h * 0.25)
      ..lineTo(w * 0.7, h * 0.45)
      ..close();
    canvas.drawPath(p, helm);

    // Plume
    final plume = Paint()..color = const Color(0xFF0284C7);
    canvas.drawOval(
      Rect.fromCenter(center: Offset(w * 0.5, h * 0.16), width: w * 0.2, height: h * 0.14),
      plume,
    );

    // Face
    final face = Paint()..color = const Color(0xFFFBD5BC);
    canvas.drawCircle(Offset(w * 0.5, h * 0.52), w * 0.16, face);

    // Eyes
    final eye = Paint()..color = const Color(0xFF0C4A6E);
    canvas.drawCircle(Offset(w * 0.43, h * 0.5), 2.5, eye);
    canvas.drawCircle(Offset(w * 0.57, h * 0.5), 2.5, eye);
  }

  void _drawHercules(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Lion pelt hood
    final lion = Paint()..color = const Color(0xFFB45309);
    canvas.drawCircle(Offset(w * 0.5, h * 0.4), w * 0.28, lion);

    // Face
    final face = Paint()..color = const Color(0xFFE09F67);
    canvas.drawCircle(Offset(w * 0.5, h * 0.5), w * 0.17, face);

    // Eyes
    final eye = Paint()..color = Colors.black;
    canvas.drawCircle(Offset(w * 0.43, h * 0.48), 2.5, eye);
    canvas.drawCircle(Offset(w * 0.57, h * 0.48), 2.5, eye);
  }

  void _drawPegasus(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Wings
    final wings = Paint()..color = const Color(0xFFE0E7FF);
    canvas.drawCircle(Offset(w * 0.32, h * 0.4), w * 0.2, wings);
    canvas.drawCircle(Offset(w * 0.68, h * 0.4), w * 0.2, wings);

    // Horse head
    final head = Paint()..color = Colors.white;
    canvas.drawOval(
      Rect.fromCenter(center: Offset(w * 0.5, h * 0.5), width: w * 0.24, height: h * 0.36),
      head,
    );

    // Eye
    canvas.drawCircle(Offset(w * 0.52, h * 0.42), 3.0, Paint()..color = const Color(0xFF6366F1));
  }

  void _drawHelios(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // 12 Sun rays
    final rayPaint = Paint()..color = const Color(0xFFF59E0B);
    for (int i = 0; i < 12; i++) {
      final angle = (i * pi / 6);
      final rx = c.dx + cos(angle) * (w * 0.34);
      final ry = c.dy + sin(angle) * (h * 0.34);
      canvas.drawCircle(Offset(rx, ry), 3.5, rayPaint);
    }

    // Solar face
    final face = Paint()
      ..shader = const RadialGradient(
        colors: [Color(0xFFFEF08A), Color(0xFFF59E0B)],
      ).createShader(Rect.fromCircle(center: c, radius: w * 0.24));
    canvas.drawCircle(c, w * 0.24, face);

    // Eyes
    canvas.drawCircle(Offset(w * 0.42, h * 0.46), 2.5, Paint()..color = const Color(0xFF78350F));
    canvas.drawCircle(Offset(w * 0.58, h * 0.46), 2.5, Paint()..color = const Color(0xFF78350F));
  }

  void _drawHades(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Dark cowl
    final cowl = Paint()..color = const Color(0xFF1E1B4B);
    canvas.drawCircle(Offset(w * 0.5, h * 0.48), w * 0.28, cowl);

    // Inner shadow face
    final face = Paint()..color = const Color(0xFF0F0A20);
    canvas.drawCircle(Offset(w * 0.5, h * 0.52), w * 0.17, face);

    // Violet glowing eyes
    final eye = Paint()..color = const Color(0xFFD8B4FE);
    canvas.drawCircle(Offset(w * 0.43, h * 0.48), 2.5, eye);
    canvas.drawCircle(Offset(w * 0.57, h * 0.48), 2.5, eye);
  }

  void _drawMedusa(Canvas canvas, Offset c, Size s) {
    final w = s.width;
    final h = s.height;
    // Serpents
    final snake = Paint()..color = const Color(0xFF10B981);
    for (int i = 0; i < 6; i++) {
      final angle = (i * pi / 3);
      final sx = c.dx + cos(angle) * (w * 0.32);
      final sy = c.dy + sin(angle) * (h * 0.32);
      canvas.drawCircle(Offset(sx, sy), 5, snake);
    }

    // Face
    final face = Paint()..color = const Color(0xFFE2E8F0);
    canvas.drawCircle(Offset(w * 0.5, h * 0.5), w * 0.18, face);

    // Gold eyes
    final eye = Paint()..color = const Color(0xFFF59E0B);
    canvas.drawCircle(Offset(w * 0.43, h * 0.47), 3, eye);
    canvas.drawCircle(Offset(w * 0.57, h * 0.47), 3, eye);
  }

  @override
  bool shouldRepaint(covariant _CharacterPainter oldDelegate) {
    return oldDelegate.id != id;
  }
}
