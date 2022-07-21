// *****************************************************
// ハンバーガーメニュー
//    スクロールを禁止するパッケージを使用
// *****************************************************
import { Utils } from '../utils/Utils';
// 【HTML構造サンプル】
// <div class="gnavContainer -opened" id="gnavContainer">
//   <div class="gnavBtn" id="gnavBtn"></div>
//   <nav class="nav" id="gnav">
//     <ul class="gnavList">
//       <li><a href="#">PAGE1</a></li>
//       <li><a href="#">PAGE2</a></li>
//     </ul>
//   </nav>
// </div>

// デフォルトのID名
namespace IdName {
  export const CONTAINER = 'gnavContainer';     // ハンバーガーメニューのコンテナID名
  export const BTN = 'gnavBtn';                 // ハンバーガーメニューのボタンID名
  export const CONTENT = 'gnav';                // ハンバーガーメニューのコンテンツ（表示する内容）ID名
}
// デフォルトのクラス名
namespace ClassName {
  export const OPENED = '-opened';              // ハンバーガーメニューが開いている時につけるクラス名
}
// 定数
namespace Const {
  export const SP_MAX_PX = 768;                 // SPサイズの最大ピクセル数
}

// *****************************************************
// ハンバーガーメニュークラス
// *****************************************************
export class Hamburger {
  private _openedClass: string;                 // ハンバーガーメニューが開いている時につけるクラス名
  private _container: HTMLElement | undefined;  // ハンバーガーメニューのコンテナ
  private _btn: HTMLElement | undefined;        // ハンバーガーメニューのボタン
  private _content: HTMLElement | undefined;    // ハンバーガーメニューの開閉するコンテンツ
  private _spMediaQuery: any;                   // SPサイズを示すメディアクエリ
  private _opened: boolean;                     // ハンバーガーメニューを開いているかどうか（true: 開いている, false: 開いていない）

  // ----------------------------------------------------
  // 機能：コンストラクタ
  // 引数：containerId     ハンバーガーメニューのコンテナクラス名
  //      btnId           ハンバーガーメニューのボタンクラス名
  //      contentId       ハンバーガーメニューの開閉するコンテンツクラス名
  //      openedClass     ハンバーガーメニューが開いている時につけるクラス名
  // 返値：なし
  //----------------------------------------------------
  constructor(containerId?: string, btnId?: string, contentId?: string, openedClass?: string) {
    // クラス変数の保存と初期化
    this._openedClass = openedClass ?? ClassName.OPENED;
    this._spMediaQuery = window.matchMedia('(max-width: ' + Const.SP_MAX_PX + 'px)'); // SPサイズを示すメディアクエリ
    this._opened = false;

    containerId = containerId ?? IdName.CONTAINER;
    const hamburger = document.getElementById(containerId ?? IdName.CONTAINER);
    if (hamburger) {
      this._container = hamburger;
      const btn = document.getElementById(btnId ?? IdName.BTN);
      const content = document.getElementById(contentId ?? IdName.CONTENT);
      if (btn && content) {
        this._btn = btn;
        this._content = content;

        // ハンバーガーメニューのボタン押下時のイベント登録
        this._btn.addEventListener('click', () => {
          // 要素を展開or閉じる
          this._slideToggle(<HTMLElement>this._container, <HTMLElement>this._content);
        });

        // 画面サイズ変更時のイベント登録
        this._handleWindowWidthChange(this._spMediaQuery);  // 初回実行
        this._spMediaQuery.addListener(this._handleWindowWidthChange);

        // メニュー内のアンカーリンククリック時にはメニューを閉じる
        const ancLinks = document.querySelectorAll('a[href^="#"]');
        ancLinks.forEach((link) => {
          link.addEventListener('click', (e) => {
            if (this._opened) {
              // メニューを閉じる
              this._slideToggle(<HTMLElement>this._container, <HTMLElement>this._content);
              // アンカーリンク先に飛ぶ
              const href =(<Element>e!.target!).getAttribute('href');
              let target;   // 飛び先
              if (href === '#') {
                target = document.querySelector('html');
              }
              else {
                target = document.querySelector(<string>href);
              }
              Utils.scrollTo(<Element>target);
            }
          });
        });
      }
    }
  }

