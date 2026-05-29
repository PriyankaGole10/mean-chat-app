const User = require("./../models/user.model");
async function searchUsers(req, res) {
    try {
        const query = req.query.query;
        if (!query) {
            return res.json([]);
        }

        const users = await User.find({
            username: {
                $regex: query,
                $options: "i"
            },
            _id: {
                $ne: req.user._id
            }
        })
            .select("username avatar email")
            .limit(10);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json
            ({
                message: error.message
            })
    }
}


async function getAllUsers(req, res) {
    try {
        const users = await User.find({
            _id: { $ne: req.user.id }
        }).select('-password');

        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({
            message: 'Failed to fetch users'
        });
    }
}

module.exports = { searchUsers, getAllUsers };