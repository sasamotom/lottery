// *****************************************************
// モーダル
//    マイクロモーダルのライブラリを使用
//      npm i micromodal
//      npm i @types/micromodal
// *****************************************************
import MicroModal from 'micromodal';
import { Utils } from '../utils/Utils';
// 【HTML構造サンプル】
// <p class="btn">
//   <span class="btn_txt" data-micromodal-trigger="modal-1">モーダル</span>
// </p>
// <div class="modal" id="modal-1" aria-hidden="true">
//   <div class="modal_overlay" tabindex="-1" data-micromodal-close="">
//     <div class="modal_container" role="dialog" aria-modal="true" aria-labelledby="modal">
//       <div class="modal_content">
//         <p>モーダルの中身</p>
//       </div>
//       <div class="modal_closeBtn" aria-label="Close modal" data-micromodal-close=""></div>
//     </div>
//   </div>
// </div>


// *****************************************************
// モーダルクラス
// *****************************************************
export class Modal {
  // ----------------------------------------------------
  // 機能：コンストラクタ
  // 引数：containerClass  モーダルのコンテナクラス名
  //      btnClass        モーダルのボタンクラス名
  //      contentClass    モーダルの開閉するコンテンツクラス名
  //      activeClass     モーダルがアクティブな時につけるクラス名
  // 返値：なし
  //----------------------------------------------------
  constructor() {
    // マイクロモーダルの初期化
    MicroModal.init({
      onShow: this._onShow,
      onClose: this._onClose,
      disableScroll: true,      // true:メイン画面のスクロール禁止（正常に動作しないので、独自処理を追加している）
      // disableFocus: true,       // true:自動フォーカスを禁止
      awaitOpenAnimation: true,
      awaitCloseAnimation: true
    });
  }
  //----------------------------------------------------
  // 機能：モーダルを開く際に呼び出す処理
  // 引数：なし
  // 戻値：なし
  //----------------------------------------------------
  private _onShow = (modal: any) => {
    // 背景のスクロールを不可とする
    Utils.scrollLock();
  }
  //----------------------------------------------------
  // 機能：モーダルを閉じる際に呼び出す処理
  // 引数：なし
  // 戻値：なし
  //----------------------------------------------------
  private _onClose = () => {
    // 背景のスクロールを可能とする
    Utils.scrollUnlock();
  }
}
