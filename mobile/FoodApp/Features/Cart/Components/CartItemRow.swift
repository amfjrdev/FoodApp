import SwiftUI

public struct CartItemRow: View {
    public let item: CartItem
    @EnvironmentObject private var cartStore: CartStore

    public var body: some View {
        HStack(spacing: 14) {
            // Food Image
            AsyncFoodImage(urlString: item.food.image, cornerRadius: AppTheme.radiusSmall)
                .frame(width: 72, height: 72)

            // Info & Quantity
            VStack(alignment: .leading, spacing: 6) {
                Text(item.food.name)
                    .font(.system(size: 15, weight: .bold))
                    .foregroundColor(AppTheme.textPrimary)
                    .lineLimit(1)

                Text(AppFormatters.currency(item.food.price))
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(AppTheme.textSecondary)

                HStack {
                    QuantityStepper(
                        quantity: item.quantity,
                        onIncrement: {
                            cartStore.updateQuantity(for: item.food.id, delta: 1)
                        },
                        onDecrement: {
                            cartStore.updateQuantity(for: item.food.id, delta: -1)
                        }
                    )

                    Spacer()

                    Text(AppFormatters.currency(item.lineTotal))
                        .font(.system(size: 16, weight: .heavy))
                        .foregroundColor(AppTheme.primary)
                }
            }
        }
        .padding(14)
        .appCardStyle()
    }
}
