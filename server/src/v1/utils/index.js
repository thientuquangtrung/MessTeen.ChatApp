const { Types } = require('mongoose');
const _ = require('lodash');

const convertToObjId = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object }) => {
    return _.pick(object, fields);
};

const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

module.exports = {
    convertToObjId,
    getInfoData,
    escapeRegExp,
};
