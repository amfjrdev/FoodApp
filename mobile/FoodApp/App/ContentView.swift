import SwiftUI

public struct ContentView: View {
    @EnvironmentObject private var cartStore: CartStore
    @State private var selectedTab = 0

    public var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "fork.knife")
                }
                .tag(0)

            SearchView()
                .tabItem {
                    Label("Search", systemImage: "magnifyingglass")
                }
                .tag(1)

            CartView()
                .tabItem {
                    Label("Cart", systemImage: "bag.fill")
                }
                .badge(cartStore.itemCount > 0 ? cartStore.itemCount : 0)
                .tag(2)

            OrderHistoryListView()
                .tabItem {
                    Label("My Orders", systemImage: "clock.fill")
                }
                .tag(3)
        }
        .tint(AppTheme.primary)
    }
}
