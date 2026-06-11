/**
 * Notification Controller Tests
 */
import { jest } from "@jest/globals";

const mockNotification = {
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};

jest.unstable_mockModule("../models/notificationModel.js", () => ({
  default: mockNotification,
}));

const { getNotifications, markAsRead } = await import(
  "../controllers/notificationControllers.js"
);

function mockReqRes(body = {}, params = {}, user = { _id: "user123" }) {
  return {
    req: { body, params, user },
    res: {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    },
  };
}

beforeEach(() => jest.clearAllMocks());

describe("getNotifications", () => {
  test("should return notifications sorted by createdAt", async () => {
    const { req, res } = mockReqRes();
    const mockNotes = [
      { _id: "n1", title: "Deposit", message: "Deposited $100", read: false },
      { _id: "n2", title: "Transfer", message: "Received $50", read: true },
    ];
    mockNotification.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockNotes),
    });

    await getNotifications(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: mockNotes });
  });

  test("should return empty array when no notifications", async () => {
    const { req, res } = mockReqRes();
    mockNotification.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([]),
    });

    await getNotifications(req, res);

    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes();
    mockNotification.find.mockReturnValue({
      sort: jest.fn().mockRejectedValue(new Error("DB error")),
    });

    await getNotifications(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe("markAsRead", () => {
  test("should mark notification as read", async () => {
    const { req, res } = mockReqRes({}, { id: "notif123" });
    mockNotification.findByIdAndUpdate.mockResolvedValue({});

    await markAsRead(req, res);

    expect(mockNotification.findByIdAndUpdate).toHaveBeenCalledWith(
      "notif123",
      { read: true }
    );
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  test("should handle errors with 500", async () => {
    const { req, res } = mockReqRes({}, { id: "notif123" });
    mockNotification.findByIdAndUpdate.mockRejectedValue(new Error("DB error"));

    await markAsRead(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
