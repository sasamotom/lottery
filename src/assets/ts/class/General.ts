// *****************************************************
// 一般的な処理
//    スムーススクロールのポリフィルを使用
//      npm i scroll-behavior-polyfill
// *****************************************************
import 'scroll-behavior-polyfill';
import { Utils } from '../utils/Utils';

// *****************************************************
// 一般処理クラス
// *****************************************************
export class General {
  //----------------------------------------------------
  // 機能：コンストラクタ
  // 引数：なし
  // 戻値：なし
  //----------------------------------------------------
  constructor() {
  }

  //----------------------------------------------------
  // 機能：アンカーリンク位置調整（ヘッダーの高さに合わせる）
  // 引数：なし
  // 戻値：number ヘッダーの高さ（単位はpx）
  //----------------------------------------------------
  public setAnchorPosition = (): number => {
    return Utils.getHeaderHeight();
  }

  //----------------------------------------------------
  // 機能：スムーススクロールをセット
  // 引数：なし
  // 戻値：なし
  //----------------------------------------------------
  public setSmoothScroll = () => {
    const ancLinks = document.querySelectorAll('a[href^="#"]');
    ancLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href =(<Element>e!.target!).getAttribute('href');
        let target;   // 飛び先
        if (href === '#') {
          target = document.querySelector('html');
        }
        else {
          target = document.querySelector(<string>href);
        }
        if (target) {
          e.preventDefault();
          Utils.scrollTo(target);
        }
      });
    });
  }

  //----------------------------------------------------
  // 機能：100vhが画面内に収まるように調整する（対Safari）
  // 引数：なし
  // 戻値：なし
  //----------------------------------------------------
  public adjust100vh = () => {
    this._setVh();    // 初期値をセット
    // 画面のサイズ変更時に高さを再計算
    window.onresize = this._setVh;
  }
  private _setVh = () => {
    const vh = window.innerHeight / 100;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
}
