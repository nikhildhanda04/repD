export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        user: req.user,
        session: {
          id: req.session.id,
          expiresAt: req.session.expiresAt,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};
