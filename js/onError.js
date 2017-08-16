window.onerror = function (msg, url, lineNo, columnNo, error)
{
    let string = msg.toLowerCase();
    let substring = "script error";
    if (string.indexOf(substring) > -1)
    {
        alert('Script Error: See Browser Console for Detail');
    }
    else
    {
        let message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }
    return false;
};