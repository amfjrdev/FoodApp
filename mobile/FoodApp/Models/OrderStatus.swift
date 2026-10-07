import Foundation
import SwiftUI

public enum OrderStatus: String, Codable, CaseIterable, Sendable {
    case pending = "PENDING"
    case confirmed = "CONFIRMED"
    case preparing = "PREPARING"
    case ready = "READY"
    case outForDelivery = "OUT_FOR_DELIVERY"
    case delivered = "DELIVERED"
    case cancelled = "CANCELLED"

    public var displayName: String {
        switch self {
        case .pending: return "Order Received"
        case .confirmed: return "Confirmed"
        case .preparing: return "Preparing Meal"
        case .ready: return "Ready for Courier"
        case .outForDelivery: return "On the Way"
        case .delivered: return "Delivered"
        case .cancelled: return "Cancelled"
        }
    }

    public var detailedMessage: String {
        switch self {
        case .pending:
            return "Your order has been placed and is waiting for restaurant acceptance."
        case .confirmed:
            return "The restaurant accepted your order and sent it to the kitchen."
        case .preparing:
            return "Our chefs are freshly crafting your delicious food right now."
        case .ready:
            return "Your meal is packaged warm and ready for the courier to pick up."
        case .outForDelivery:
            return "Your delivery courier is en route to your doorstep."
        case .delivered:
            return "Order successfully delivered! Enjoy your meal!"
        case .cancelled:
            return "This order was cancelled."
        }
    }

    public var systemIcon: String {
        switch self {
        case .pending: return "clock.fill"
        case .confirmed: return "checkmark.seal.fill"
        case .preparing: return "flame.fill"
        case .ready: return "takeoutbag.and.cup.and.straw.fill"
        case .outForDelivery: return "scooter"
        case .delivered: return "checkmark.circle.fill"
        case .cancelled: return "xmark.circle.fill"
        }
    }

    public var stepIndex: Int {
        switch self {
        case .pending: return 0
        case .confirmed: return 1
        case .preparing: return 2
        case .ready: return 3
        case .outForDelivery: return 4
        case .delivered: return 5
        case .cancelled: return -1
        }
    }

    public var themeColor: Color {
        switch self {
        case .pending: return Color.orange
        case .confirmed: return Color.blue
        case .preparing: return Color.purple
        case .ready: return Color.teal
        case .outForDelivery: return Color.indigo
        case .delivered: return Color.green
        case .cancelled: return Color.red
        }
    }
}
