import Foundation
import SwiftUI
import Combine

@MainActor
public final class CheckoutViewModel: ObservableObject {
    @Published public var customerName: String = ""
    @Published public var customerPhone: String = ""
    @Published public var deliveryAddress: String = ""
    @Published public var notes: String = ""

    @Published public var isSubmitting: Bool = false
    @Published public var errorMessage: String? = nil
    @Published public var placedOrder: Order? = nil

    private let apiClient: APIClient

    public init(apiClient: APIClient = .shared) {
        self.apiClient = apiClient
    }

    public var isFormValid: Bool {
        customerName.trimmingCharacters(in: .whitespacesAndNewlines).count >= 2 &&
        customerPhone.trimmingCharacters(in: .whitespacesAndNewlines).count >= 5 &&
        deliveryAddress.trimmingCharacters(in: .whitespacesAndNewlines).count >= 5
    }

    public func placeOrder(cartStore: CartStore, historyStore: OrderHistoryStore) async -> Bool {
        guard isFormValid, !cartStore.items.isEmpty else { return false }

        isSubmitting = true
        errorMessage = nil

        let itemsPayload = cartStore.items.map {
            CreateOrderItemBody(foodId: $0.food.id, quantity: $0.quantity)
        }

        let body = CreateOrderRequestBody(
            customerName: customerName.trimmingCharacters(in: .whitespacesAndNewlines),
            customerPhone: customerPhone.trimmingCharacters(in: .whitespacesAndNewlines),
            deliveryAddress: deliveryAddress.trimmingCharacters(in: .whitespacesAndNewlines),
            notes: notes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : notes,
            items: itemsPayload
        )

        do {
            let order: Order = try await apiClient.request(.createOrder(body: body))
            self.placedOrder = order

            // Store placed order number locally on customer device
            historyStore.saveOrderNumber(order.orderNumber)

            // Clear active cart
            cartStore.clear()

            isSubmitting = false
            return true
        } catch let error as APIError {
            self.errorMessage = error.errorDescription
            self.isSubmitting = false
            return false
        } catch {
            self.errorMessage = error.localizedDescription
            self.isSubmitting = false
            return false
        }
    }
}