  // ----------------------------------------------------
  // 機能：ハンバーガーメニューのオープン・クローズ切り替え
  // 引数：el   表示・非表示を切り替える要素
  // 返値：なし
  //----------------------------------------------------
  private _slideToggle = (container: HTMLElement, el: HTMLElement, duration = 300) => {
    if (this._opened) {
      // 【開いている場合】
      this._opened = false;
      // クラスを外す
      container.classList.remove(this._openedClass);
      // 背景のスクロールを可能とする
      Utils.scrollUnlock();
      return this._slideUp(el, duration);   // スライドを閉じる
    }
    else {
      // 【開いている場合】
      this._opened = true;
      // クラスをつける
      container.classList.add(this._openedClass);
      // 背景のスクロールを不可とする
      Utils.scrollLock();
      return this._slideDown(el, duration); // スライドを開く
    }
  }

  // ----------------------------------------------------
  // 機能：ハンバーガーメニューを開く
  // 引数：el   表示。非表示を切り替える要素
  // 返値：なし
  //----------------------------------------------------
  private _slideDown = (el: HTMLElement, duration = 300) => {
    el.style.removeProperty('display');
    let display = window.getComputedStyle(el).display;
    if (display === 'none') {
      display = 'block';
    }
    el.style.display = display;
    let height = el.offsetHeight;
    el.style.overflow = 'hidden';
    el.style.height = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
    el.style.marginTop = '0';
    el.style.marginBottom = '0';
    el.offsetHeight;
    el.style.transitionProperty = 'height, margin, padding';
    el.style.transitionDuration = duration + 'ms';
    el.style.transitionTimingFunction = 'ease';
    el.style.height = height + 'px';
    el.style.removeProperty('padding-top');
    el.style.removeProperty('padding-bottom');
    el.style.removeProperty('margin-top');
    el.style.removeProperty('margin-bottom');
    setTimeout(() => {
      el.style.removeProperty('height');
      el.style.removeProperty('overflow');
      el.style.removeProperty('transition-duration');
      el.style.removeProperty('transition-property');
      el.style.removeProperty('transition-timing-function');
    }, duration);
  }

  // ----------------------------------------------------
  // 機能：ハンバーガーメニューを閉じる
  // 引数：el   表示。非表示を切り替える要素
  // 返値：なし
  //----------------------------------------------------
  private _slideUp = (el: HTMLElement, duration = 300) => {
    el.style.height = el.offsetHeight + 'px';
    el.offsetHeight;
    el.style.transitionProperty = 'height, margin, padding';
    el.style.transitionDuration = duration + 'ms';
    el.style.transitionTimingFunction = 'ease';
    el.style.overflow = 'hidden';
    el.style.height = '0';
    el.style.paddingTop = '0';
    el.style.paddingBottom = '0';
    el.style.marginTop = '0';
    el.style.marginBottom = '0';
    setTimeout(() => {
      el.style.display = '';    // 開閉する要素にCSSで「display: none;」としておくこと
      el.style.removeProperty('height');
      el.style.removeProperty('padding-top');
      el.style.removeProperty('padding-bottom');
      el.style.removeProperty('margin-top');
      el.style.removeProperty('margin-bottom');
      el.style.removeProperty('overflow');
      el.style.removeProperty('transition-duration');
      el.style.removeProperty('transition-property');
      el.style.removeProperty('transition-timing-function');
    }, duration);
  }

  // ----------------------------------------------------
  // 機能：画面幅変更時の処理
  // 引数：e
  // 返値：なし
  //----------------------------------------------------
  private _handleWindowWidthChange = (e: any) => {
    if (e.matches) {
      // 【SPサイズになった際に実行する処理】
    }
    else {
      // 【PCサイズになった際に実行する処理】
      // gnavを開いていたら閉じる
      if (this._opened) {
        // gnavを閉じる
        (this._btn!).click();
      }
    }
  }
}
