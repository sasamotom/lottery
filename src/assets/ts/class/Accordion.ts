// *****************************************************
// アコーディオン
// *****************************************************
// 【HTML構造サンプル】
// <dl class="js-acdContainer">   // 展開時にはこのコンテナに -opened クラスがつく
//   <dt class="js-acdBtn">質問　テキストテキストテキスト</dt>
//   <dd class="js-acdContent">回答　テキストテキストテキスト</dd>
// </dl>

// デフォルトのクラス名
namespace ClassName {
  export const CONTAINER = 'js-acdContainer';   // アコーディオンのコンテナクラス名
  export const BTN = 'js-acdBtn';               // アコーディオンのボタンクラス名
  export const CONTENT = 'js-acdContent';       // アコーディオンの開閉するコンテンツクラス名
  export const OPENED = '-opened';              // アコーディオンが開いている時につけるクラス名
}

// *****************************************************
// アコーディオンクラス
// *****************************************************
export class Accordion {
  private _containerClass: string;    // アコーディオンのコンテナクラス名
  private _btnClass: string;          // アコーディオンのボタンクラス名
  private _contentClass: string;      // アコーディオンの開閉するコンテンツクラス名
  private _openedClass: string;       // アコーディオンが開いている時につけるクラス名

  // ----------------------------------------------------
  // 機能：コンストラクタ
  // 引数：containerClass  アコーディオンのコンテナクラス名
  //      btnClass        アコーディオンのボタンクラス名
  //      contentClass    アコーディオンの開閉するコンテンツクラス名
  //      openedClass     アコーディオンが開いている時につけるクラス名
  // 返値：なし
  //----------------------------------------------------
  constructor(containerClass?: string, btnClass?: string, contentClass?: string, openedClass?: string) {
    // クラス名の保存
    this._containerClass = containerClass ?? ClassName.CONTAINER;
    this._btnClass = btnClass ?? ClassName.BTN;
    this._contentClass = contentClass ?? ClassName.CONTENT;
    this._openedClass = openedClass ?? ClassName.OPENED;

    const accordions = document.querySelectorAll('.' + this._containerClass);  // アコーディオンのコンテナを全て取得
    accordions.forEach((accordion) => {
      const btn = accordion.querySelector<HTMLElement>('.' + this._btnClass);  // アコーディオンのボタン
      const content = accordion.querySelector<HTMLElement>('.' + this._contentClass);  // アコーディオンのコンテンツ
      if (btn && content) {
        // アコーディオンのボタン押下時のイベント登録
        btn.addEventListener('click', () => {
          // 要素を展開or閉じる
          this._slideToggle(accordion, content);
        });
      }
    });
  }

  // ----------------------------------------------------
  // 機能：アコーディオンのオープン・クローズ切り替え
  // 引数：el   表示・非表示を切り替える要素
  // 返値：なし
  //----------------------------------------------------
  private _slideToggle = (container: Element, el: HTMLElement, duration = 300) => {
    if (container.classList.contains(this._openedClass)) {
      // 開いていることを示すクラスがついている場合は、そのクラスを外してスライドを閉じる
      container.classList.remove(this._openedClass);
      return this._slideUp(el, duration);
    }
    else {
      // 開いていることを示すクラスがついていない場合は、クラスをつけてスライドを開く
      container.classList.add(this._openedClass);
      return this._slideDown(el, duration);
    }
  }

  // ----------------------------------------------------
  // 機能：アコーディオンを開く
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
  // 機能：アコーディオンを閉じる
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
      el.style.display = 'none';
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
}
