const userModel = require("./../../models/User");
const { editValidator } = require("./profile.validator");

exports.getUserInfo = async (req, res, next) => {
  try {
    const user = req.user;
    user.password = undefined;
    return res.status(200).json({ user: user });
  } catch (err) {
    next(err);
  }
};

exports.editProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const userData = {};

    const { fullName, email, username, phone, cardNumber, shabaNumber } =
      req.body;

    await editValidator.validate(req.body);

    if (fullName) userData.fullName = fullName;
    if (email) userData.email = email;
    if (cardNumber) userData.cardNumber = cardNumber;
    if (shabaNumber) userData.shabaNumber = shabaNumber;
    userData.phone = phone;
    userData.username = username;

    const updateUser = await userModel
      .findOneAndUpdate(
        { _id: user._id },
        {
          $set: userData,
        },
        { new: true }
      )
      .select("-password");
    if (!updateUser) {
      return res.status(200).json({ message: "Profile Not Updated" });
    }
    return res.status(200).json({ user: updateUser });
  } catch (err) {
    next(err);
  }
};
