import { General } from './class/General';
import { Accordion } from './class/Accordion';
import { Hamburger } from './class/Hamburger';
import { Modal } from './class/Modal';
import { Tab } from './class/Tab';

window.addEventListener('DOMContentLoaded', () => {
  const general = new General();
  general.setAnchorPosition();  // アンカーリンクの位置調整（ページロード時用）
  general.setSmoothScroll();    // スムーススクロール
  general.adjust100vh();        // 100vhを調整
  const acd = new Accordion();  // アコーディオン
  const hmb = new Hamburger();  // ハンバーガーメニュー
  const mdl = new Modal();      // モーダル
  const tab = new Tab();        // タブ
});
