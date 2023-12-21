const { default: mongoose } = require('mongoose');
const roleModel = require('./app/models/roleModel')
const initial = async () => {
    try {
        const count = await roleModel.estimatedDocumentCount();

        if (count === 0) {
            await new roleModel({
                _id: new mongoose.Types.ObjectId(),
                name: 'user'
            }).save();

            await new roleModel({
                _id: new mongoose.Types.ObjectId(),
                name: 'admin'
            }).save();

            await new roleModel({
                _id: new mongoose.Types.ObjectId(),
                name: 'moderator'
            }).save();
        }
    } catch (error) {
        console.error("Init data error", error);
        process.exit();
    }
}

module.exports = {
    initial
}