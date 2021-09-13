# 2-2. クリックで石を置こう　石を置く処理と例外処理

前回クリックしたマス座標を取得するところまで行ったので、後は楽勝です。
`draw_stone`を呼ぶだけですね。コールバック関数は外に定義して、色は一旦黒に固定です。

```
window.onload = function() {
    draw_board();
    board_element().addEventListener('click', on_board_click);
};

function on_board_click(event) {
    let cell_point = parse_cell_point({ x : event.offsetX, y : event.offsetY });
    draw_stone(cell_point, STONE.BLACK)
}
```
クリックしたところに黒石が置かれるようになりました。プログラムを書いてて最初に感動するポイントですね。

むしろこの記事では細かいことをグダグダやってきたせいでここの到着が遅れました。読んでくれた方はよくぞここまで来てくださいました。圧倒的感謝です。

## 色を交互にしてみる

さて感動覚めぬうちにもうちょっと手を加えましょう。今の手番の状態を変数turnにして持たせます。

毎回クリックされるたびに今のturnで石を置きつつ三項演算子で交互に色が変わるように判定させています。

```
let turn = STONE.BLACK;

function on_board_click(event) {
    let cell_point = parse_cell_point({ x : event.offsetX, y : event.offsetY });
    draw_stone(cell_point, turn);
    turn = turn === STONE.BLACK ? STONE.WHITE : STONE.BLACK;
}

```

## インプットとしての例外

次は石が置けるかどうかの判定をしましょう。といってもまだオセロの話ではありません。

先ほどまで「クリックした座標で動作する機能」を作っていました。クリックした座標はコールバックメソッドから見たらインプットになります。
このインプットはxとyが0～320までの数字が入ってくるはずですね？

勘のいい人は気が付いたかもしれません。そう320まで入るのです。320÷40＝8なのです。
これまで作ってるマス座標は0～7で取り扱っているのです。

そうでなかったとしても、offsetやらなんやらで、0からという基準が崩れたりしますので、インプットの段階で許可してはいけない範囲が当然出てきます。

今回は例外を使っていきます。例外というと致命的なエラーの時に出るやつかな？と思うかもしれませんが、別にそんなことなく気軽に使ってよいのです。
「想定している状態ではなければ例外を出す」くらいの感覚で問題ありません。

まずは有効な座標かどうかの判定から
```
// 有効な座標か判定します
// view_point = { x : int, y : int }
// return bool
function is_available_view_point(view_point) {
    let targets = [view_point.x - board_offset_x, view_point.y - board_offset_y];
    return targets.every(target => 0 <= target && target < board_size);
}
```
このメソッドの切り方が最初はあんまりできずに、`if (A && (B || C && D) )`のようにif文の中身がごちゃごちゃしてしまって条件が正しいかわからない事態とかよくあったのではないでしょうか。

こうやって条件判定で切り出しておけば、`if (is_available_view_point(view_point))`とメソッドを呼ぶだけになるので、あとはメソッド内の動作をテストしておくだけで無駄なハマりを防げます。

(今回はUnitテストを導入していないませんが、そういうメソッド単位でテストコードを書いていくと圧倒的にバグを潰せます。)

### 配列操作

さて、話はそれましたが上記のコードでちょっと小技があります。`every()`ってメソッドが出てきていますが、これは配列に備わっている標準のメソッドです。
配列自体を操作するメソッドが大体どの言語でも導入されていて、他にも`map` `filter` `some`などなど便利なメソッドがいっぱいあります。

これらのメソッドで何をしているかというと、配列の中身を順次取り出して変数に格納して（この場合は`target`）、次の処理をします」という感じになります。
つまり、直前で配列に詰めていたXの差分とYの差分をループして、`0 <= target && target < board_size`の結果を戻り値にしています。

そして`every`メソッドならば「全てのループでtrueが返ってきたらtrueとする」になります。これが`some`だったら「どれかのループで～」になります。

途中で出てくる`=> 0 <=`が顔文字っぽくなってて変ですが、最初の`=>`は比較演算子ではなくアロー演算子となります。これの左側が変数定義、右側が処理になります。

### 想定外の時は例外を投げておく

先ほどの判定を、座標変換のメソッド内で使ってみましょう。
こういう風に本来の処理をする前に、前提として扱える入力値かどうかをチェックして、ダメだったらそれ以降処理させない。処理させないのをはっきりわからせるために例外を投げておく。と、こういう書き方をしておくと書いた人の意図が伝わってきます。

今回は例外ですが、returnで終わる場合もあります。総じて早期リターンなどと言われたりしていて推奨される書き方です。
```
function parse_cell_point(view_point) {
    if (!is_available_view_point(view_point)) {
        throw new Error('無効な座標です。');
    }

    return {
        x : Math.floor((view_point.x - board_offset_x) / cell_size),
        y : Math.floor((view_point.y - board_offset_y) / cell_size)
    }
}
```

### 投げた例外はキャッチする

先ほど例外は気軽に投げていいなんて言いましたが、投げる以上はキャッチしてください。ダメだった時はどこでどうするのかを考えます。

クリックしたときに石を置く処理に行こうとしたが、座標が無効である例外が発生した場合は石を置くことは忘れて処理を終える。
と、しておきました。今回はエラーの種別までは判定せずログに出すだけです。
```
function on_board_click(event) {
    try {
        let cell_point = parse_cell_point({ x : event.offsetX, y : event.offsetY });
        draw_stone(cell_point, turn);
        turn = turn === STONE.BLACK ? STONE.WHITE : STONE.BLACK;
    } catch (error) {
        console.log(error.message);
    }
}
```

自分にも身に覚えがありますが、例外処理ってキャッチしたときに何するのが正解なのだろうって思うかもしれません。
当然例外の種類にもよるので確かに正解はないかもですが、「想定できる例外」が投げられるときは決めておきましょう。

今回は「置けないところクリックしてるから無視する」という確固たる意志でcatchの中身は何もしてません。
これが「アプリ続行不能な致命的なエラーになってしまった」ならば、「ユーザーが次に何すればいいかわかるようにメッセージを出す」などが良いかもしれません。「致命的なエラーが発生しました。ブラウザの更新ボタンを押してください。」とか。

- - -
前回とのコード差分

https://github.com/hajipong/othello_programme_study/compare/step2_1...step2_2
- - -

[＜前](https://github.com/hajipong/othello_programme_study/tree/step2_1)　
[次＞](https://github.com/hajipong/othello_programme_study/tree/step2_3)
