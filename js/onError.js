window.onerror = function (message, url, lineNumber, columnNumber, error)
{
    let string = message.toLowerCase();
    let substring = "script error";
    if (string.indexOf(substring) > -1)
    {
        alert('Script Error: See Browser Console for Detail');
    }
    else
    {
        let output = [
            'Message: ' + message,
            'URL: ' + url,
            'Line: ' + lineNumber,
            'Column: ' + columnNumber,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        $.ajax({
            url: this.game.globals.apiUrl + 'api.php',
            method: 'POST',
            data: {
                action: 'javaScriptError',
                userGuid: this.user.guid,
                message,
                url,
                lineNumber,
                columnNumber,
                error: JSON.stringify(error)
            },
            dataType: 'jsonp'
        });

        alert(output);
    }
    return false;
};