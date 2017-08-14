class Achievements extends GameState
{
    create()
    {
        super.create();

        this.loadUser();

        $('#achievementsContent').html('');

        this.showDomElement('achievements');

        $('canvas').hide();

        $('#achievementsContent').append('<h3>Your High Scores</h3>');


        $('#achievementsContent').append('<table class="stats"><tr><th class="levelName">Level</th><th>Classic</th><th>Epic</th><th>Endless</th></tr></table>');
        
        let level;
        let classicHighScore;
        let epicHighScore;
        let endlessHighScore;

        for (let zoneName in ZONE_INFO)
        {
            if (ZONE_INFO.hasOwnProperty(zoneName))
            {
                $('#achievementsContent table').append('<tr><th class="zoneName" colspan="4">' + ZONE_INFO[zoneName].TITLE + '</th></tr>');
                
                for (let levelNumber in ZONE_INFO[zoneName].LEVEL_ORDERING)
                {
                    if (ZONE_INFO[zoneName].LEVEL_ORDERING.hasOwnProperty(levelNumber))
                    {
                        level = this.getLevelFromZoneAndNumber(zoneName, levelNumber);

                        if (this.user.levelHighScores.classic.hasOwnProperty(level.name))
                        {
                            classicHighScore = this.user.levelHighScores[level.name];
                        }
                        else
                        {
                            classicHighScore = '';
                        }

                        if (this.user.levelHighScores.epic.hasOwnProperty(level.name))
                        {
                            epicHighScore = this.user.levelHighScores[level.name];
                        }
                        else
                        {
                            epicHighScore = '';
                        }

                        if (this.user.levelHighScores.endless.hasOwnProperty(level.name))
                        {
                            endlessHighScore = this.user.levelHighScores[level.name];
                        }
                        else
                        {
                            endlessHighScore = '';
                        }

                        if (classicHighScore)
                        {
                            $('#achievementsContent table').append(
                                '<tr>' +
                                '<td class="levelName">Level ' + levelNumber + ' (' + level.title + '):</td>' +
                                '<td>' + classicHighScore + '</td>' +
                                '<td>' + epicHighScore + '</td>' +
                                '<td>' + endlessHighScore + '</td>' +
                                '</tr>'
                            );
                        }
                    }
                }        
            }
        }

        this.flashIntoState();
    }

    shutdown()
    {
        this.hideDomElement('achievements');
        $('canvas').show();
    }
}