/**
 * Admin Controller Tests (login, register)
 */
import { jest } from "@jest/globals";

const mockAdmin = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockUser = {};

const mockJwt = {
  sign: jest.fn(() => "admin-token-xyz"),
};

jest.unstable_mockModule("../models/adminModel.js", () => ({
  default: mockAdmin,
}));
jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));
jest.unstable_mockModule("jsonwebtoken", () => ({
  default: mockJwt,
}));

const { loginAdmin, registerAdmin, generateToken } = await import(
  "../controllers/adminController.js"
);

function mockReqRes(body = {}) {
  return {
    req: { body },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("generateToken (admin)", () => {
  test("should return a JWT with admin role", () => {
    const token = generateToken("admin123");
    expect(mockJwt.sign).toHaveBeenCalledWith(
      { id: "admin123", role: "admin" },
      expect.any(String),
      { expiresIn: "30d" }
    );
    expect(token).toBe("admin-token-xyz");
  });
});

describe("loginAdmin", () => {
  test("should login admin successfully", async () => {
    const { req, res } = mockReqRes({
      email: "admin@test.com",
      password: "adminpass",
    });
    mockAdmin.findOne.mockResolvedValue({
      _id: "admin123",
      name: "Admin",
      email: "admin@test.com",
      matchPassword: jest.fn().mockResolvedValue(true),
    });

    await loginAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "admin123",
        name: "Admin",
        token: "admin-token-xyz",
      })
    );
  });

  test("should return 404 if admin not found", async () => {
    const { req, res } = mockReqRes({
      email: "nobody@test.com",
      password: "pass",
    });
    mockAdmin.findOne.mockResolvedValue(null);
    await loginAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should return 400 for wrong password", async () => {
    const { req, res } = mockReqRes({
      email: "admin@test.com",
      password: "wrong",
    });
    mockAdmin.findOne.mockResolvedValue({
      _id: "admin123",
      matchPassword: jest.fn().mockResolvedValue(false),
    });
    await loginAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should handle unexpected errors with 500", async () => {
    const { req, res } = mockReqRes({
      email: "admin@test.com",
      password: "pass",
    });
    mockAdmin.findOne.mockRejectedValue(new Error("DB error"));
    await loginAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("registerAdmin", () => {
  test("should register admin successfully", async () => {
    const { req, res } = mockReqRes({
      name: "New Admin",
      email: "new@admin.com",
      password: "adminpass",
    });
    mockAdmin.findOne.mockResolvedValue(null);
    mockAdmin.create.mockResolvedValue({
      _id: "admin456",
      name: "New Admin",
      email: "new@admin.com",
    });

    await registerAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        _id: "admin456",
        token: "admin-token-xyz",
      })
    );
  });

  test("should return 400 if fields are missing", async () => {
    const { req, res } = mockReqRes({ email: "a@b.com", password: "pass" });
    await registerAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
  });

  test("should return 400 if admin already exists", async () => {
    const { req, res } = mockReqRes({
      name: "Admin",
      email: "existing@admin.com",
      password: "pass",
    });
    mockAdmin.findOne.mockResolvedValue({ _id: "existing" });
    await registerAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Admin already exists",
    });
  });

  test("should handle unexpected errors with 500", async () => {
    const { req, res } = mockReqRes({
      name: "Admin",
      email: "a@b.com",
      password: "pass",
    });
    mockAdmin.findOne.mockRejectedValue(new Error("DB error"));
    await registerAdmin(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
