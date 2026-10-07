import SwiftUI

public struct FoodCardView: View {
    public let food: Food
    @EnvironmentObject private var cartStore: CartStore
    public let onSelect: () -> Void

    public var body: some View {
        Button(action: onSelect) {
            VStack(alignment: .leading, spacing: 8) {
                // Food Image
                ZStack(alignment: .topTrailing) {
                    AsyncFoodImage(urlString: food.image, height: 130, cornerRadius: AppTheme.radiusMedium)
                        .frame(maxWidth: .infinity)

                    if let catName = food.categoryName, !catName.isEmpty {
                        Text(catName)
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 7)
                            .padding(.vertical, 3)
                            .background(Color.black.opacity(0.65))
                            .clipShape(Capsule())
                            .padding(6)
                    }
                }

                // Title & Description
                VStack(alignment: .leading, spacing: 3) {
                    Text(food.name)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(AppTheme.textPrimary)
                        .lineLimit(1)

                    Text(food.description)
                        .font(.system(size: 11))
                        .foregroundColor(AppTheme.textSecondary)
                        .lineLimit(2)
                        .frame(height: 28, alignment: .topLeading)
                }

                // Price & Add to Cart action
                HStack(alignment: .center, spacing: 4) {
                    Text(AppFormatters.currency(food.price))
                        .font(.system(size: 15, weight: .heavy))
                        .foregroundColor(AppTheme.textPrimary)
                        .minimumScaleFactor(0.8)
                        .lineLimit(1)

                    Spacer(minLength: 2)

                    let currentQuantity = cartStore.quantity(for: food.id)

                    if currentQuantity > 0 {
                        HStack(spacing: 4) {
                            Button(action: {
                                cartStore.updateQuantity(for: food.id, delta: -1)
                            }) {
                                Image(systemName: "minus")
                                    .font(.system(size: 9, weight: .bold))
                                    .frame(width: 22, height: 22)
                                    .background(Color(red: 0.94, green: 0.95, blue: 0.97))
                                    .clipShape(Circle())
                            }

                            Text("\(currentQuantity)")
                                .font(.system(size: 12, weight: .bold))
                                .frame(minWidth: 14)

                            Button(action: {
                                cartStore.updateQuantity(for: food.id, delta: 1)
                            }) {
                                Image(systemName: "plus")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(.white)
                                    .frame(width: 22, height: 22)
                                    .background(AppTheme.primary)
                                    .clipShape(Circle())
                            }
                        }
                    } else {
                        Button(action: {
                            cartStore.addItem(food, quantity: 1)
                        }) {
                            HStack(spacing: 3) {
                                Image(systemName: "plus")
                                    .font(.system(size: 11, weight: .bold))
                                Text("Add")
                                    .font(.system(size: 12, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(AppTheme.primary)
                            .clipShape(Capsule())
                        }
                    }
                }
            }
            .padding(10)
            .appCardStyle()
        }
        .buttonStyle(.plain)
    }
}
