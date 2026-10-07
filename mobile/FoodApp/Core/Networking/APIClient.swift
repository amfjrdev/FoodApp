import Foundation

public final class APIClient: Sendable {
    public static let shared = APIClient()

    // Configurable base URL: Defaults to localhost:5001 for iOS Simulator
    public let baseURLString: String

    private let session: URLSession

    public init(baseURLString: String = "http://localhost:5001/api/v1", session: URLSession = .shared) {
        self.baseURLString = baseURLString
        self.session = session
    }

    public func request<T: Decodable & Sendable>(_ endpoint: APIEndpoint) async throws -> T {
        guard var components = URLComponents(string: "\(baseURLString)\(endpoint.path)") else {
            throw APIError.invalidURL
        }

        if let queryItems = endpoint.queryItems {
            components.queryItems = queryItems
        }

        guard let url = components.url else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 15.0

        if let body = endpoint.body {
            request.httpBody = body
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw APIError.networkUnavailable
        }

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        // Handle error status codes
        guard (200...299).contains(httpResponse.statusCode) else {
            if let errorResponse = try? JSONDecoder().decode(APIResponse<EmptyData>.self, from: data) {
                throw APIError.httpError(
                    statusCode: httpResponse.statusCode,
                    message: errorResponse.message ?? "Server returned error",
                    code: errorResponse.code
                )
            }
            throw APIError.httpError(
                statusCode: httpResponse.statusCode,
                message: "Server error occurred (\(httpResponse.statusCode))",
                code: nil
            )
        }

        do {
            let decoded = try JSONDecoder().decode(APIResponse<T>.self, from: data)
            guard let payload = decoded.data else {
                throw APIError.decodingError("Empty payload received in successful response")
            }
            return payload
        } catch let decodingError as DecodingError {
            throw APIError.decodingError(decodingError.localizedDescription)
        } catch {
            throw APIError.serverError(error.localizedDescription)
        }
    }
}

public struct EmptyData: Codable, Sendable {}
