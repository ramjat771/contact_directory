export const filesToBody = (req, res, next) => {
  if (req.files) {
    Object.keys(req.files).forEach((key) => {
      const file = req.files[key]?.[0];

      if (file) {
        req.body[key] = file.path; // ✅ Cloudinary URL
      }
    });
  }

  next();
};
