/**
 * Generate a quasi-random globally unique identifier.
 *
 * @returns {string}
 */
function guid()
{
    function s4()
    {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * Generate a random integer between two supplied min and max integers.
 *
 * @param {int} min
 * @param {int} max
 * @returns {int}
 */
function getRandomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convert the first character only of a string to upper-case.
 *
 * @param {string} inputString
 * @returns {string}
 */
function ucfirst(inputString)
{
    return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}
