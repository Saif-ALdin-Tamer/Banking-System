/**
 * Auth Middleware Tests
 */
import { jest } from "@jest/globals";

const mockJwt = {
  verify: jest.fn(),
};

const mockUser = {
  findById: jest.fn(),
};

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockJwt,
}));
jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));

const { protect } = await import("../middleware/authMiddleware.js");

function mockReqRes(authHeader = null) {
  return {
    req: {
      headers: {
        authorization: authHeader,
      },
      user: null,
    },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
    next: jest.fn(),
  };
}

beforeEach(() => jest.clearAllMocks());

describe("protect middleware", () => {
  test("should call next() with valid token", async () => {
    const { req, res, next } = mockReqRes("Bearer valid-token-123");
    mockJwt.verify.mockReturnValue({ id: "user123" });
    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: "user123",
        name: "Test",
        email: "test@test.com",
      }),
    });

    await protect(req, res, next);

    expect(mockJwt.verify).toHaveBeenCalledWith("valid-token-123", expect.any(String));
    expect(req.user).toEqual(
      expect.objectContaining({ _id: "user123" })
    );
    expect(next).toHaveBeenCalled();
  });

  test("should return 401 if no authorization header", async () => {
    const { req, res, next } = mockReqRes();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Not authorized, no token provided",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is invalid", async () => {
    const { req, res, next } = mockReqRes("Bearer invalid-token");
    mockJwt.verify.mockImplementation(() => {
      throw new Error("jwt malformed");
    });

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: "Not authorized, token failed",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if authorization header doesn't start with Bearer", async () => {
    const { req, res, next } = mockReqRes("Basic some-token");

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
