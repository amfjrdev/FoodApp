import SwiftUI

public struct CheckoutView: View {
    @StateObject private var viewModel = CheckoutViewModel()
    @EnvironmentObject private var cartStore: CartStore
    @EnvironmentObject private var historyStore: OrderHistoryStore
    @Environment(\.dismiss) private var dismiss
    @State private var showingConfirmation = false

    public var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 20) {
                    // Error Banner
                    if let error = viewModel.errorMessage {
                        HStack(spacing: 8) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(AppTheme.danger)
                            Text(error)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(AppTheme.danger)
                        }
                        .padding(14)
                        .background(AppTheme.danger.opacity(0.1))
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMedium))
                    }

                    // Delivery Information Section
                    VStack(alignment: .leading, spacing: 14) {
                        HStack(spacing: 6) {
                            Image(systemName: "mappin.circle.fill")
                                .foregroundColor(AppTheme.primary)
                            Text("Delivery Details")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)
                        }

                        VStack(spacing: 12) {
                            customTextField(
                                title: "Full Name *",
                                placeholder: "e.g. Alex Morgan",
                                text: $viewModel.customerName,
                                icon: "person.fill",
                                isPhone: false
                            )

                            customTextField(
                                title: "Phone Number *",
                                placeholder: "e.g. +1 (555) 234-5678",
                                text: $viewModel.customerPhone,
                                icon: "phone.fill",
                                isPhone: true
                            )

                            customTextField(
                                title: "Delivery Address *",
                                placeholder: "Street, Apt / Suite, City",
                                text: $viewModel.deliveryAddress,
                                icon: "location.fill",
                                isPhone: false
                            )

                            customTextField(
                                title: "Courier Delivery Instructions (Optional)",
                                placeholder: "e.g. Ring apartment bell 4B or leave at gate",
                                text: $viewModel.notes,
                                icon: "note.text",
                                isPhone: false
                            )
                        }
                    }
                    .padding(16)
                    .appCardStyle()

                    // Payment Method (Anonymous Cash/Card on Delivery)
                    VStack(alignment: .leading, spacing: 10) {
                        HStack(spacing: 6) {
                            Image(systemName: "creditcard.fill")
                                .foregroundColor(AppTheme.primary)
                            Text("Payment Method")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)
                        }

                        HStack(spacing: 12) {
                            Image(systemName: "banknote.fill")
                                .font(.system(size: 20))
                                .foregroundColor(AppTheme.success)

                            VStack(alignment: .leading, spacing: 2) {
                                Text("Pay on Delivery")
                                    .font(.system(size: 14, weight: .bold))
                                Text("Cash or contactless card with courier upon arrival")
                                    .font(.system(size: 12))
                                    .foregroundColor(AppTheme.textSecondary)
                            }

                            Spacer()

                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(AppTheme.primary)
                        }
                        .padding(12)
                        .background(Color(red: 0.96, green: 0.98, blue: 0.99))
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMedium))
                    }
                    .padding(16)
                    .appCardStyle()

                    // Line Items Breakdown
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Items in Order (\(cartStore.itemCount))")
                            .font(.system(size: 16, weight: .bold))

                        ForEach(cartStore.items) { item in
                            HStack {
                                Text("\(item.quantity)x \(item.food.name)")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(AppTheme.textPrimary)
                                Spacer()
                                Text(AppFormatters.currency(item.lineTotal))
                                    .font(.system(size: 14, weight: .bold))
                            }
                        }

                        Divider().padding(.vertical, 4)

                        HStack {
                            Text("Subtotal")
                                .foregroundColor(AppTheme.textSecondary)
                            Spacer()
                            Text(AppFormatters.currency(cartStore.subtotal))
                        }
                        .font(.system(size: 14))

                        HStack {
                            Text("Delivery Fee")
                                .foregroundColor(AppTheme.textSecondary)
                            Spacer()
                            Text(cartStore.estimatedDeliveryFee == 0 ? "FREE" : AppFormatters.currency(cartStore.estimatedDeliveryFee))
                                .foregroundColor(cartStore.estimatedDeliveryFee == 0 ? AppTheme.success : AppTheme.textPrimary)
                                .fontWeight(cartStore.estimatedDeliveryFee == 0 ? .bold : .regular)
                        }
                        .font(.system(size: 14))

                        Divider().padding(.vertical, 4)

                        HStack {
                            Text("Grand Total")
                                .font(.system(size: 16, weight: .heavy))
                            Spacer()
                            Text(AppFormatters.currency(cartStore.estimatedTotal))
                                .font(.system(size: 18, weight: .heavy))
                                .foregroundColor(AppTheme.primary)
                        }
                    }
                    .padding(16)
                    .appCardStyle()

                    // Submit Button
                    PrimaryButton(
                        title: "Confirm & Place Order",
                        icon: "checkmark.seal.fill",
                        isLoading: viewModel.isSubmitting,
                        isEnabled: viewModel.isFormValid
                    ) {
                        Task {
                            let success = await viewModel.placeOrder(
                                cartStore: cartStore,
                                historyStore: historyStore
                            )
                            if success {
                                showingConfirmation = true
                            }
                        }
                    }
                    .padding(.top, 8)
                    .padding(.bottom, 40)
                }
                .padding(.horizontal)
                .padding(.top, 16)
            }
        }
        .navigationTitle("Checkout")
        #if os(iOS)
        .navigationBarTitleDisplayMode(.inline)
        #endif
        .navigationDestination(isPresented: $showingConfirmation) {
            if let order = viewModel.placedOrder {
                OrderConfirmationView(order: order)
            }
        }
    }

    private func customTextField(
        title: String,
        placeholder: String,
        text: Binding<String>,
        icon: String,
        isPhone: Bool = false
    ) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(AppTheme.textSecondary)

            HStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.system(size: 14))
                    .foregroundColor(AppTheme.textMuted)
                    .frame(width: 20)

                #if os(iOS)
                TextField(placeholder, text: text)
                    .font(.system(size: 14))
                    .keyboardType(isPhone ? .phonePad : .default)
                #else
                TextField(placeholder, text: text)
                    .font(.system(size: 14))
                #endif
            }
            .padding(12)
            .background(Color(red: 0.97, green: 0.98, blue: 0.99))
            .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusSmall))
            .overlay(
                RoundedRectangle(cornerRadius: AppTheme.radiusSmall)
                    .stroke(AppTheme.border, lineWidth: 1)
            )
        }
    }
}
