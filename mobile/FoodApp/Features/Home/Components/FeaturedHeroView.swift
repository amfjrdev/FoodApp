import SwiftUI

public struct FeaturedHeroView: View {
    public var body: some View {
        ZStack(alignment: .leading) {
            RoundedRectangle(cornerRadius: AppTheme.radiusLarge, style: .continuous)
                .fill(
                    LinearGradient(
                        colors: [Color(red: 0.12, green: 0.16, blue: 0.24), Color(red: 0.06, green: 0.09, blue: 0.16)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 8) {
                    HStack(spacing: 6) {
                        Image(systemName: "sparkles")
                            .font(.system(size: 11, weight: .bold))
                        Text("SPECIAL PROMO")
                            .font(.system(size: 11, weight: .heavy))
                    }
                    .foregroundColor(AppTheme.primary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(AppTheme.primary.opacity(0.15))
                    .clipShape(Capsule())

                    Text("Free Delivery on Orders Over $50")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(2)

                    Text("Fresh gourmet meals prepared by top culinary masters.")
                        .font(.system(size: 12))
                        .foregroundColor(Color.white.opacity(0.7))
                        .lineLimit(2)
                }
                .frame(maxWidth: .infinity, alignment: .leading)

                Image(systemName: "takeoutbag.and.cup.and.straw.fill")
                    .font(.system(size: 54))
                    .foregroundColor(AppTheme.primary.opacity(0.85))
            }
            .padding(20)
        }
        .frame(height: 150)
        .shadow(color: Color.black.opacity(0.12), radius: 12, x: 0, y: 6)
    }
}
