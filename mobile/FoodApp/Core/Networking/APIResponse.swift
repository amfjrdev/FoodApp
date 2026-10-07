import Foundation

public struct APIPagination: Codable, Sendable {
    public let page: Int
    public let limit: Int
    public let total: Int
    public let totalPages: Int
}

public struct APIResponse<T: Decodable & Sendable>: Decodable, Sendable {
    public let success: Bool
    public let message: String?
    public let code: String?
    public let data: T?
    public let pagination: APIPagination?
    public let errors: [String: String]?
}
