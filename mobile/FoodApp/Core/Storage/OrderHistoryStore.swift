import Foundation
import SwiftUI
import Combine

@MainActor
public final class OrderHistoryStore: ObservableObject {
    @Published public private(set) var savedOrderNumbers: [String] = []

    private let userDefaultsKey = "foodapp_saved_order_numbers"

    public init() {
        loadOrders()
    }

    private func loadOrders() {
        if let saved = UserDefaults.standard.stringArray(forKey: userDefaultsKey) {
            self.savedOrderNumbers = saved
        }
    }

    public func saveOrderNumber(_ orderNumber: String) {
        let clean = orderNumber.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        guard !clean.isEmpty else { return }

        var current = savedOrderNumbers.filter { $0 != clean }
        current.insert(clean, at: 0) // Newest first

        savedOrderNumbers = current
        UserDefaults.standard.set(current, forKey: userDefaultsKey)
    }

    public func removeOrderNumber(_ orderNumber: String) {
        savedOrderNumbers.removeAll { $0 == orderNumber }
        UserDefaults.standard.set(savedOrderNumbers, forKey: userDefaultsKey)
    }
}
