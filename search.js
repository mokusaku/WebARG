/**
 * YOIMI CAMERA - 共通検索・インタラクションスクリプト
 */

function executeSearch() {
    const inputVal = document.getElementById('keywordInput').value.trim();
    const resultArea = document.getElementById('searchResult');

    if (inputVal === "") {
        resultArea.style.display = "block";
        resultArea.innerHTML = "キーワードが入力されていません。";
        return;
    }

    // すべてのキーワードを検索結果ページへ遷移
    resultArea.style.display = "none";
    window.location.href = "search.html?q=" + encodeURIComponent(inputVal);
}

// 初期化処理
document.addEventListener('DOMContentLoaded', () => {
    const keywordInput = document.getElementById('keywordInput');
    const resultArea = document.getElementById('searchResult');
    const searchWidget = document.querySelector('.search-widget');

    if (keywordInput) {
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch();
        });
    }

    // ウィジェット外クリックで検索結果を閉じる
    document.addEventListener('click', (event) => {
        if (searchWidget && !searchWidget.contains(event.target)) {
            if (resultArea) resultArea.style.display = 'none';
        }
    });

    // モバイル向けヘッダーの自動隠蔽ロジック（全ページ共通）
    const headerStyle = document.createElement('style');
    headerStyle.innerHTML = `
        @media (max-width: 768px) {
            /* スクロールダウン時の要素隠蔽 */
            body.site-scrolled-down header .logo, 
            body.site-scrolled-down header nav {
                display: none !important;
            }

            /* スマホでnavが2段にならないよう強制1段化・間隔調整 */
            header nav {
                flex-wrap: nowrap !important;
                gap: 12px !important;
                overflow-x: auto; /* はみ出た場合は横スクロール */
                padding-bottom: 5px; /* スクロールバー用の余裕 */
            }
            header nav a {
                font-size: 11px !important;
                white-space: nowrap;
            }

            /* ヘッダー自体の余白アニメーション（カクつき防止） */
            header {
                transition: padding 0.3s ease;
            }
            body.site-scrolled-down header {
                padding-top: 10px;
                padding-bottom: 10px;
            }
        }
    `;
    document.head.appendChild(headerStyle);

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 768) return; // モバイルのみ適用

        let currentScrollY = window.scrollY;
        
        // --- 画面端のラバーバンド（バウンス）対策 ---
        // 一番上にいる場合
        if (currentScrollY <= 0) {
            document.body.classList.remove('site-scrolled-down');
            lastScrollY = currentScrollY;
            return;
        }
        
        // 一番下にスクロールした際、バウンスで上スクロールと判定されてガクつくのを防ぐ
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (currentScrollY >= maxScroll - 5) {
            // 一番下では非表示状態（隠れたまま）を維持する
            lastScrollY = currentScrollY;
            return;
        }

        // --- 通常の判定 ---
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            document.body.classList.add('site-scrolled-down');
        } else if (currentScrollY < lastScrollY) {
            document.body.classList.remove('site-scrolled-down');
        }
        
        lastScrollY = currentScrollY;
    });
});
