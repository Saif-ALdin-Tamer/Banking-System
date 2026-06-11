/**
 * Auth Controllers Tests
 * Tests for register and login functionality
 */
import { jest } from "@jest/globals";

// Mock dependencies before importing controllers
const mockUser = {
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};

const mockJwt = {
  sign: jest.fn(() => "mock-token-123"),
  verify: jest.fn(),
};

jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockJwt,
}));

const { register, login, generateToken } = await import(
  "../controllers/authControllers.js"
);

// Helper to create mock req/res
function mockReqRes(body = {}, params = {}, user = null) {
  return {
    req: { body, params, user, headers: {} },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("generateToken", () => {
  test("should return a JWT token", () => {
    const token = generateToken("user123");
    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: "user123" },
      expect.any(String),
      { expiresIn: "5d" }
    );
    expect(token).toBe("mock-token-123");
  });
});

describe("register", () => {
  test("should register a new user successfully", async () => {
    const { req, res } = mockReqRes({
      name: "Test User",
      email: "test@test.com",
      password: "password123",
    });

    mockUser.findOne.mockResolvedValue(null);
    mockUser.create.mockResolvedValue({
      _id: "user123",
      name: "Test User",
      email: "test@test.com",
    });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "user123",
        name: "Test User",
        email: "test@test.com",
        token: "mock-token-123",
      })
    );
  });

  test("should return 400 if user already exists", async () => {
    const { req, res } = mockReqRes({
      name: "Test",
      email: "existing@test.com",
      password: "pass",
    });

    mockUser.findOne.mockResolvedValue({ _id: "existing" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists",
    });
  });

  test("should return 400 if User.create returns falsy", async () => {
    const { req, res } = mockReqRes({
      name: "Test",
      email: "test@test.com",
      password: "pass",
    });

    mockUser.findOne.mockResolvedValue(null);
    mockUser.create.mockResolvedValue(null);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid user data" });
  });

  test("should handle ValidationError", async () => {
    const { req, res } = mockReqRes({
      name: "",
      email: "test@test.com",
      password: "pass",
    });

    const validationError = new Error("Validation failed");
    validationError.name = "ValidationError";
    validationError.errors = {
      name: { message: "Name is required" },
    };
    mockUser.findOne.mockRejectedValue(validationError);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Request invalid");
  });

  test("should handle unexpected errors with 500", async () => {
    const { req, res } = mockReqRes({
      name: "Test",
      email: "test@test.com",
      password: "pass",
    });

    mockUser.findOne.mockRejectedValue(new Error("DB connection failed"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Registration failed. Please try again.",
    });
  });
});

describe("login", () => {
  test("should login successfully with correct credentials", async () => {
    const { req, res } = mockReqRes({
      email: "test@test.com",
      password: "password123",
    });

    mockUser.findOne.mockResolvedValue({
      _id: "user123",
      id: "user123",
      name: "Test User",
      email: "test@test.com",
      matchPassword: jest.fn().mockResolvedValue(true),
    });

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "user123",
        name: "Test User",
        email: "test@test.com",
        token: "mock-token-123",
      })
    );
  });

  test("should return 401 for wrong password", async () => {
    const { req, res } = mockReqRes({
      email: "test@test.com",
      password: "wrongpass",
    });

    mockUser.findOne.mockResolvedValue({
      _id: "user123",
      matchPassword: jest.fn().mockResolvedValue(false),
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Wrong data entered",
    });
  });

  test("should return 401 for non-existent user", async () => {
    const { req, res } = mockReqRes({
      email: "nonexistent@test.com",
      password: "pass",
    });

    mockUser.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should handle unexpected errors with 500", async () => {
    const { req, res } = mockReqRes({
      email: "test@test.com",
      password: "pass",
    });

    mockUser.findOne.mockRejectedValue(new Error("DB error"));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
