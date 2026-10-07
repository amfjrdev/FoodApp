import SwiftUI

public struct OrderStatusPill: View {
    public let status: OrderStatus

    public init(status: OrderStatus) {
        self.status = status
    }

    public var body: some View {
        HStack(spacing: 6) {
            Image(systemName: status.systemIcon)
                .font(.system(size: 11, weight: .bold))

            Text(status.displayName)
                .font(.system(size: 12, weight: .bold))
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .foregroundColor(status.themeColor)
        .background(status.themeColor.opacity(0.12))
        .clipShape(Capsule())
    }
}
