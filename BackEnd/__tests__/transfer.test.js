/**
 * Transfer Controller Tests
 */
import { jest } from "@jest/globals";

const mockUser = {
  findById: jest.fn(),
  findOne: jest.fn(),
};

const mockTransaction = {
  create: jest.fn(),
};

const mockNotification = {
  create: jest.fn(),
};

jest.unstable_mockModule("../models/usersModel.js", () => ({
  default: mockUser,
}));
jest.unstable_mockModule("../models/transactionModel.js", () => ({
  default: mockTransaction,
}));
jest.unstable_mockModule("../models/notificationModel.js", () => ({
  default: mockNotification,
}));

const { transfer } = await import("../controllers/transferControllers.js");

function mockReqRes(body = {}, user = { _id: "sender123" }) {
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

describe("transfer", () => {
  test("should transfer successfully", async () => {
    const { req, res } = mockReqRes({
      receiveEmail: "receiver@test.com",
      amount: 100,
    });

    const sender = {
      _id: "sender123",
      email: "sender@test.com",
      name: "Sender",
      balance: 500,
      save: jest.fn(),
    };
    const receiver = {
      _id: "receiver123",
      email: "receiver@test.com",
      name: "Receiver",
      balance: 200,
      save: jest.fn(),
    };

    mockUser.findById.mockResolvedValue(sender);
    mockUser.findOne.mockResolvedValue(receiver);
    mockTransaction.create.mockResolvedValue({});
    mockNotification.create.mockResolvedValue({});

    await transfer(req, res);

    expect(sender.balance).toBe(400);
    expect(receiver.balance).toBe(300);
    expect(sender.save).toHaveBeenCalled();
    expect(receiver.save).toHaveBeenCalled();
    expect(mockTransaction.create).toHaveBeenCalled();
    expect(mockNotification.create).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Transfer completed successfully",
      })
    );
  });

  test("should return 400 for invalid amount", async () => {
    const { req, res } = mockReqRes({
      receiveEmail: "r@test.com",
      amount: -10,
    });
    await transfer(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 400 for zero amount", async () => {
    const { req, res } = mockReqRes({
      receiveEmail: "r@test.com",
      amount: 0,
    });
    await transfer(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if sender not found", async () => {
    const { req, res } = mockReqRes({
      receiveEmail: "r@test.com",
      amount: 100,
    });
    mockUser.findById.mockResolvedValue(null);
    await transfer(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should return 400 for insufficient balance", async () => {
    const { req, res } = mockReqRes({
      receiveEmail: "r@test.com",
      amount: 1000,
    });
    mockUser.findById.mockResolvedValue({
      _id: "sender123",
      email: "s@test.com",
      balance: 100,
      save: jest.fn(),
    });
    await transfer(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should return 404 if receiver not found", async () => {
    const { req, res } = mockReqRes({
      receiveEmail: "nobody@test.com",
      amount: 100,
    });
    mockUser.findById.mockResolvedValue({
      _id: "sender123",
      email: "s@test.com",
      balance: 500,
      save: jest.fn(),
    });
    mockUser.findOne.mockResolvedValue(null);
    await transfer(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test("should return 400 when transferring to yourself", async () => {
    const { req, res } = mockReqRes({
      receiveEmail: "sender@test.com",
      amount: 100,
    });
    const sender = {
      _id: "sender123",
      email: "sender@test.com",
      balance: 500,
      save: jest.fn(),
    };
    mockUser.findById.mockResolvedValue(sender);
    mockUser.findOne.mockResolvedValue(sender);
    await transfer(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "You cannot transfer money to yourself",
      })
    );
  });
});
