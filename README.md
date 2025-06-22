# 🏆 できたよ！メダル

子ども向けタスク管理・ご褒美アプリです。日常のタスクを達成するたびにメダルを集めて、お子さんのやる気を引き出します。

![アプリのスクリーンショット](./screenshot.png)

## ✨ 特徴

- 📱 **PWA対応**: スマホアプリのように使える
- 🏆 **メダル収集**: タスク達成でメダルをゲット
- 🎯 **カスタマイズ可能**: タスクと目標を自由に設定
- 📊 **進捗可視化**: やった回数と残り回数を表示
- 🎉 **楽しい演出**: メダル獲得時のアニメーション
- 💾 **オフライン対応**: インターネットなしでも動作
- 📅 **履歴管理**: いつメダルを獲得したかを記録

## 🚀 デモ

[**▶️ アプリを試してみる**](https://eishisaito.github.io/dekita-for-web/)

## 📱 インストール方法

### スマートフォン
1. 上記のデモリンクをタップ
2. 「インストール」バナーをタップ
3. ホーム画面にアイコンが追加されます

### PC（Chrome/Edge）
1. デモリンクをクリック
2. アドレスバーの「インストール」アイコンをクリック
3. デスクトップアプリとして利用可能

## 🎯 使い方

### 基本操作
1. **メダル獲得**: 各タスクの「できた！」ボタンをタップ
2. **履歴確認**: タスクをタップして獲得したメダルを表示
3. **設定**: 下部の「せってい」でタスクの追加・編集

### カスタマイズ
- **新しいタスク追加**: 宿題、楽器練習など自由に設定
- **目標設定**: 1〜100回まで設定可能
- **メダル削除**: 不要なメダルの個別削除も可能

## 🛠️ 技術仕様

- **フロントエンド**: HTML5, CSS3, Vanilla JavaScript
- **PWA**: Service Worker, Web App Manifest
- **ストレージ**: localStorage（完全オフライン）
- **レスポンシブ**: モバイルファースト設計
- **アクセシビリティ**: 子ども向けUI/UX

## 📁 ファイル構成

```
dekita-for-web/
├── index.html          # メインアプリ
├── styles.css          # スタイルシート
├── script.js           # JavaScript機能
├── manifest.json       # PWAマニフェスト
├── sw.js              # Service Worker
├── icon-192.png       # アプリアイコン (192x192)
├── icon-512.png       # アプリアイコン (512x512)
├── screenshot.png     # アプリスクリーンショット
└── README.md          # このファイル
```

## 🔧 開発・カスタマイズ

### ローカル開発
```bash
# リポジトリをクローン
git clone https://github.com/eishisaito/dekita-for-web.git
cd dekita-for-web

# HTTPSサーバーで起動（PWA機能のため）
python -m http.server 8000
# または
npx serve .

# ブラウザで http://localhost:8000 を開く
```

### GitHub Pages でのデプロイ
1. GitHub リポジトリの Settings → Pages
2. Source を「Deploy from a branch」に設定
3. Branch を「main」に設定
4. 数分後に `https://eishisaito.github.io/dekita-for-web/` でアクセス可能

## 🎨 カスタマイズ例

### 色のカスタマイズ
```css
:root {
    --primary-orange: #FF6B47;  /* メインカラー */
    --primary-yellow: #FFD700;  /* アクセントカラー */
    --background-gray: #F5F5F5; /* 背景色 */
}
```

### 新しいアイコンの追加
```javascript
// script.js のデフォルトメダル設定
const defaultMedals = [
    { id: 7, name: 'うんどう', icon: '🏃', goal: 1, current: 0, dates: [] },
    // お好みで追加
];
```

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。

## 🙏 謝辞

- 子どもたちの日常をより楽しくするために
- 親御さんの子育てサポートのために
- オープンソースコミュニティの皆様に感謝

---

⭐ 気に入ったらスターをお願いします！

📝 バグ報告や機能要望は [Issues](https://github.com/eishisaito/dekita-for-web/issues) まで
