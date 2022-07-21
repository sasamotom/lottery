// *****************************************************
// タブ
// *****************************************************
// 【HTML構造サンプル】
// <div class="js-tabContainer">
//   <ul class="tabBtnList">
//     <li class="js-tabBtn -active" data-tabid="tab1">TAB1</li>
//     <li class="js-tabBtn" data-tabid="tab2">TAB2</li>
//   </ul>
//   <ul class="tabContents">
//     <li class="js-tabContent -active" id="tab1">タブ１のコンテンツ</li>
//     <li class="js-tabContent" id="tab2">タブ２のコンテンツ</li>
//   </ul>
// </div>

// デフォルトのクラス名
namespace ClassName {
  export const CONTAINER = 'js-tabContainer';   // タブのコンテナクラス名
  export const BTN = 'js-tabBtn';               // タブのボタンクラス名
  export const CONTENT = 'js-tabContent';       // タブの開閉するコンテンツクラス名
  export const ACTIVE = '-active';              // タブが開いている時につけるクラス名
}

// *****************************************************
// タブクラス
// *****************************************************
export class Tab {
  private _containerClass: string;    // タブのコンテナクラス名
  private _btnClass: string;          // タブのボタンクラス名
  private _contentClass: string;      // タブの開閉するコンテンツクラス名
  private _activeClass: string;       // タブがアクティブな時につけるクラス名

  // ----------------------------------------------------
  // 機能：コンストラクタ
  // 引数：containerClass  タブのコンテナクラス名
  //      btnClass        タブのボタンクラス名
  //      contentClass    タブの開閉するコンテンツクラス名
  //      activeClass     タブがアクティブな時につけるクラス名
  // 返値：なし
  //----------------------------------------------------
  constructor(containerClass?: string, btnClass?: string, contentClass?: string, activeClass?: string) {
    // クラス名の保存
    this._containerClass = containerClass ?? ClassName.CONTAINER;
    this._btnClass = btnClass ?? ClassName.BTN;
    this._contentClass = contentClass ?? ClassName.CONTENT;
    this._activeClass = activeClass ?? ClassName.ACTIVE;

    const containers = document.querySelectorAll('.' + this._containerClass);  // タブのコンテナを全て取得
    containers.forEach((container) => {
      const btns = container.querySelectorAll('.' + this._btnClass);  // タブのボタン
      if (btns) {
        // タブのボタン押下時のイベント登録
        btns.forEach((btn) => {
          btn.addEventListener('click', () => {
            // 現在選択中の状態をクリア
            container.querySelector('.' + this._btnClass + '.' + this._activeClass)?.classList.remove(this._activeClass);
            container.querySelector('.' + this._contentClass + '.' + this._activeClass)?.classList.remove(this._activeClass);
            // 選択したものにアクティブクラスをつける
            const targetCont = (<HTMLElement>btn).dataset.tabid;
            if (targetCont) {
              btn.classList.add(this._activeClass);
              document.getElementById(targetCont)?.classList.add(this._activeClass);
            }
          });
        });
      }
    });
  }
}
