import SwiftUI

public struct OrderTrackingView: View {
    public let orderNumber: String
    @StateObject private var viewModel: OrderTrackingViewModel

    public init(orderNumber: String) {
        self.orderNumber = orderNumber
        _viewModel = StateObject(wrappedValue: OrderTrackingViewModel(orderNumber: orderNumber))
    }

    public var body: some View {
        ZStack {
            AppTheme.background.ignoresSafeArea()

            if viewModel.isLoading && viewModel.order == nil {
                ProgressView("Locating order...")
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if let error = viewModel.errorMessage, viewModel.order == nil {
                EmptyStateView(
                    icon: "magnifyingglass",
                    title: "Order Not Found",
                    message: error,
                    buttonTitle: "Try Again"
                ) {
                    Task { await viewModel.fetchOrderStatus() }
                }
            } else if let order = viewModel.order {
                ScrollView(.vertical, showsIndicators: false) {
                    VStack(spacing: 20) {
                        // Status Hero Banner Card
                        statusHeroCard(order: order)

                        // Visual Status Timeline
                        timelineCard(currentStatus: order.status)

                        // Delivery Destination Card
                        destinationCard(order: order)

                        // Ordered Items Breakdown Card
                        itemsCard(order: order)

                        Spacer().frame(height: 40)
                    }
                    .padding(.horizontal)
                    .padding(.top, 16)
                }
                .refreshable {
                    await viewModel.fetchOrderStatus()
                }
            }
        }
        .navigationTitle("Order Tracking")
        #if os(iOS)
        .navigationBarTitleDisplayMode(.inline)
        #endif
        .task {
            await viewModel.fetchOrderStatus()
            viewModel.startAutoPolling()
        }
        .onDisappear {
            viewModel.stopAutoPolling()
        }
    }

    private func statusHeroCard(order: Order) -> some View {
        VStack(spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("ORDER TRACKING")
                        .font(.system(size: 10, weight: .heavy))
                        .foregroundColor(AppTheme.textMuted)
                        .tracking(1)

                    Text(order.orderNumber)
                        .font(.system(size: 20, weight: .heavy, design: .monospaced))
                        .foregroundColor(AppTheme.textPrimary)
                }

                Spacer()

                OrderStatusPill(status: order.status)
            }

            Divider()

            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(order.status.themeColor.opacity(0.15))
                        .frame(width: 44, height: 44)

                    Image(systemName: order.status.systemIcon)
                        .font(.system(size: 20))
                        .foregroundColor(order.status.themeColor)
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(order.status.displayName)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(AppTheme.textPrimary)

                    Text(order.status.detailedMessage)
                        .font(.system(size: 12))
                        .foregroundColor(AppTheme.textSecondary)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(16)
        .appCardStyle()
    }

    private func timelineCard(currentStatus: OrderStatus) -> some View {
        let steps: [OrderStatus] = [
            .pending,
            .confirmed,
            .preparing,
            .ready,
            .outForDelivery,
            .delivered
        ]

        let currentStepIndex = currentStatus.stepIndex

        return VStack(alignment: .leading, spacing: 16) {
            Text("Delivery Progress")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(AppTheme.textPrimary)

            if currentStatus == .cancelled {
                HStack(spacing: 12) {
                    Image(systemName: "xmark.octagon.fill")
                        .font(.system(size: 28))
                        .foregroundColor(AppTheme.danger)

                    VStack(alignment: .leading, spacing: 2) {
                        Text("Order Cancelled")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(AppTheme.danger)
                        Text("This order has been cancelled by the restaurant or administrator.")
                            .font(.system(size: 12))
                            .foregroundColor(AppTheme.textSecondary)
                    }
                }
                .padding(12)
                .background(AppTheme.danger.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusSmall))
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(steps.enumerated()), id: \.offset) { index, step in
                        let isCompleted = currentStepIndex >= index
                        let isCurrent = currentStepIndex == index

                        HStack(alignment: .top, spacing: 14) {
                            // Timeline dot & connecting line
                            VStack(spacing: 0) {
                                ZStack {
                                    Circle()
                                        .fill(isCompleted ? AppTheme.primary : Color(red: 0.88, green: 0.9, blue: 0.93))
                                        .frame(width: 22, height: 22)

                                    if isCompleted {
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 10, weight: .heavy))
                                            .foregroundColor(.white)
                                    }
                                }

                                if index < steps.count - 1 {
                                    Rectangle()
                                        .fill(isCompleted ? AppTheme.primary : Color(red: 0.88, green: 0.9, blue: 0.93))
                                        .frame(width: 2, height: 32)
                                }
                            }

                            // Step title and detail
                            VStack(alignment: .leading, spacing: 2) {
                                Text(step.displayName)
                                    .font(.system(size: 14, weight: isCurrent ? .heavy : isCompleted ? .bold : .regular))
                                    .foregroundColor(isCompleted ? AppTheme.textPrimary : AppTheme.textMuted)

                                if isCurrent {
                                    Text(step.detailedMessage)
                                        .font(.system(size: 11))
                                        .foregroundColor(AppTheme.primary)
                                }
                            }
                            .padding(.bottom, index < steps.count - 1 ? 16 : 0)

                            Spacer()
                        }
                    }
                }
            }
        }
        .padding(16)
        .appCardStyle()
    }

    private func destinationCard(order: Order) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Delivery Destination")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(AppTheme.textPrimary)

            HStack(spacing: 12) {
                Image(systemName: "mappin.circle.fill")
                    .font(.system(size: 24))
                    .foregroundColor(AppTheme.primary)

                VStack(alignment: .leading, spacing: 2) {
                    Text(order.customerName)
                        .font(.system(size: 14, weight: .bold))
                    Text(order.deliveryAddress)
                        .font(.system(size: 13))
                        .foregroundColor(AppTheme.textSecondary)
                }
            }

            if let notes = order.notes, !notes.isEmpty {
                Text("Note: \(notes)")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(red: 0.7, green: 0.4, blue: 0.1))
                    .padding(8)
                    .background(Color(red: 1.0, green: 0.96, blue: 0.9))
                    .clipShape(RoundedRectangle(cornerRadius: 6))
            }
        }
        .padding(16)
        .appCardStyle()
    }

    private func itemsCard(order: Order) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Order Summary (\(order.items.count) items)")
                .font(.system(size: 16, weight: .bold))

            ForEach(order.items) { item in
                HStack {
                    Text("\(item.quantity)x \(item.foodNameSnapshot)")
                        .font(.system(size: 13, weight: .medium))
                    Spacer()
                    Text(AppFormatters.currency(item.subtotal))
                        .font(.system(size: 13, weight: .bold))
                }
            }

            Divider()

            HStack {
                Text("Subtotal")
                    .foregroundColor(AppTheme.textSecondary)
                Spacer()
                Text(AppFormatters.currency(order.subtotal))
            }
            .font(.system(size: 13))

            HStack {
                Text("Delivery Fee")
                    .foregroundColor(AppTheme.textSecondary)
                Spacer()
                Text(order.deliveryFee == 0 ? "FREE" : AppFormatters.currency(order.deliveryFee))
                    .foregroundColor(order.deliveryFee == 0 ? AppTheme.success : AppTheme.textPrimary)
            }
            .font(.system(size: 13))

            Divider()

            HStack {
                Text("Total Paid")
                    .font(.system(size: 15, weight: .bold))
                Spacer()
                Text(AppFormatters.currency(order.total))
                    .font(.system(size: 16, weight: .heavy))
                    .foregroundColor(AppTheme.primary)
            }
        }
        .padding(16)
        .appCardStyle()
    }
}
