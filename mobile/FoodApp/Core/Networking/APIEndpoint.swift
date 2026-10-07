import Foundation

public enum HTTPMethod: String, Sendable {
    case get = "GET"
    case post = "POST"
    case patch = "PATCH"
    case delete = "DELETE"
}

public enum APIEndpoint: Sendable {
    case getCategories
    case getFoods(categoryId: String?, search: String?, page: Int?, limit: Int?)
    case getFoodDetails(id: String)
    case createOrder(body: CreateOrderRequestBody)
    case trackOrder(orderNumber: String)

    public var path: String {
        switch self {
        case .getCategories:
            return "/categories"
        case .getFoods:
            return "/foods"
        case .getFoodDetails(let id):
            return "/foods/\(id)"
        case .createOrder:
            return "/orders"
        case .trackOrder(let orderNumber):
            return "/orders/\(orderNumber)"
        }
    }

    public var method: HTTPMethod {
        switch self {
        case .getCategories, .getFoods, .getFoodDetails, .trackOrder:
            return .get
        case .createOrder:
            return .post
        }
    }

    public var queryItems: [URLQueryItem]? {
        switch self {
        case .getFoods(let categoryId, let search, let page, let limit):
            var items: [URLQueryItem] = []
            if let cat = categoryId, !cat.isEmpty {
                items.append(URLQueryItem(name: "categoryId", value: cat))
            }
            if let q = search, !q.isEmpty {
                items.append(URLQueryItem(name: "search", value: q))
            }
            if let p = page {
                items.append(URLQueryItem(name: "page", value: String(p)))
            }
            if let l = limit {
                items.append(URLQueryItem(name: "limit", value: String(l)))
            }
            return items.isEmpty ? nil : items
        default:
            return nil
        }
    }

    public var body: Data? {
        switch self {
        case .createOrder(let requestBody):
            return try? JSONEncoder().encode(requestBody)
        default:
            return nil
        }
    }
}

public struct CreateOrderItemBody: Codable, Sendable {
    public let foodId: String
    public let quantity: Int

    public init(foodId: String, quantity: Int) {
        self.foodId = foodId
        self.quantity = quantity
    }
}

public struct CreateOrderRequestBody: Codable, Sendable {
    public let customerName: String
    public let customerPhone: String
    public let deliveryAddress: String
    public let notes: String?
    public let items: [CreateOrderItemBody]

    public init(
        customerName: String,
        customerPhone: String,
        deliveryAddress: String,
        notes: String? = nil,
        items: [CreateOrderItemBody]
    ) {
        self.customerName = customerName
        self.customerPhone = customerPhone
        self.deliveryAddress = deliveryAddress
        self.notes = notes
        self.items = items
    }
}
