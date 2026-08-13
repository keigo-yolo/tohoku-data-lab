# 東北データラボ Webサイト V2

GitHub Pagesへそのままアップロードできる静的サイトです。

## V2で追加した機能

- 東北6県のクリック選択
- 指標タブ切替
- 6県比較棒グラフ
- 選択県のハイライト
- 公的統計の出典表示
- 一次資料へのリンク
- `data.js` にデータを分離し、更新を容易化
- PC / タブレット / スマートフォン対応
- 外部ライブラリ不要

## 実装済みの公的データ

### 人口
総務省統計局「令和7年国勢調査 人口速報集計」

- 2025年10月1日現在人口
- 2020年→2025年の人口増減率
- 2025年人口密度

一次資料:
https://www.stat.go.jp/data/kokusei/2025/kekka/pdf/outline.pdf

### 観光
東北運輸局／観光庁「宿泊旅行統計調査」

- 2025年1〜12月 外国人延べ宿泊者数
- 2024年同期比

一次資料:
https://wwwtb.mlit.go.jp/tohoku/content/000371363.pdf

※ 2025年宿泊値は各月の第2次速報値を累計したものです。

## ファイル構成

```text
tohoku-data-lab-v2/
├── index.html
├── styles.css
├── data.js
├── script.js
├── .nojekyll
├── 404.html
├── README.md
└── assets/
    ├── logo.svg
    ├── favicon.svg
    └── tohoku-outline.svg
```

## GitHub Pagesで公開

1. GitHubで新規リポジトリを作成
2. ZIPを展開し、中のファイルをリポジトリのルートへアップロード
3. `Settings` → `Pages`
4. `Build and deployment` の Source を `Deploy from a branch`
5. Branch を `main`
6. Folder を `/(root)`
7. `Save`

## 公開前の変更

### 1. 問い合わせメール
`index.html` の `YOUR-EMAIL@example.com` を実際の問い合わせ先へ変更してください。

### 2. ロゴ
`assets/logo.svg` はサイト用の仮ロゴです。
正式ロゴを同名ファイルで差し替えると、HTML側の変更なしで置き換えられます。

## データ更新方法

数値と出典情報はすべて `data.js` にあります。
新しい公表値が出た場合は、県別の値と `meta` の期間・説明・URLを更新してください。

## 次の拡張候補

- 令和6年経済センサス-基礎調査による事業所・従業者データ追加
- 市町村レベルの地図・指標
- CSV / JSONからの読込
- GitHub Actionsによるデータ更新
- INSIGHTS記事ページ
- 問い合わせフォーム連携


## 地図形状について（V3）

トップページおよび `DATA TOHOKU` の東北6県地図は、
Geolonia `japanese-prefectures` の SVG 日本地図から
青森・岩手・宮城・秋田・山形・福島の6県形状を抽出し、
東北データラボのデザインに合わせて加工しています。

Source:
https://github.com/geolonia/japanese-prefectures

Geolonia の README では、当該SVGは Wikipedia「日本地図.svg」をベースとし、
GFDL とされています。公開・再配布時は元データのライセンス条件も確認してください。
