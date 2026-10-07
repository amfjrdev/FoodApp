import SwiftUI

public struct ContentView: View {
    @EnvironmentObject private var cartStore: CartStore
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding: Bool = false
    @State private var selectedTab = 0

    public var body: some View {
        ZStack {
            if !hasCompletedOnboarding {
                OnboardingView {
                    withAnimation(.easeInOut(duration: 0.5)) {
                        hasCompletedOnboarding = true
                    }
                }
                .transition(.asymmetric(insertion: .opacity, removal: .move(edge: .leading).combined(with: .opacity)))
            } else {
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
                .transition(.asymmetric(insertion: .move(edge: .trailing).combined(with: .opacity), removal: .opacity))
            }
        }
    }
}
