import SwiftUI

public struct SearchView: View {
    @StateObject private var viewModel = SearchViewModel()
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

                VStack(spacing: 16) {
                    // Search Bar Header
                    HStack(spacing: 12) {
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(AppTheme.textMuted)

                            TextField("Search dishes, ingredients...", text: $viewModel.searchQuery)
                                .font(.system(size: 15))
                                .autocorrectionDisabled()
                                .onChange(of: viewModel.searchQuery) { _ in
                                    viewModel.performSearch()
                                }

                            if !viewModel.searchQuery.isEmpty {
                                Button(action: {
                                    viewModel.searchQuery = ""
                                    viewModel.performSearch()
                                }) {
                                    Image(systemName: "xmark.circle.fill")
                                        .foregroundColor(AppTheme.textMuted)
                                }
                            }
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 12)
                        .background(Color.white)
                        .clipShape(RoundedRectangle(cornerRadius: AppTheme.radiusMedium, style: .continuous))
                        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 2)
                    }
                    .padding(.horizontal)
                    .padding(.top, 8)

                    // Category Filter Chips
                    if !viewModel.categories.isEmpty {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 8) {
                                CategoryFilterChip(
                                    category: nil,
                                    isSelected: viewModel.selectedCategoryId == nil
                                ) {
                                    viewModel.selectedCategoryId = nil
                                    viewModel.performSearch()
                                }

                                ForEach(viewModel.categories) { category in
                                    CategoryFilterChip(
                                        category: category,
                                        isSelected: viewModel.selectedCategoryId == category.id
                                    ) {
                                        viewModel.selectedCategoryId = category.id
                                        viewModel.performSearch()
                                    }
                                }
                            }
                            .padding(.horizontal)
                        }
                    }

                    // Content State
                    if viewModel.isSearching && viewModel.searchResults.isEmpty {
                        ProgressView()
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    } else if viewModel.searchResults.isEmpty {
                        EmptyStateView(
                            icon: "magnifyingglass",
                            title: "No Results Found",
                            message: "We couldn't find any dishes matching '\(viewModel.searchQuery)'. Try another search."
                        )
                    } else {
                        ScrollView(.vertical, showsIndicators: false) {
                            LazyVGrid(columns: columns, spacing: 14) {
                                ForEach(viewModel.searchResults) { food in
                                    FoodCardView(food: food) {
                                        selectedFood = food
                                        showingDetail = true
                                    }
                                }
                            }
                            .padding(.horizontal)
                            .padding(.bottom, 24)
                        }
                    }
                }
            }
            .navigationTitle("Search Food")
            #if os(iOS)
            .navigationBarTitleDisplayMode(.inline)
            #endif
            .navigationDestination(isPresented: $showingDetail) {
                if let food = selectedFood {
                    FoodDetailView(food: food)
                }
            }
        }
        .task {
            await viewModel.loadCategories()
            viewModel.performSearch()
        }
    }
}
