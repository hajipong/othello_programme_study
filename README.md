# 2-3. クリックで石を置こう　リファクタリング

オセロのロジックに行く前に、一度立ち止まってコードを整理します。

リファクタリングとは機能は変えずにコードを変えることを言います。機能追加と同時にリファクタするのはやめましょう。ただの自殺行為です。
新しい機能を追加する前にコードが気になったら、先にリファクタをしてしまいましょう。

しかしながら今回やることは、リファクタどころか大前提な部分に切り込んでいくので、初期構成的な感じになっちゃいます。

## MVCモデルのアプリ開発を意識しよう

少し勉強した方なら聞いたことがあるかもしれません。MVCモデルとはModel,View,Controllerに処理を分けていくスタイルです。
最近はフレームワークの充実に従いMVVMモデルなど様々な変化がありますが、ModelとViewを切り離すのは共通して言えることです。

この学習ではサーバサイドは特に作らないので厳密なMVCモデルをやっていくわけではないのですが、気分だけでも味わえるように無理やり分けていきたいと思います。
ですので実際にJavaScriptでこんな分け方をするのがスタンダードだとかではないところは注意です。

### MVCそれぞれどんな役割？

Viewはわかると思います。表示に関する部分です。Step1でやってきたことですね。

Modelはロジックに関する部分です。オセロのアプリを作ろうとしているので、これから作る「このマスに石を置けるか？」「ここ置いたときにどこが返るか？」などを考えていく部分ですね。

Controllerは橋渡しだったり、イベントの受付口だったりと言われてます。Step2で作ったクリックイベントの受付をし、Modelで処理をして、結果をViewに渡す。そう言った全体のコントロールをする役割です。

### どうやって分ける？

JavaScriptですのでちょっと無理やり感はありますが、一応クラス定義などができるようですので頑張ってオブジェクト指向な作りにしていこうと思います。

まずは全体からViewに関するところを別ファイルに切り出してみましょう。といっても、9割がViewのことしかやってないので、othello.jsに残ったのが
`window.onload`と`on_board_click`だけになりました。

切り取ったViewの部分はboard_view.jsとファイルを作成しました。board以外のViewが出てきたら名前困りますものね。

https://github.com/hajipong/othello_programme_study/blob/step2_3/board_view.js

切り取られた側をとりあえずControllerとしてそのまま残します。

https://github.com/hajipong/othello_programme_study/blob/step2_3/othello.js


やったこと
* ただのメソッドの集まりだったのを、BoardViewクラスにまとめた。
  * それぞれのメソッドが「BoardViewクラスの〇〇メソッド」という位置づけになる。
  * 外から見れるのはクラス定義ではなくオブジェクトにした。今のところオセロ盤は1枚だけ表示させるので最初に1個オブジェクト作ってそれを外から扱えるようにという意図です。
  ```
  // コントローラーから呼べるようにエクスポート
  export const board_view = new BoardView();
  ```
  (exportはJavaScriptで外からアクセスできるようになる定義です。指定していないものはimportできません。)
* constructorでSVGのエレメントを変数に持つようにした。
* クリックイベントの登録口を`set_click_listener`として用意した。
  * Controllerのお仕事であるクリックイベント時の処理ですが、盤をクリックしたときという仕掛けはViewにしかできないので、Controllerから問い合わせ先を受け取って、SVGタグに対して「あなたがクリックされたらControllerさんのこのメソッドに連絡して！」って伝言する感じになります。
* Controller側でクラスのオブジェクトと、手番を扱うため定数をimport
* Controller側でクリックイベントとしてのメソッドと、着手処理としてのメソッドを分離
* Controller側でonLoad時に初期描画とクリックイベントのリスナーを登録（リスナーって表現してるのはコールバックメソッドのこと。クリックしたときに動くやつみたいなときにリスナーって言われる）
* htmlに置いてたSVGタグに大きさべた書きのままだったので、View側で値を設定

やれなかったこと
* 定数がクラスの外側にあるのはJavaScriptの仕様。他の言語なら中に置きます。
* 外部から操作される意図がないものをprivateメソッドにできなかった。本来内部だけで使うメソッドと外から呼び出されるメソッドは分けるべきです。JavaScriptで無理やり表現できなくもないですが、余計読みにくくなるのでやめました。

困ったこと
* ファイルアクセスでは表示できなくなったのでローカル（自分のPC内）で見る時はWebサーバが必要になる

## index.htmlを開いただけではアプリが動かなくなります

えぇ、この困ったことは結構困ります。これまではindex.htmlをダブルクリックすればブラウザが立ち上がって表示されてましたよね。
しかし外部ファイルを↓のように読み込もうとするとエラーになります。
```
import { board_view, STONE } from "./board_view.js";
```

てことでWEBサーバとはなんぞやとか、この現象の原因には触れませんが、手っ取り早く解決方法を。

1. Chrome使ってください
1. このプラグイン入れてください。  https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb
1. 立ち上げたらミニウィンドウが出てくるので、フォルダ選択でindex.htmlがあるところを選択して、WebServer:Startedになるようスイッチを押してください。
1. URLが表示されるのでそこクリックしてください。

って感じでとりあえず動かせます。
- - -
前回とのコード差分

https://github.com/hajipong/othello_programme_study/compare/step2_2...step2_3
- - -

[＜前](https://github.com/hajipong/othello_programme_study/tree/step2_2)　
[次＞](https://github.com/hajipong/othello_programme_study/tree/step2_4)
