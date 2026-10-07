import Foundation
import SwiftUI
import Combine

public struct CartItem: Identifiable, Codable, Hashable, Sendable {
    public var id: String { food.id }
    public let food: Food
    public var quantity: Int

    public init(food: Food, quantity: Int = 1) {
        self.food = food
        self.quantity = quantity
    }

    public var lineTotal: Double {
        food.price * Double(quantity)
    }
}

@MainActor
public final class CartStore: ObservableObject {
    @Published public private(set) var items: [CartItem] = []

    public init() {}

    public var itemCount: Int {
        items.reduce(0) { $0 + $1.quantity }
    }

    public var subtotal: Double {
        items.reduce(0.0) { $0 + $1.lineTotal }
    }

    public var estimatedDeliveryFee: Double {
        if items.isEmpty { return 0.0 }
        return subtotal >= 50.0 ? 0.0 : 3.99
    }

    public var estimatedTotal: Double {
        if items.isEmpty { return 0.0 }
        return subtotal + estimatedDeliveryFee
    }

    public func quantity(for foodId: String) -> Int {
        items.first(where: { $0.food.id == foodId })?.quantity ?? 0
    }

    public func addItem(_ food: Food, quantity: Int = 1) {
        if let index = items.firstIndex(where: { $0.food.id == food.id }) {
            items[index].quantity += quantity
        } else {
            items.append(CartItem(food: food, quantity: quantity))
        }
    }

    public func updateQuantity(for foodId: String, delta: Int) {
        guard let index = items.firstIndex(where: { $0.food.id == foodId }) else { return }
        let newQuantity = items[index].quantity + delta
        if newQuantity <= 0 {
            items.remove(at: index)
        } else {
            items[index].quantity = newQuantity
        }
    }

    public func removeItem(for foodId: String) {
        items.removeAll(where: { $0.food.id == foodId })
    }

    public func clear() {
        items.removeAll()
    }
}
