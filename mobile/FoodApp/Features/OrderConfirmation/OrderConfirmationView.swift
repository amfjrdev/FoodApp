import SwiftUI

public struct OrderConfirmationView: View {
    public let order: Order
    @State private var showingTracking = false
    @Environment(\.dismiss) private var dismiss

    public var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            VStack(spacing: 28) {
                Spacer()

                // Animated Success Seal
                ZStack {
                    Circle()
                        .fill(AppTheme.success.opacity(0.12))
                        .frame(width: 110, height: 110)

                    Circle()
                        .fill(AppTheme.success)
                        .frame(width: 80, height: 80)
                        .shadow(color: AppTheme.success.opacity(0.4), radius: 16, x: 0, y: 8)

                    Image(systemName: "checkmark")
                        .font(.system(size: 36, weight: .heavy))
                        .foregroundColor(.white)
                }

                // Heading
                VStack(spacing: 8) {
                    Text("Order Placed Successfully!")
                        .font(.system(size: 24, weight: .heavy))
                        .foregroundColor(AppTheme.textPrimary)
                        .multilineTextAlignment(.center)

                    Text("The restaurant has received your order and will start preparation soon.")
                        .font(.system(size: 14))
                        .foregroundColor(AppTheme.textSecondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 24)
                }

                // Order Number Card
                VStack(spacing: 6) {
                    Text("YOUR ORDER NUMBER")
                        .font(.system(size: 11, weight: .heavy))
                        .foregroundColor(AppTheme.textMuted)
                        .tracking(1)

                    Text(order.orderNumber)
                        .font(.system(size: 26, weight: .heavy, design: .monospaced))
                        .foregroundColor(AppTheme.primary)

                    Text("Save this number to track your food anytime.")
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.textSecondary)
                }
                .padding(20)
                .frame(maxWidth: .infinity)
                .appCardStyle()
                .padding(.horizontal)

                Spacer()

                // Actions
                VStack(spacing: 12) {
                    PrimaryButton(
                        title: "Track Live Order Status",
                        icon: "location.fill"
                    ) {
                        showingTracking = true
                    }

                    Button(action: {
                        // Pop back to root home
                        dismiss()
                    }) {
                        Text("Return to Menu")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(AppTheme.textSecondary)
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                    }
                }
                .padding(.horizontal, 24)
                .padding(.bottom, 30)
            }
        }
        .navigationBarBackButtonHidden(true)
        .navigationDestination(isPresented: $showingTracking) {
            OrderTrackingView(orderNumber: order.orderNumber)
        }
    }
}
