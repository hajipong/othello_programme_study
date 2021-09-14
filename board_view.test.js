/**
 * @jest-environment jsdom
 */
import { board_view } from "./board_view.js";

describe('parse_cell_point', () => {
    test('2, 4', () => {
        expect(board_view.parse_stone_view_point({x : 2, y : 4})).toStrictEqual({ x : 200, y : 360 });
    });
});

describe('parse_cell_point', () => {
    test('122, 355', () => {
        expect(board_view.parse_cell_point({x : 122, y : 355})).toStrictEqual({ x : 1, y : 4 });
    });

    test('640, 355 to error', () => {
        expect(() => board_view.parse_cell_point({x : 640, y : 355})).toThrow('無効な座標です。');
    });
});
