const basicDbFields = ['createdAt', 'updatedAt', 'isActive'];

const deleteObjPair = (object, deleteKeys) => {
  const newObject = { ...object };
  const allKeys = [...basicDbFields, ...deleteKeys];
  if (typeof newObject === 'object') {
    for (const key of allKeys) {
      // eslint-disable-next-line no-param-reassign
      if (newObject[key]) { delete newObject[key]; }
    }
  }
  return newObject;
};

module.exports = deleteObjPair;
