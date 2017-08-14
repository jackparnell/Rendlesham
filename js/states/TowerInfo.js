class TowerInfo extends GameState
{
    create()
    {
        super.create();

        $('#towerInfoContent').html('');

        this.showDomElement('towerInfo');

        $('canvas').hide();

        $('.back').click(function() {
            game.state.states.towerInfo.goToTitleScreen();
        });

        let towers = [];
        let towerClassNames = this.getTowerClassNames();

        for (let i = 0; i < towerClassNames.length; i++)
        {
            let tower = new window[towerClassNames[i]](this.game);
            towers.push(tower);
        }

        for (let i = 0; i < towers.length; i++)
        {
            $('#towerInfoContent').append('<h3> ' + towers[i].constructor.name + '</h3>');
            $('#towerInfoContent').append('<p> ' + window[towerClassNames[i]].DESCRIPTION + '</p>');

            let tableId = towers[i].constructor.name + '_stats';

            $('#towerInfoContent').append('<table id="' + tableId + '" class="towers"></table>');

            $('#' + tableId).append('<tr><th>Grade</th><th>Sprite</th><th>Cost</th></tg><th>Damage Value</th><th>Fire Rate (ms)</th><th>Range</th></tr>');

            for (let j = 1; j <= 3; j++)
            {
                $('#' + tableId).append('<tr><td>' + towers[i].grade + '</td><td><div style="background-image: url(assets/sprites/towers/' + towers[i].constructor.name + '.png);" class="sprite grade' + towers[i].grade + '"></div></td><td>' + this.game.globals.currencyString + towers[i].getCostSoFar() + '</td><td>' + towers[i].bulletDamageValue + '</td><td>' + Math.round(towers[i].weapon1.fireRate) + '</td><td>' + towers[i].getRangeInTiles().toFixed(1) + '</td></tr>');
                towers[i].upgrade();
            }

        }

        this.flashIntoState();
    }

    shutdown()
    {
        this.hideDomElement('towerInfo');
        $('canvas').show();
    }
}