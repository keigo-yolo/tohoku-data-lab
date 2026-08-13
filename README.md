# 東北データラボ Webサイト

GitHub Pages にそのまま公開できる、静的HTML/CSS/JavaScript構成です。

## ファイル構成

```text
tohoku-data-lab/
├── index.html
├── styles.css
├── script.js
├── .nojekyll
├── 404.html
├── README.md
└── assets/
    ├── favicon.svg
    ├── logo.svg
    └── tohoku-outline.svg
```

## GitHub Pagesで公開する方法

1. GitHubで新しいリポジトリを作成します。
2. このフォルダ内のファイルを、リポジトリのルートへアップロードします。
3. GitHubリポジトリの `Settings` → `Pages` を開きます。
4. `Build and deployment` の Source で `Deploy from a branch` を選択します。
5. Branch を `main`、Folder を `/(root)` に設定して保存します。
6. 公開URLが表示されたら完了です。

## 公開前に必ず変更する箇所

### 1. お問い合わせメール
`index.html` 内を検索して、以下を実際のメールアドレスへ変更してください。

```html
YOUR-EMAIL@example.com
```

### 2. ロゴ
現在の `assets/logo.svg` は、このサイト用に作成した仮ロゴです。
正式な東北データラボのロゴがある場合は、同じファイル名 `logo.svg` で差し替えるとレイアウトを維持できます。

### 3. DATA TOHOKUの統計値
現在はデザイン確認用のデモ表示です。
具体的な人口・雇用・産業データを掲載する際は、総務省統計局・e-Stat・RESAS等の最新一次情報を確認し、出典を明記してください。

## 技術仕様

- HTML5
- CSS3
- Vanilla JavaScript
- 外部ライブラリなし
- GitHub Pages対応
- PC / Tablet / Smartphone レスポンシブ対応
- prefers-reduced-motion対応

## ローカルで確認する方法

ファイルを直接開いても基本的に表示できます。
簡易HTTPサーバーを使う場合:

```bash
python3 -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。
