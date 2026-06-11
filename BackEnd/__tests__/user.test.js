/**
 * User Controller Tests
 */
import { jest } from "@jest/globals";

const mockUser = {
  findById: jest.fn(),
  findOne: jest.fn(),
};

const mockCard = {
  findOne: jest.fn(),
};

jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));
jest.unstable_mockModule("../models/cardModel.js", () => ({
  default: mockCard,
}));

const { getUserData, updateProfile } = await import(
  "../controllers/usersControllers.js"
);

function mockReqRes(body = {}, user = { _id: "user123" }) {
  return {
    req: { body, user },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("getUserData", () => {
  test("should return user data with card", async () => {
    const { req, res } = mockReqRes();
    const userDoc = {
      _id: "user123",
      name: "Test",
      email: "test@test.com",
      balance: 500,
      toObject: jest.fn().mockReturnValue({
        _id: "user123",
        name: "Test",
        email: "test@test.com",
        balance: 500,
      }),
    };
    const cardDoc = {
      balance: 200,
      cardNumber: "4000111122223333",
      cvv: "123",
      expiryDate: "06/29",
    };

    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(userDoc),
    });
    mockCard.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(cardDoc),
    });

    await getUserData(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        card: cardDoc,
      })
    );
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes();
    mockUser.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    await getUserData(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockUser.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await getUserData(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("updateProfile", () => {
  test("should update name successfully", async () => {
    const { req, res } = mockReqRes({ name: "New Name" });
    const userDoc = {
      _id: "user123",
      name: "Old Name",
      email: "test@test.com",
      save: jest.fn(),
    };
    mockUser.findById.mockResolvedValue(userDoc);

    await updateProfile(req, res);

    expect(userDoc.name).toBe("New Name");
    expect(userDoc.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Profile updated successfully",
      })
    );
  });

  test("should update email when not already taken", async () => {
    const { req, res } = mockReqRes({ email: "new@test.com" });
    const userDoc = {
      _id: "user123",
      name: "Test",
      email: "old@test.com",
      save: jest.fn(),
    };
    mockUser.findById.mockResolvedValue(userDoc);
    mockUser.findOne.mockResolvedValue(null); // no duplicate

    await updateProfile(req, res);

    expect(userDoc.email).toBe("new@test.com");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should return 400 if email already in use", async () => {
    const { req, res } = mockReqRes({ email: "taken@test.com" });
    const userDoc = {
      _id: "user123",
      name: "Test",
      email: "old@test.com",
      save: jest.fn(),
    };
    mockUser.findById.mockResolvedValue(userDoc);
    mockUser.findOne.mockResolvedValue({ _id: "other" }); // duplicate

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Email is already in use" })
    );
  });

  test("should return 404 if user not found", async () => {
    const { req, res } = mockReqRes({ name: "Test" });
    mockUser.findById.mockResolvedValue(null);

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should handle unexpected errors with 500", async () => {
    const { req, res } = mockReqRes({ name: "Test" });
    mockUser.findById.mockRejectedValue(new Error("DB error"));

    await updateProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
