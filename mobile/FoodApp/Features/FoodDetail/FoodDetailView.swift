import SwiftUI

public struct FoodDetailView: View {
    public let food: Food
    @EnvironmentObject private var cartStore: CartStore
    @Environment(\.dismiss) private var dismiss
    @State private var quantity: Int = 1
    @State private var showAddedAnimation: Bool = false

    public var body: some View {
        ZStack(alignment: .bottom) {
            AppTheme.background.ignoresSafeArea()

            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {
                    // Large Food Image Header
                    ZStack(alignment: .topLeading) {
                        AsyncFoodImage(urlString: food.image, height: 280, cornerRadius: 0)
                            .frame(maxWidth: .infinity)

                        // Back Button
                        Button(action: { dismiss() }) {
                            Circle()
                                .fill(Color.white.opacity(0.9))
                                .frame(width: 40, height: 40)
                                .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 2)
                                .overlay(
                                    Image(systemName: "chevron.left")
                                        .font(.system(size: 14, weight: .bold))
                                        .foregroundColor(AppTheme.textPrimary)
                                )
                        }
                        .padding(.leading, 20)
                        .padding(.top, 50)
                    }

                    // Content Container with curved top
                    VStack(alignment: .leading, spacing: 20) {
                        // Category & Availability Badge
                        HStack {
                            if let categoryName = food.categoryName {
                                Text(categoryName)
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(AppTheme.primary)
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 5)
                                    .background(AppTheme.primary.opacity(0.12))
                                    .clipShape(Capsule())
                            }

                            Spacer()

                            HStack(spacing: 6) {
                                Circle()
                                    .fill(food.isAvailable ? AppTheme.success : AppTheme.danger)
                                    .frame(width: 8, height: 8)
                                Text(food.isAvailable ? "In Stock" : "Unavailable")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(food.isAvailable ? AppTheme.success : AppTheme.danger)
                            }
                        }

                        // Title & Price
                        HStack(alignment: .top) {
                            Text(food.name)
                                .font(.system(size: 24, weight: .heavy))
                                .foregroundColor(AppTheme.textPrimary)

                            Spacer()

                            Text(AppFormatters.currency(food.price))
                                .font(.system(size: 24, weight: .heavy))
                                .foregroundColor(AppTheme.primary)
                        }

                        Divider()

                        // Description
                        VStack(alignment: .leading, spacing: 8) {
                            Text("About this dish")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)

                            Text(food.description)
                                .font(.system(size: 15))
                                .foregroundColor(AppTheme.textSecondary)
                                .lineSpacing(4)
                        }

                        Divider()

                        // Quantity Selector
                        HStack {
                            Text("Quantity")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)

                            Spacer()

                            QuantityStepper(
                                quantity: quantity,
                                onIncrement: { quantity += 1 },
                                onDecrement: {
                                    if quantity > 1 { quantity -= 1 }
                                }
                            )
                        }

                        Spacer().frame(height: 120) // Bottom bar spacing
                    }
                    .padding(24)
                    .background(Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusLarge, style: .continuous))
                    .offset(y: -20)
                }
            }
            .ignoresSafeArea(edges: .top)

            // Bottom Floating Action Bar
            VStack(spacing: 0) {
                Divider()

                HStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("TOTAL PRICE")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(AppTheme.textMuted)
                        Text(AppFormatters.currency(food.price * Double(quantity)))
                            .font(.system(size: 22, weight: .heavy))
                            .foregroundColor(AppTheme.textPrimary)
                    }

                    PrimaryButton(
                        title: showAddedAnimation ? "Added to Cart ✓" : "Add to Cart",
                        icon: showAddedAnimation ? "checkmark" : "bag.badge.plus",
                        isEnabled: food.isAvailable
                    ) {
                        cartStore.addItem(food, quantity: quantity)
                        withAnimation(.spring()) {
                            showAddedAnimation = true
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                            showAddedAnimation = false
                            dismiss()
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 16)
                .background(Color.white.ignoresSafeArea(edges: .bottom))
                .shadow(color: Color.black.opacity(0.08), radius: 16, x: 0, y: -4)
            }
        }
        #if os(iOS)
        .navigationBarBackButtonHidden(true)
        #endif
    }
}
