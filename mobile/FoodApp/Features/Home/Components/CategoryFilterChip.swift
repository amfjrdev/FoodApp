import SwiftUI

public struct CategoryFilterChip: View {
    public let category: Category?
    public let isSelected: Bool
    public let action: () -> Void

    public var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let category = category {
                    AsyncFoodImage(urlString: category.image, cornerRadius: 6)
                        .frame(width: 24, height: 24)
                    Text(category.name)
                } else {
                    Image(systemName: "square.grid.2x2.fill")
                        .font(.system(size: 13))
                    Text("All Items")
                }
            }
            .font(.system(size: 14, weight: isSelected ? .bold : .semibold))
            .foregroundColor(isSelected ? .white : AppTheme.textPrimary)
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(
                Group {
                    if isSelected {
                        AppTheme.primary
                    } else {
                        Color.white
                    }
                }
            )
            .clipShape(Capsule())
            .shadow(color: isSelected ? AppTheme.primary.opacity(0.3) : Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
            .overlay(
                Capsule()
                    .stroke(isSelected ? Color.clear : AppTheme.border, lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
    }
}
