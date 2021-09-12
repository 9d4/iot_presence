/**
 * 
 * @param {Object} req the req object from request
 * @param {Array} keys Keys that wanted to be exist in the object
 * @param {null} callback injection to the req object 
 * @description if one of the keys does not exist, then return false
 */
module.exports = function checkRequirements(req, keys, injectFuntion = null) {

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (!req.body.hasOwnProperty(key))
            return false
    }

    if (injectFuntion) {
        injectFuntion(req)
        return true
    } else {
        return true
    }
}
