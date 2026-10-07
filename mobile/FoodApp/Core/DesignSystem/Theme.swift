import SwiftUI

public enum AppTheme {
    // Primary Brand Palette
    public static let primary = Color(red: 0.98, green: 0.45, blue: 0.09) // Vibrant Orange #F97316
    public static let primaryDark = Color(red: 0.92, green: 0.35, blue: 0.05) // Deep Orange #EA580C
    public static let primaryLight = Color(red: 1.00, green: 0.95, blue: 0.90) // Soft Peach

    // Neutrals & Surfaces
    public static let background = Color(red: 0.97, green: 0.98, blue: 0.99) // Light Grey #F8FAFC
    public static let cardBackground = Color.white
    public static let textPrimary = Color(red: 0.06, green: 0.09, blue: 0.16) // #0F172A
    public static let textSecondary = Color(red: 0.39, green: 0.45, blue: 0.55) // #64748B
    public static let textMuted = Color(red: 0.58, green: 0.64, blue: 0.72) // #94A3B8
    public static let border = Color(red: 0.89, green: 0.91, blue: 0.94) // #E2E8F0

    // Accents
    public static let success = Color(red: 0.06, green: 0.73, blue: 0.51) // Emerald #10B981
    public static let warning = Color(red: 0.96, green: 0.62, blue: 0.04) // Amber #F59E0B
    public static let danger = Color(red: 0.94, green: 0.27, blue: 0.27) // Red #EF4444

    // Radii
    public static let radiusSmall: CGFloat = 8
    public static let radiusMedium: CGFloat = 14
    public static let radiusLarge: CGFloat = 20
    public static let radiusCard: CGFloat = 18
    public static let radiusPill: CGFloat = 999
}

public extension View {
    func appCardStyle(backgroundColor: Color = AppTheme.cardBackground, cornerRadius: CGFloat = AppTheme.radiusCard) -> some View {
        self
            .background(backgroundColor)
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .shadow(color: Color.black.opacity(0.04), radius: 10, x: 0, y: 4)
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .stroke(AppTheme.border.opacity(0.6), lineWidth: 1)
            )
    }
}
