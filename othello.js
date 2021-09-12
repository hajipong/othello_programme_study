const cell_size = 40;
const board_offset_x = 0;
const board_offset_y = 0;

const board_size = cell_size * 8;
const board_left_x = board_offset_x;
const board_right_x = board_offset_x + board_size;
const board_top_y = board_offset_y;
const board_bottom_y = board_offset_y + board_size;

window.onload = function() {
    draw_board();
};

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
    document.querySelector('svg#board').appendChild(rect);
}

// 盤上の線の描画
function draw_board_line(x1, y1, x2, y2) {
    let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', 'black');
    document.querySelector('svg#board').appendChild(line);
}
