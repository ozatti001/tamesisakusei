# StageLink (static site)

静的サイト + 端末内保存（localStorage）で「保存した事務所」を実現しています。
実在企業名・ロゴ・権利不明の写真は使用しません（サンプルデータのみ）。

## ローカルで確認
ブラウザによっては `type="module"` の読み込み制限があるため、簡易サーバー推奨です。

Python:
python -m http.server 8000
→ http://localhost:8000/

## GitHub Pages 公開
1. GitHub に新規リポジトリ作成（例: stagelink）
2. このフォルダの中身をリポジトリ直下にアップロード（index.html が直下）
3. GitHub の Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
4. 表示された URL で公開されます
