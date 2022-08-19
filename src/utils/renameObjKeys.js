// https://stackoverflow.com/questions/4647817/javascript-object-rename-key

/**
 *
 * @param {Object} obj - { key1 : val1, key2 : val2 }
 * @param {Object} newKeys [{key1:keys1}, {key2:keys2}]
 * @returns {Object} New object with changed keys
 */
function renameObjKeys(obj, newKeys) {
  if (Array.isArray(obj)) {
    return obj.map((result) => renameObjKeys(result, newKeys));
  }
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });

  return Object.assign({}, ...keyValues);
}

module.exports = renameObjKeys;
