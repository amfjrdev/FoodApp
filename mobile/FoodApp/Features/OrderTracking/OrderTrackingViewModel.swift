import Foundation
import SwiftUI
import Combine

@MainActor
public final class OrderTrackingViewModel: ObservableObject {
    @Published public var order: Order? = nil
    @Published public var isLoading: Bool = false
    @Published public var errorMessage: String? = nil

    private let orderNumber: String
    private let apiClient: APIClient
    private var timer: Timer? = nil

    public init(orderNumber: String, apiClient: APIClient = .shared) {
        self.orderNumber = orderNumber
        self.apiClient = apiClient
    }

    public func fetchOrderStatus() async {
        isLoading = true
        errorMessage = nil

        do {
            let fetchedOrder: Order = try await apiClient.request(.trackOrder(orderNumber: orderNumber))
            self.order = fetchedOrder
        } catch let error as APIError {
            self.errorMessage = error.errorDescription
        } catch {
            self.errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    public func startAutoPolling() {
        timer?.invalidate()
        timer = Timer.scheduledTimer(withTimeInterval: 8.0, repeats: true) { [weak self] _ in
            Task { @MainActor [weak self] in
                guard let self = self, let currentOrder = self.order else { return }
                // Only poll while not in terminal delivered/cancelled state
                if currentOrder.status != .delivered && currentOrder.status != .cancelled {
                    await self.fetchOrderStatus()
                }
            }
        }
    }

    public func stopAutoPolling() {
        timer?.invalidate()
        timer = nil
    }
}
