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

/**
 * Get the previous mode for a supplied mode.
 *
 * @param modeName
 * @returns {string}
 */
function getPreviousMode(modeName)
{
    switch (modeName)
    {
        case 'epic':
            return 'classic';
            break;
        case 'endless':
            return 'epic';
            break;
        default:
            throw {
                'code': 78501,
                'description': 'Mode ' + modeName + ' invalid.'
            };
    }
}

/**
 * Generate an array of {count} integers starting at {start}.
 * Credit: https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-an-array-based-on-suppl/19506234#19506234
 *
 * @param start
 * @param count
 * @returns {Array}
 */
function range(start, count) {
    return Array.apply(
        0,
        Array(count)
    ).map(
        function (element, index) {
            return index + start;
        }
    );
}