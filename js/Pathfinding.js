var Rendlesham = Rendlesham || {};

Rendlesham.Pathfinding = function (game, parent) {
    "use strict";
    Phaser.Plugin.call(this, game, parent);
    this.easy_star = new EasyStar.js();
};

Rendlesham.Pathfinding.prototype = Object.create(Phaser.Plugin.prototype);
Rendlesham.Pathfinding.prototype.constructor = Rendlesham.Pathfinding;

Rendlesham.Pathfinding.prototype.init = function (world_grid, acceptable_tiles, tile_dimensions) {
    "use strict";
    var grid_row, grid_column, grid_indices;
    this.grid_dimensions = {row: world_grid.length, column: world_grid[0].length};
    
    grid_indices = [];
    for (grid_row = 0; grid_row < world_grid.length; grid_row += 1) {
        grid_indices[grid_row] = [];
        for (grid_column = 0; grid_column < world_grid[grid_row].length; grid_column += 1) {
            grid_indices[grid_row][grid_column] = world_grid[grid_row][grid_column].index;
        }
    }

    this.easy_star.setGrid(grid_indices);
    this.easy_star.setAcceptableTiles(acceptable_tiles);
    // this.easy_star.enableDiagonals();

    this.tile_dimensions = tile_dimensions;
};

// additionalCostTiles argument added for Rendlesham
Rendlesham.Pathfinding.prototype.find_path = function (origin, target, callback, context, additionalCostTiles)
{
    var origin_coord, target_coord;

    origin_coord = this.get_coord_from_point(origin);
    target_coord = this.get_coord_from_point(target);

    if (additionalCostTiles) {
        var i;
        for (i = 0; i < additionalCostTiles.length; i++) {

            if (additionalCostTiles[i][2]) {
                this.easy_star.setAdditionalPointCost(additionalCostTiles[i][0], additionalCostTiles[i][1], additionalCostTiles[i][2])
            } else {
                this.easy_star.removeAdditionalPointCost(additionalCostTiles[i][0], additionalCostTiles[i][1]);
            }

        }
    }
    
    if (!this.outside_grid(origin_coord) && !this.outside_grid(target_coord)) {
        this.easy_star.findPath(origin_coord.column, origin_coord.row, target_coord.column, target_coord.row, this.call_callback_function.bind(this, callback, context));
        this.easy_star.calculate();
        return true;
    } else {
        return false;
    }
};

Rendlesham.Pathfinding.prototype.call_callback_function = function (callback, context, path) {
    "use strict";
    var path_positions;
    path_positions = [];
    if (path !== null) {
        path.forEach(function (path_coord) {
            path_positions.push(this.get_point_from_coord({row: path_coord.y, column: path_coord.x}));
        }, this);
    }
    callback.call(context, path_positions);
};

Rendlesham.Pathfinding.prototype.outside_grid = function (coord) {
    "use strict";
    return coord.row < 0 || coord.row > this.grid_dimensions.row - 1 || coord.column < 0 || coord.column > this.grid_dimensions.column - 1;
};

Rendlesham.Pathfinding.prototype.get_coord_from_point = function (point) {
    "use strict";
    var row, column;
    row = Math.floor(point.y / this.tile_dimensions.y);
    column = Math.floor(point.x / this.tile_dimensions.x);
    return {row: row, column: column};
};

Rendlesham.Pathfinding.prototype.get_point_from_coord = function (coord) {
    "use strict";
    var x, y;
    x = (coord.column * this.tile_dimensions.x) + (this.tile_dimensions.x / 2);
    y = (coord.row * this.tile_dimensions.y) + (this.tile_dimensions.y / 2);
    return new Phaser.Point(x, y);
};
