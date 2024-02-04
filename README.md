# SoftTennisAceReview
## アプリケーション概要
ソフトテニスラケットのレビューを他の競技者と共有できるWebアプリケーションです。
### 目指した課題解決
ラケット選びの判断材料を増やすという競技者のニーズを満たすことと、ソフトテニス業界の繁栄に協力することを目指しました。

### URL
https://www.softtennis-ace-review.com
### テスト用アカウント
- メールアドレス/t1@t1.com
- パスワード/test1pass


# 主な機能
### ・ホーム画面(ログイン前、ログイン後)
<div style="display: flex; flex-wrap: wrap;">
  <img style="width: 45%; margin: 1%;" alt="ホーム画面(ログイン前)" 
    src="https://github.com/Sho-Kawa0501/SoftTennisAceReview/assets/120151638/341f12cb-6187-4e3c-8873-5addc16968f0">
  <img style="width: 45%; margin: 1%;"alt="ホーム画面(ログイン後)" 
    src="https://github.com/Sho-Kawa0501/SoftTennisAceReview/assets/120151638/9f382198-d53d-488e-8650-5865b0cb9725">  
</div>

### ・レビュー投稿機能(レビュー未投稿時の画面)
<div style="display: flex; flex-wrap: wrap;">
 <img style="width: 45%; margin: 1%;" alt="ホーム画面(ログイン前)" 
  src="https://github.com/Sho-Kawa0501/shopping-site-json/assets/120151638/5a06c854-e16d-4685-a3f5-2ca2251a2d89">
 <img style="width: 45%; margin: 1%;" alt="ホーム画面(ログイン前)" 
  src="https://github.com/Sho-Kawa0501/shopping-site-json/assets/120151638/483604c7-ecdd-4d36-80b4-00d14ebfdf3e">
</div>

### ・レビュー投稿機能(レビュー投稿済みの画面)
<div style="display: flex; flex-wrap: wrap;">
 <img style="width: 45%; margin: 1%;" alt="ホーム画面(ログイン前)" 
  src="https://github.com/Sho-Kawa0501/shopping-site-json/assets/120151638/830a69d5-af92-4fcb-8fa4-4ab6c40dfc8d">
</div>

### ・マイページ(それぞれのページに遷移可能)
<div style="display: flex; flex-wrap: wrap;">
 <img style="width: 45%; margin: 1%;" alt="ホーム画面(ログイン前)" 
  src="https://github.com/Sho-Kawa0501/shopping-site-json/assets/120151638/9e78559d-5b47-4d1d-8ad2-2a32479c83ce">
</div>


## 使用技術
| Category          | Technology Stack                          |
| ----------------- | ----------------------------------------- |
| Frontend          | TypeScript, Next.js, redux-tool-kit       |
| Backend           | Python, Django-rest-framework             |
| Infrastructure    | Render, Vercel                            |
| Database          | PostgreSQL                                |
| Design            | tailwind-css                              |
| etc.              | Git, GitHub, AmazonS3                     |

## 主な実装機能一覧
### 基本機能
- ログイン
- 新規会員登録
- ラケットの一覧表示
- ラケットの絞り込み機能(シリーズ)
- レビューの一覧表示
- レスポンシブ対応
### ログイン後機能
- レビューの投稿・編集・削除
- レビューのお気に入り登録
- マイページ参照
  - プロフィール編集（ユーザー名、アイコン）
  - 投稿済みレビューの一覧表示
  - お気に入り登録済みレビューの一覧表示
- アカウント削除

### ER図
![SoftTennisAceReviewER図](https://github.com/Sho-Kawa0501/shopping-site-json/assets/120151638/1647bdfc-f147-4f13-9f47-83b6c82592a7)
