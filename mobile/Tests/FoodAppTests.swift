import XCTest
@testable import FoodAppCore

final class FoodAppTests: XCTestCase {
    @MainActor
    func testCartStoreCalculations() {
        let store = CartStore()
        let food1 = Food(id: "1", name: "Burger", description: "Tasty burger", price: 15.0, image: "img1")
        let food2 = Food(id: "2", name: "Fries", description: "Crispy fries", price: 5.0, image: "img2")

        store.addItem(food1, quantity: 2) // 30.00
        store.addItem(food2, quantity: 1) // 5.00

        XCTAssertEqual(store.itemCount, 3)
        XCTAssertEqual(store.subtotal, 35.0)
        XCTAssertEqual(store.estimatedDeliveryFee, 3.99)
        XCTAssertEqual(store.estimatedTotal, 38.99)

        // Add 2 more burgers -> subtotal = 65.00 >= 50.00 -> free delivery!
        store.updateQuantity(for: "1", delta: 2)
        XCTAssertEqual(store.subtotal, 65.0)
        XCTAssertEqual(store.estimatedDeliveryFee, 0.0)
        XCTAssertEqual(store.estimatedTotal, 65.0)
    }

    func testOrderStatusProgress() {
        XCTAssertEqual(OrderStatus.pending.stepIndex, 0)
        XCTAssertEqual(OrderStatus.confirmed.stepIndex, 1)
        XCTAssertEqual(OrderStatus.preparing.stepIndex, 2)
        XCTAssertEqual(OrderStatus.ready.stepIndex, 3)
        XCTAssertEqual(OrderStatus.outForDelivery.stepIndex, 4)
        XCTAssertEqual(OrderStatus.delivered.stepIndex, 5)
        XCTAssertEqual(OrderStatus.cancelled.stepIndex, -1)
    }

    func testAPIEndpointPaths() {
        let categoriesEndpoint = APIEndpoint.getCategories
        XCTAssertEqual(categoriesEndpoint.path, "/categories")
        XCTAssertEqual(categoriesEndpoint.method, .get)

        let orderEndpoint = APIEndpoint.trackOrder(orderNumber: "FD-849201")
        XCTAssertEqual(orderEndpoint.path, "/orders/FD-849201")
        XCTAssertEqual(orderEndpoint.method, .get)
    }
}
