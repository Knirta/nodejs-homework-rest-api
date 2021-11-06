const guard = require("../helpers/guard");
const passport = require("passport");
const { httpCode } = require("../config/constant");

describe("Unit test guard helper", () => {
  const user = { token: "111222333" };
  let req, res, next;

  beforeEach(() => {
    req = { get: jest.fn((header) => `Bearer ${user.token}`), user };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    };
    next = jest.fn();
  });

  it("User exists", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => cb(null, user)
    );
    await guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("User exists but has wrong token", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) =>
        cb(null, { token: "123456" })
    );
    await guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(httpCode.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalled();
  });

  it("User doesn't exist", async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => cb(null, false)
    );
    await guard(req, res, next);
    expect(req.get).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(httpCode.UNAUTHORIZED);
    expect(res.json).toHaveBeenCalled();
  });
});
