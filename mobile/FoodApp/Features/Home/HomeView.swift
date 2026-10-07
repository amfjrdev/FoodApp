import SwiftUI

public struct HomeView: View {
    @StateObject private var viewModel = HomeViewModel()
    @EnvironmentObject private var cartStore: CartStore
    @AppStorage("hasCompletedOnboarding") private var hasCompletedOnboarding: Bool = true
    @State private var selectedFood: Food? = nil
    @State private var showingDetail = false

    private let columns = [
        GridItem(.flexible(), spacing: 14),
        GridItem(.flexible(), spacing: 14),
    ]

    public var body: some View {
        NavigationStack {
            ZStack {
                AppTheme.background.ignoresSafeArea()

                ScrollView(.vertical, showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 20) {
                        // Top Location & Greeting Bar
                        HStack(alignment: .center) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("DELIVERING TO")
                                    .font(.system(size: 10, weight: .heavy))
                                    .foregroundColor(AppTheme.primary)
                                    .tracking(1)

                                HStack(spacing: 4) {
                                    Text("Current Location")
                                        .font(.system(size: 16, weight: .bold))
                                        .foregroundColor(AppTheme.textPrimary)
                                    Image(systemName: "chevron.down")
                                        .font(.system(size: 11, weight: .bold))
                                        .foregroundColor(AppTheme.primary)
                                }
                            }

                            Spacer()

                            HStack(spacing: 10) {
                                // Return to Starting/Welcome Page Button
                                Button(action: {
                                    #if os(iOS)
                                    let generator = UIImpactFeedbackGenerator(style: .medium)
                                    generator.impactOccurred()
                                    #endif
                                    withAnimation(.easeInOut(duration: 0.45)) {
                                        hasCompletedOnboarding = false
                                    }
                                }) {
                                    HStack(spacing: 5) {
                                        Image(systemName: "sparkles")
                                            .font(.system(size: 12, weight: .bold))
                                        Text("Intro")
                                            .font(.system(size: 12, weight: .bold))
                                    }
                                    .foregroundColor(AppTheme.primary)
                                    .padding(.horizontal, 11)
                                    .padding(.vertical, 8)
                                    .background(AppTheme.primaryLight)
                                    .clipShape(Capsule())
                                    .overlay(
                                        Capsule().stroke(AppTheme.primary.opacity(0.3), lineWidth: 1)
                                    )
                                }

                                // Cart Quick Indicator
                                NavigationLink(destination: CartView()) {
                                    ZStack(alignment: .topTrailing) {
                                        Circle()
                                            .fill(Color.white)
                                            .frame(width: 44, height: 44)
                                            .shadow(color: Color.black.opacity(0.06), radius: 8, x: 0, y: 2)

                                        Image(systemName: "bag.fill")
                                            .font(.system(size: 18))
                                            .foregroundColor(AppTheme.textPrimary)
                                            .frame(width: 44, height: 44)

                                        if cartStore.itemCount > 0 {
                                            Text("\(cartStore.itemCount)")
                                                .font(.system(size: 10, weight: .heavy))
                                                .foregroundColor(.white)
                                                .frame(width: 18, height: 18)
                                                .background(AppTheme.primary)
                                                .clipShape(Circle())
                                                .offset(x: 2, y: -2)
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal)
                        .padding(.top, 8)

                        // Hero Banner
                        FeaturedHeroView()
                            .padding(.horizontal)

                        // Categories Horizontal Scroll
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Explore Categories")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)
                                .padding(.horizontal)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    CategoryFilterChip(
                                        category: nil,
                                        isSelected: viewModel.selectedCategoryId == nil
                                    ) {
                                        Task {
                                            await viewModel.selectCategory(nil)
                                        }
                                    }

                                    ForEach(viewModel.categories) { category in
                                        CategoryFilterChip(
                                            category: category,
                                            isSelected: viewModel.selectedCategoryId == category.id
                                        ) {
                                            Task {
                                                await viewModel.selectCategory(category.id)
                                            }
                                        }
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }

                        // Popular Foods Section Header
                        HStack {
                            Text("Popular Dishes")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(AppTheme.textPrimary)

                            Spacer()

                            Text("\(viewModel.foods.count) items")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(AppTheme.textSecondary)
                        }
                        .padding(.horizontal)

                        // Food Grid / Loading / Empty State
                        if viewModel.isLoading && viewModel.foods.isEmpty {
                            ProgressView()
                                .frame(maxWidth: .infinity, minHeight: 200)
                        } else if viewModel.foods.isEmpty {
                            VStack(spacing: 12) {
                                EmptyStateView(
                                    icon: "fork.knife",
                                    title: "No Dishes Loaded",
                                    message: viewModel.errorMessage ?? "Tap below to fetch the latest gourmet dishes from the server."
                                )
                                Button(action: {
                                    Task {
                                        await viewModel.loadData()
                                    }
                                }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "arrow.clockwise")
                                        Text("Reload Dishes")
                                    }
                                    .font(.system(size: 14, weight: .bold))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 18)
                                    .padding(.vertical, 10)
                                    .background(AppTheme.primary)
                                    .clipShape(Capsule())
                                }
                            }
                            .frame(minHeight: 250)
                        } else {
                            LazyVGrid(columns: columns, spacing: 14) {
                                ForEach(viewModel.foods) { food in
                                    FoodCardView(food: food) {
                                        selectedFood = food
                                        showingDetail = true
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }

                        Spacer().frame(height: 30)
                    }
                }
                .refreshable {
                    await viewModel.loadData()
                }
            }
            .navigationDestination(isPresented: $showingDetail) {
                if let food = selectedFood {
                    FoodDetailView(food: food)
                }
            }
        }
        .task {
            await viewModel.loadData()
        }
        .onAppear {
            if viewModel.foods.isEmpty {
                Task {
                    await viewModel.loadData()
                }
            }
        }
    }
}
