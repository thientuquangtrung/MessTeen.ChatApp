const { Types } = require("mongoose");

const convertToObjId = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object }) => {
    return _.pick(object, fields);
};

module.exports = {
    convertToObjId,
    getInfoData,
};
