const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const usersPath = path.join(__dirname, "../", "public", "avatars");

const uploadAvatarService = async (body) => {
  const { _id: id } = body.user;
  const { path: oldPath, originalname } = body.file;
  const filename = `${id}_${originalname}`;
  const newPath = path.join(usersPath, filename);
  await fs.rename(oldPath, newPath);

  (async function resize() {
    const image = await Jimp.read(newPath);
    image.resize(250, 250);
    await image.writeAsync(newPath);
  })();
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(id, { avatarURL });
  return avatarURL;
};
module.exports = { uploadAvatarService };
