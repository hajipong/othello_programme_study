import { board_view, STONE } from "./board_view.js";

let turn = STONE.BLACK;

window.onload = function() {
    board_view.draw_board();
    board_view.set_click_listener(on_board_click);
};

// 盤をクリックしたイベントの時の処理
function on_board_click(event) {
    try {
        let cell_point = board_view.parse_cell_point({ x : event.offsetX, y : event.offsetY });
        put_stone(cell_point);
    } catch (error) {
        console.log(error.message);
    }
}

// 着手
function put_stone(cell_point) {
    board_view.draw_stone(cell_point, turn);
    turn = turn === STONE.BLACK ? STONE.WHITE : STONE.BLACK;
}
