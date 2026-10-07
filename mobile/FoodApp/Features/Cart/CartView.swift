import SwiftUI

public struct CartView: View {
    @EnvironmentObject private var cartStore: CartStore
    @Environment(\.dismiss) private var dismiss
    @State private var showingCheckout = false

    public var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                if cartStore.items.isEmpty {
                    EmptyStateView(
                        icon: "bag",
                        title: "Your Cart is Empty",
                        message: "Looks like you haven't added any delicious dishes to your order yet.",
                        buttonTitle: "Start Browsing"
                    ) {
                        dismiss()
                    }
                } else {
                    VStack(spacing: 0) {
                        ScrollView(.vertical, showsIndicators: false) {
                            VStack(spacing: 16) {
                                // Free Delivery Progress Bar
                                freeDeliveryBar

                                // Items List
                                VStack(spacing: 12) {
                                    ForEach(cartStore.items) { item in
                                        CartItemRow(item: item)
                                    }
                                }

                                // Clear Cart Button
                                Button(action: {
                                    withAnimation {
                                        cartStore.clear()
                                    }
                                }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "trash")
                                            .font(.system(size: 12))
                                        Text("Clear All Items")
                                            .font(.system(size: 13, weight: .semibold))
                                    }
                                    .foregroundColor(AppTheme.danger)
                                }
                                .padding(.top, 4)

                                // Order Summary Box
                                summaryBox

                                Spacer().frame(height: 100)
                            }
                            .padding(.horizontal)
                            .padding(.top, 16)
                        }

                        // Bottom Sticky Checkout Button
                        VStack(spacing: 0) {
                            Divider()

                            HStack(spacing: 16) {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("ESTIMATED TOTAL")
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(AppTheme.textMuted)
                                    Text(AppFormatters.currency(cartStore.estimatedTotal))
                                        .font(.system(size: 22, weight: .heavy))
                                        .foregroundColor(AppTheme.textPrimary)
                                }

                                PrimaryButton(
                                    title: "Proceed to Checkout",
                                    icon: "arrow.right"
                                ) {
                                    showingCheckout = true
                                }
                            }
                            .padding(.horizontal, 20)
                            .padding(.vertical, 16)
                            .background(Color.white.ignoresSafeArea(edges: .bottom))
                            .shadow(color: Color.black.opacity(0.06), radius: 12, x: 0, y: -4)
                        }
                    }
                }
            }
            .navigationTitle("Your Cart (\(cartStore.itemCount))")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .navigationDestination(isPresented: $showingCheckout) {
                CheckoutView()
            }
        }
    }

    private var freeDeliveryBar: some View {
        let threshold = 50.0
        let current = cartStore.subtotal
        let progress = min(1.0, current / threshold)
        let needed = max(0.0, threshold - current)

        return VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: progress >= 1.0 ? "checkmark.circle.fill" : "shippingbox.fill")
                    .foregroundColor(progress >= 1.0 ? AppTheme.success : AppTheme.primary)
                    .font(.system(size: 14))

                if progress >= 1.0 {
                    Text("You've unlocked FREE delivery!")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(AppTheme.success)
                } else {
                    Text("Add \(AppFormatters.currency(needed)) more for FREE delivery")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(AppTheme.textPrimary)
                }
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(Color(red: 0.9, green: 0.92, blue: 0.95))
                        .frame(height: 6)

                    Capsule()
                        .fill(progress >= 1.0 ? AppTheme.success : AppTheme.primary)
                        .frame(width: geo.size.width * CGFloat(progress), height: 6)
                }
            }
            .frame(height: 6)
        }
        .padding(14)
        .background(progress >= 1.0 ? AppTheme.success.opacity(0.08) : Color.white)
        .appCardStyle()
    }

    private var summaryBox: some View {
        VStack(spacing: 12) {
            Text("Order Summary")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(AppTheme.textPrimary)
                .frame(maxWidth: .infinity, alignment: .leading)

            Divider()

            HStack {
                Text("Subtotal")
                    .foregroundColor(AppTheme.textSecondary)
                Spacer()
                Text(AppFormatters.currency(cartStore.subtotal))
                    .fontWeight(.semibold)
            }
            .font(.system(size: 14))

            HStack {
                Text("Estimated Delivery")
                    .foregroundColor(AppTheme.textSecondary)
                Spacer()
                if cartStore.estimatedDeliveryFee == 0 {
                    Text("FREE")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(AppTheme.success)
                } else {
                    Text(AppFormatters.currency(cartStore.estimatedDeliveryFee))
                        .font(.system(size: 14, weight: .semibold))
                }
            }

            Divider()

            HStack {
                Text("Total")
                    .font(.system(size: 16, weight: .bold))
                Spacer()
                Text(AppFormatters.currency(cartStore.estimatedTotal))
                    .font(.system(size: 18, weight: .heavy))
                    .foregroundColor(AppTheme.primary)
            }
        }
        .padding(16)
        .appCardStyle()
    }
}
