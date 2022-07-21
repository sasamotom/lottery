// *****************************************************
// ユーティリティクラス（static）
// *****************************************************
export class Utils {
  static _top: number;    // スクロールロック時のページ表示位置（Y方向）

  // ----------------------------------------------------
  // 機能：スクロールをロックする
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  static scrollLock() {
    this._top = window.pageYOffset;
    document.querySelector('body')!.style.top = '-' + this._top + 'px';
    document.querySelector('body')!.style.position = 'fixed';
  }

  // ----------------------------------------------------
  // 機能：スクロールをロックを解除する
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  static scrollUnlock() {
    document.querySelector('body')!.style.removeProperty('position');
    document.querySelector('body')!.style.removeProperty('top');
    window.scrollTo({top: this._top});
  }

  // ----------------------------------------------------
  // 機能：ヘッダーの高さを取得
  // 引数：なし
  // 返値：number ヘッダーの高さ（単位：px）
  //----------------------------------------------------
  static getHeaderHeight(): number {
    const h = document.getElementById('header')!.clientHeight;
    document.documentElement.style.setProperty('--header-height', h + 'px');
    return h;
  }

  // ----------------------------------------------------
  // 機能：指定要素までスクロールする
  // 引数：target   スクロール先要素
  //      smooth   スムーススクロールするかどうか（true: スムーススクロールする、false: しない）規定値 true
  // 返値：なし
  //----------------------------------------------------
  static scrollTo(target: Element, smooth?: boolean) {
    const smoothOpt = smooth ?? true;
    const behavior = smoothOpt ? 'smooth': 'auto';
    const h = this.getHeaderHeight(); // ヘッダーの高さを取得

    // Safariの場合はscroll-margin-topが効かないため、位置を計算する必要がある
    const position = target.getBoundingClientRect().top;
    const offsetTop = window.pageYOffset;
    const positionTop = position + offsetTop - h;
    window.scrollTo({
      top: positionTop,
      behavior: behavior,
    });
  }
}
