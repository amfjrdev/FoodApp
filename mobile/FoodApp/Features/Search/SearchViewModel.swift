import Foundation
import SwiftUI
import Combine

@MainActor
public final class SearchViewModel: ObservableObject {
    @Published public var searchQuery: String = ""
    @Published public var selectedCategoryId: String? = nil
    @Published public var categories: [Category] = []
    @Published public var searchResults: [Food] = []
    @Published public var isSearching: Bool = false
    @Published public var errorMessage: String? = nil

    private let apiClient: APIClient
    private var searchTask: Task<Void, Never>? = nil

    public init(apiClient: APIClient = .shared) {
        self.apiClient = apiClient
    }

    public func loadCategories() async {
        do {
            self.categories = try await apiClient.request(.getCategories)
        } catch {
            // Non-critical
        }
    }

    public func performSearch() {
        searchTask?.cancel()

        searchTask = Task {
            // Debounce delay
            try? await Task.sleep(nanoseconds: 300_000_000)
            if Task.isCancelled { return }

            isSearching = true
            errorMessage = nil

            do {
                let foods: [Food] = try await apiClient.request(
                    .getFoods(
                        categoryId: selectedCategoryId,
                        search: searchQuery.trimmingCharacters(in: .whitespacesAndNewlines),
                        page: 1,
                        limit: 40
                    )
                )
                if !Task.isCancelled {
                    self.searchResults = foods
                }
            } catch let error as APIError {
                if !Task.isCancelled {
                    self.errorMessage = error.errorDescription
                }
            } catch {
                if !Task.isCancelled {
                    self.errorMessage = error.localizedDescription
                }
            }

            isSearching = false
        }
    }
}
