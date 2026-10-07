import Foundation

public enum APIError: LocalizedError, Sendable {
    case invalidURL
    case invalidResponse
    case httpError(statusCode: Int, message: String, code: String?)
    case decodingError(String)
    case serverError(String)
    case networkUnavailable

    public var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Unable to construct a valid server URL."
        case .invalidResponse:
            return "Received an invalid or malformed response from the server."
        case .httpError(_, let message, _):
            return message
        case .decodingError(let details):
            return "Failed to parse data from server: \(details)"
        case .serverError(let message):
            return message
        case .networkUnavailable:
            return "Please check your internet connection and try again."
        }
    }
}
