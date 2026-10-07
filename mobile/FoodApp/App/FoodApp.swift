import SwiftUI

@main
struct FoodApp: App {
    @StateObject private var cartStore = CartStore()
    @StateObject private var historyStore = OrderHistoryStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(cartStore)
                .environmentObject(historyStore)
        }
    }
}
