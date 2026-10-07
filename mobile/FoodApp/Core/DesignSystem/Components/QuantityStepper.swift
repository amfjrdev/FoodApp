import SwiftUI

public struct QuantityStepper: View {
    public let quantity: Int
    public let onIncrement: () -> Void
    public let onDecrement: () -> Void

    public init(quantity: Int, onIncrement: @escaping () -> Void, onDecrement: @escaping () -> Void) {
        self.quantity = quantity
        self.onIncrement = onIncrement
        self.onDecrement = onDecrement
    }

    public var body: some View {
        HStack(spacing: 12) {
            Button(action: onDecrement) {
                Image(systemName: quantity == 1 ? "trash" : "minus")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(quantity == 1 ? AppTheme.danger : AppTheme.textPrimary)
                    .frame(width: 32, height: 32)
                    .background(Color(red: 0.94, green: 0.95, blue: 0.97))
                    .clipShape(Circle())
            }

            Text("\(quantity)")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(AppTheme.textPrimary)
                .frame(minWidth: 20)

            Button(action: onIncrement) {
                Image(systemName: "plus")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.white)
                    .frame(width: 32, height: 32)
                    .background(AppTheme.primary)
                    .clipShape(Circle())
            }
        }
        .padding(4)
        .background(Color.white)
        .clipShape(Capsule())
        .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 2)
    }
}
