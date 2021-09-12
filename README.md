# 1-2. 画面を作ろう　SVGの出力をJS側にする

固定部分はHTML側に書いても良いのですが、
盤の大きさなどの基準を管理したい場合、JS側で書き出す用にしておいた方が便利です。

ただ固定部分を書くにしても、プログラムっぽくループで書きつつ、
適度なリファクタもしましょう。

## ポイント１：決まった数字は定数にしよう
コードの各部分に決まっている数字を埋め込むのは、後で自分に跳ね返ってきます。
例えばマスの大きさをちょっと変えたい時に死にます。

座標系を扱う時は最初は使わなくてもオフセットの数字を用意しておくのもコツです。
```
const cell_size = 40;
const board_offset_x = 0;
const board_offset_y = 0;
```

## ポイント２：同じ値でも意味が違う定数は分けよう
盤の左端のX座標は、つまりはオフセットの値だな！と、コード内に`board_offset_x`とそのまま書くのではなく、
「盤の左端のX座標」という意味のある名前で定義付けましょう。

今後コードが複雑になっていく上で、こういう名前付けがバグを防いでくれます。
```
const board_size = cell_size * 8;
const board_left_x = board_offset_x;
const board_right_x = board_offset_x + board_size;
const board_top_y = board_offset_y;
const board_bottom_y = board_offset_y + board_size;
```

## ポイント３：メソッドの分け方は仕事の内容
大枠の仕事が決まってるからと、全ての処理を1メソッドで書いてしまう人も多いと思います。

しかしこういうところでコードの全体の複雑さが上がってしまいます。複雑さが上がると、他人はもちろん自分でも自分で書いたコードがわからなくなってしまいます。

ここでは「盤を描画する」のメソッドの中で背景と線の実際のタグを作成する部分を分離しました。

よく、メソッド分けの基準に「再利用する可能性があるから」と考えてる人もいますが（もちろんそれもありますが）、
`draw_board()`でやる仕事のうち「背景の描画」「線の描画」と明確に仕事内容を切り出せるものを分離して、本体は座標を決めてそれぞれを呼び出すに止まります。
```
// オセロ盤の土台部分を描画します。
function draw_board() {
...
// 背景部分の描画
function draw_board_background() {
...
// 盤上の線の描画
function draw_board_line(x1, y1, x2, y2) {
```
- - -
コード

https://github.com/hajipong/othello_programme_study/compare/step1...step1_2
- - -

[＜前](https://github.com/hajipong/othello_programme_study/tree/step1)　
[次＞](https://github.com/hajipong/othello_programme_study/tree/step1_3)
