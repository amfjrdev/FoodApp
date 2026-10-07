import Foundation
import SwiftUI
import Combine

@MainActor
public final class HomeViewModel: ObservableObject {
    @Published public var categories: [Category] = []
    @Published public var selectedCategoryId: String? = nil
    @Published public var foods: [Food] = []
    @Published public var isLoading: Bool = false
    @Published public var errorMessage: String? = nil

    private let apiClient: APIClient

    public init(apiClient: APIClient = .shared) {
        self.apiClient = apiClient
    }

    public func loadData() async {
        isLoading = true
        errorMessage = nil

        do {
            async let categoriesTask: [Category] = apiClient.request(.getCategories)
            async let foodsTask: [Food] = apiClient.request(
                .getFoods(categoryId: selectedCategoryId, search: nil, page: 1, limit: 50)
            )

            let (fetchedCategories, fetchedFoods) = try await (categoriesTask, foodsTask)
            self.categories = fetchedCategories
            self.foods = fetchedFoods
        } catch let error as APIError {
            self.errorMessage = error.errorDescription
        } catch {
            self.errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    public func selectCategory(_ categoryId: String?) async {
        selectedCategoryId = categoryId
        isLoading = true
        errorMessage = nil

        do {
            let fetchedFoods: [Food] = try await apiClient.request(
                .getFoods(categoryId: selectedCategoryId, search: nil, page: 1, limit: 50)
            )
            self.foods = fetchedFoods
        } catch let error as APIError {
            self.errorMessage = error.errorDescription
        } catch {
            self.errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}
