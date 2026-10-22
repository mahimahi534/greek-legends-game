import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('Greek Legends Mobile App smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const GreekLegendsMobileApp());
    expect(find.byType(GreekLegendsMobileApp), findsOneWidget);
  });
}
