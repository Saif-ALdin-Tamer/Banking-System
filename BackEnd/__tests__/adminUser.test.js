/**
 * Admin User Controller Tests
 */
import { jest } from "@jest/globals";

const mockUser = {
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));

const { getAllUsers, deleteUsers, updateUserBalance } = await import(
  "../controllers/adminUserController.js"
);

function mockReqRes(body = {}, params = {}) {
  return {
    req: { body, params },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("getAllUsers", () => {
  test("should return all users sorted by name", async () => {
    const { req, res } = mockReqRes();
    const users = [
      { _id: "1", name: "Alice", email: "a@test.com" },
      { _id: "2", name: "Bob", email: "b@test.com" },
    ];
    mockUser.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(users),
      }),
    });

    await getAllUsers(req, res);

    expect(res.json).toHaveBeenCalledWith(users);
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockUser.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      }),
    });

    await getAllUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("deleteUsers", () => {
  test("should delete user successfully", async () => {
    const { req, res } = mockReqRes({}, { id: "user123" });
    mockUser.findByIdAndDelete.mockResolvedValue({ _id: "user123" });

    await deleteUsers(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes({}, { id: "nonexistent" });
    mockUser.findByIdAndDelete.mockResolvedValue(null);

    await deleteUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes({}, { id: "user123" });
    mockUser.findByIdAndDelete.mockRejectedValue(new Error("DB error"));

    await deleteUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("updateUserBalance", () => {
  test("should update balance successfully", async () => {
    const { req, res } = mockReqRes({ balance: 1000 }, { id: "user123" });
    const userDoc = { _id: "user123", balance: 500, save: jest.fn() };
    mockUser.findById.mockResolvedValue(userDoc);

    await updateUserBalance(req, res);

    expect(userDoc.balance).toBe(1000);
    expect(userDoc.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 for invalid balance (negative)", async () => {
    const { req, res } = mockReqRes({ balance: -100 }, { id: "user123" });

    await updateUserBalance(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for NaN balance", async () => {
    const { req, res } = mockReqRes({ balance: "abc" }, { id: "user123" });

    await updateUserBalance(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes({ balance: 100 }, { id: "nonexistent" });
    mockUser.findById.mockResolvedValue(null);

    await updateUserBalance(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes({ balance: 100 }, { id: "user123" });
    mockUser.findById.mockRejectedValue(new Error("DB error"));

    await updateUserBalance(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
