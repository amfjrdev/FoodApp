import SwiftUI

public struct FoodCardView: View {
    public let food: Food
    @EnvironmentObject private var cartStore: CartStore
    public let onSelect: () -> Void

    public var body: some View {
        Button(action: onSelect) {
            VStack(alignment: .leading, spacing: 10) {
                // Food Image
                ZStack(alignment: .topTrailing) {
                    AsyncFoodImage(urlString: food.image, height: 140, cornerRadius: AppTheme.radiusMedium)
                        .frame(maxWidth: .infinity)

                    if let catName = food.categoryName, !catName.isEmpty {
                        Text(catName)
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color.black.opacity(0.6))
                            .clipShape(Capsule())
                            .padding(8)
                    }
                }

                // Title & Description
                VStack(alignment: .leading, spacing: 4) {
                    Text(food.name)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(AppTheme.textPrimary)
                        .lineLimit(1)

                    Text(food.description)
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.textSecondary)
                        .lineLimit(2)
                        .frame(height: 32, alignment: .topLeading)
                }

                // Price & Add to Cart action
                HStack(alignment: .center) {
                    Text(AppFormatters.currency(food.price))
                        .font(.system(size: 17, weight: .heavy))
                        .foregroundColor(AppTheme.textPrimary)

                    Spacer()

                    let currentQuantity = cartStore.quantity(for: food.id)

                    if currentQuantity > 0 {
                        HStack(spacing: 6) {
                            Button(action: {
                                cartStore.updateQuantity(for: food.id, delta: -1)
                            }) {
                                Image(systemName: "minus")
                                    .font(.system(size: 10, weight: .bold))
                                    .frame(width: 24, height: 24)
                                    .background(Color(red: 0.94, green: 0.95, blue: 0.97))
                                    .clipShape(Circle())
                            }

                            Text("\(currentQuantity)")
                                .font(.system(size: 13, weight: .bold))
                                .frame(minWidth: 16)

                            Button(action: {
                                cartStore.updateQuantity(for: food.id, delta: 1)
                            }) {
                                Image(systemName: "plus")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(width: 24, height: 24)
                                    .background(AppTheme.primary)
                                    .clipShape(Circle())
                            }
                        }
                    } else {
                        Button(action: {
                            cartStore.addItem(food, quantity: 1)
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: "plus")
                                    .font(.system(size: 12, weight: .bold))
                                Text("Add")
                                    .font(.system(size: 13, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 7)
                            .background(AppTheme.primary)
                            .clipShape(Capsule())
                        }
                    }
                }
            }
            .padding(12)
            .appCardStyle()
        }
        .buttonStyle(.plain)
    }
}
