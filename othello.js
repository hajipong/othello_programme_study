const cell_size = 40;
const board_offset_x = 0;
const board_offset_y = 0;

const board_size = cell_size * 8;
const board_left_x = board_offset_x;
const board_right_x = board_offset_x + board_size;
const board_top_y = board_offset_y;
const board_bottom_y = board_offset_y + board_size;
const stone_radius = (cell_size / 2) * (8 / 10); // マスの80%

const STONE = {
    BLACK : { color : '#000' },
    WHITE : { color : '#FFF' }
};

window.onload = function() {
    draw_board();
    board_element().addEventListener('click', function(e){
        console.log('x : ' + e.offsetX + '  y : ' + e.offsetY);
        let cell_point = parse_cell_point({ x : e.offsetX, y : e.offsetY });
        console.log('cell_x : ' + cell_point.x + '  cell_y : ' + cell_point.y);
    });
};

// マス座標を石描画座標に変換します。
// cell_point = { x : 0..7, y : 0..7 }
// return { x : int, y : int }
function parse_stone_view_point(cell_point) {
    let cell_offset = cell_size / 2;
    return {
        x : board_offset_x + cell_point.x * cell_size + cell_offset,
        y : board_offset_x + cell_point.y * cell_size + cell_offset
    }
}

// 画面座標からマス座標に変換します。
// view_point = { x : int, y : int }
// return { x : 0..7, y : 0..7 }
function parse_cell_point(view_point) {
    return {
        x : Math.floor((view_point.x - board_offset_x) / cell_size),
        y : Math.floor((view_point.y - board_offset_y) / cell_size)
    }
}

// 石を描画します。
// cell_point = { x : 0..7, y : 0..7 }
// stone = STONE.BLACK or STONE.WHITE
function draw_stone(cell_point, stone) {
    let view_point = parse_stone_view_point(cell_point);
    let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', view_point.x);
    circle.setAttribute('cy', view_point.y);
    circle.setAttribute('r', stone_radius);
    circle.setAttribute('fill', stone.color);
    board_element().appendChild(circle);
}

// オセロ盤の土台部分を描画します。
function draw_board() {
    draw_board_background();
    for (let i = 1; i < 8; i++) {
        let y = board_top_y + i * cell_size;
        draw_board_line(board_left_x, y, board_right_x, y);
    }
    for (let i = 1; i < 8; i++) {
        let x = board_left_x + i * cell_size;
        draw_board_line(x, board_top_y, x, board_bottom_y);
    }
}

// 背景部分の描画
function draw_board_background() {
    let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', board_left_x);
    rect.setAttribute('y', board_top_y);
    rect.setAttribute('width', board_size);
    rect.setAttribute('height', board_size);
    rect.setAttribute('fill', 'green');
    board_element().appendChild(rect);
}

// 盤上の線の描画
function draw_board_line(x1, y1, x2, y2) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'black');
    board_element().appendChild(line);
}

function board_element() {
    return document.querySelector('svg#board');
}