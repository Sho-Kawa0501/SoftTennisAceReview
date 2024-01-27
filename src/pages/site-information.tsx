const AuthErrorPage = () => {
  return (
    <>
    <div className="flex justify-center items-center">
      <div className="bg-white p-6 md:p-12 shadow-xl rounded-lg">
        <h1 className="text-3xl font-bold mb-4">サイト案内</h1>
        <ul className="list-disc list-inside text-gray-700 text-base space-y-2">
        <li>本サイトはソフトテニスラケットのレビューサイトです。</li>
        <li>ログイン後は以下の機能をご利用いただけます：
          <ul>
            <li>レビューの投稿、編集、削除</li>
            <li>他のユーザーのレビューへのお気に入り機能</li>
            <li>Mypageからのプロフィール編集</li>
          </ul>
        </li>
        <li>レビュー投稿時の注意点：レビューする際は、誹謗中傷を絶対に書かないでください。</li>
        <li>レビュー閲覧時の注意点：ラケットは以下のような要因によって扱いやすさが変わります。<br />使用者の体格、プレースタイル、使用ガット、ポンド数、グリップサイズ、重量カスタムなど。</li>
        <li>ラケット一覧は比較的新しいシリーズのものを選定しております。</li>
        <li>カラーバリエーションやフェイス面積などの詳しい商品情報は、各ブランドの商品ホームページをご覧ください。</li>
        <li>本サイトからラケットの購入はできません。また販売サイトのページリンクもございません。</li>
        <li>ラケットを購入したい方は他のサイトや媒体を参考にしてください。</li>
        <li>一部のラケットの画像は準備中です。実物の画像を確認したい方は、各ブランドのホームページをご覧ください。</li>
        <li>当サイトは不定期でメンテナンスを行う可能性がございます。利用できない場合はご了承ください。</li>
      </ul>
      </div>
    </div>
  </>
  )
}

export default AuthErrorPage