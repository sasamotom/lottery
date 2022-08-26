// *****************************************************
// くじ引き
// *****************************************************

// 定数
namespace Const {
  export const COLORS = ['#ffde05', '#93e01f', '#19a3fe', '#a955f2', '#ff0f77'];  // 色配列
  export const CSS_VALUE_NAME = '--box-color';    // 色のCSS変数名
  export const URL = 'https://script.google.com/macros/s/AKfycbyKL5CXWiBE1vm31Z2o922KSsidt2MWQaJN9iMvhLmk_R9OfI6ACa2xoSU86_jgSYQM/exec';  // 送信先URL
  export const BTN_DROW = 'DRAW A LOT!!!!!!!!'; // くじを引くボタンキャプション
  export const BTN_ADD = 'ADD!!!!!'; // くじを追加するボタンキャプション
  export const BTN_RENAME = 'RENAME THIS BOX!!!!!!!'; // 箱名を変更するボタンキャプション
  export const BTN_ALLDATA = 'GET DATA!!!!!'; // データ一覧を取得するボタンキャプション
}


// *****************************************************
// くじ引きクラス
// *****************************************************
export class Lottery {
  private _loginArea: any;      // ログイン領域
  private _menuArea: any;       // メニュー領域
  private _firstArea: any;      // ログイン＆メニュー領域
  private _mainArea: any;       // メイン領域

  // ----------------------------------------------------
  // 機能：コンストラクタ
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  constructor() {
    // 各領域を取得
    this._loginArea = document.getElementById('loginArea'); // ログイン領域を非表示に
    this._menuArea = document.getElementById('menuArea');   // メニューエリアを表示
    this._firstArea = document.getElementById('FirstArea'); // ログイン＆メニューエリアを表示
    this._mainArea = document.getElementById('mainArea');   // メイン領域を非表示に
    // 箱情報の取得
    this._setBoxBtn();

    // ログインイベント登録
    this._login();

    // 送信ボタンイベント登録
    const sendBtn = document.getElementById('sendBtn');
    if (!sendBtn) {
      console.error('送信ボタンが見つかりません。');
      return ;
    }
    sendBtn.addEventListener('click', () => {
      const kind = document.querySelector('[name="kind"]');
      if (kind) {
        if (((<HTMLInputElement>kind).value).startsWith('get_')) {
          this._get((<HTMLInputElement>kind).value);
        }
        else {
          this._post((<HTMLInputElement>kind).value);
        }
      }
    } ,false);
  }

  // ----------------------------------------------------
  // 機能：箱ボタンのセット
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _setBoxBtn() {
    const url = Const.URL;
    const params = { kind : "get_boxes" };
    const query = new URLSearchParams(params);
    // APIを使って非同期データを取得する
    fetch(url + `?${query}`)
    .then(response => response.json())
    // 成功時の処理
    .then(data => {
      const selectbox = document.getElementById('selectableBoxes'); // 選択用箱ボタン
      // 箱ボタンの作成
      for (let i = 0; i < data.length; i++) {
        const boxid = data[i]['box_no'];
        const name = data[i]['post_text'];
        const unselectedCnt = data[i]['unselected_data_count'];
        const allCnt = data[i]['all_data_count'];
        const li = `<ul class="boxImage -small" data-boxid="${boxid}" data-name="${name}" data-unselected="${unselectedCnt}" data-counts="${allCnt}">
          <li class="front"><span class="no">${i + 1}</span></li><li></li><li></li><li></li><li></li><li></li>
          </ul>`;
        if (selectbox) {
          selectbox.insertAdjacentHTML('beforeend', li);
        }
      }
      // 箱ボタンにてボックス変更時のイベント登録
      const boxBtns = document.querySelectorAll('#selectableBoxes .boxImage');  // 箱ボタン領域
      const boxImage = document.getElementById('boxImage'); // 選択中の箱
      if (boxBtns.length > 0) {
        boxBtns.forEach((box, index) => {
          box.addEventListener('click', () => {
            // 箱情報の取得
            const boxId = (<any>box).dataset.boxid;
            const name = (<any>box).dataset.name;
            const unselectedCnt = (<any>box).dataset.unselected;
            const allCnt = (<any>box).dataset.counts;
            // CSS変数（色）更新
            document.documentElement.style.setProperty(Const.CSS_VALUE_NAME, Const.COLORS[index % 5]);
            // テキスト変更
            if (boxImage) {
              const boxNo = boxImage.querySelector('.no');
              if (boxNo) {
                boxNo.innerHTML = (index + 1).toString();
              }
              const boxName = boxImage.querySelector('.name');
              if (boxName) {
                boxName.innerHTML =name;
              }
              const boxUnselected = boxImage.querySelector('.unselected');
              if (boxUnselected) {
                boxUnselected.innerHTML =unselectedCnt;
              }
              const boxCnt = boxImage.querySelector('.allCnt');
              if (boxCnt) {
                boxCnt.innerHTML =allCnt;
              }
            }
            // ボックスIDの保存
            const inputBoxId = document.getElementById('boxId');
            if (inputBoxId) {
              (<HTMLInputElement>inputBoxId).value = boxId;
            }
            // 全てのボタン表示
            const selectedBtn = document.querySelectorAll('#selectableBoxes .-selected');
            if (selectedBtn.length > 0) {
              selectedBtn.forEach(btn => {
                btn.classList.remove('-selected');
              });
            }
            // 選択中箱ボタン非表示
            box.classList.add('-selected');
          });
        });
        boxBtns[0].dispatchEvent(new Event('click')); // 初回クリック（左端のボックス）
      }
    });
  }

  // ----------------------------------------------------
  // 機能：箱情報の更新
  // 引数：boxNo 更新対象の箱番号（1〜）
  //      unselected 未選択状態のくじ数
  //      allCnt 全てのくじ数
  //      name 箱名称
  // 返値：なし
  // ----------------------------------------------------
  private _updateBoxInfo(boxNo: number, unselected: string, allCnt: string, name?: string) {
    // console.log('更新箱番号:'+boxNo);
    // 箱ボタンの情報を更新
    const box = document.querySelector('#selectableBoxes .boxImage:nth-child(' + boxNo.toString() +')');
    if (box) {
      (<any>box).dataset.unselected = unselected;
      (<any>box).dataset.counts = allCnt;
    }
    // 名称が引数に設定されている場合は、名称も更新する
    if (typeof name !== "undefined") {
      if (box) {
        (<any>box).dataset.name = name;
      }
    }

    // 選択中の箱情報を更新
    const box2 = document.querySelector('#selectableBoxes .-selected');
    const unselectedCnt2 = (<any>box2).dataset.unselected;
    const allCnt2 = (<any>box2).dataset.counts;
    const name2 = (<any>box2).dataset.name;
    const boxUnselected = document.querySelector('#boxImage .unselected');
    if (boxUnselected) {
      boxUnselected.innerHTML = unselectedCnt2;
    }
    const boxCount = document.querySelector('#boxImage .allCnt');
    if (boxCount) {
      boxCount.innerHTML = allCnt2;
    }
    const boxName= document.querySelector('#boxImage .name');
    if (boxName) {
      boxName.innerHTML = name2;
    }
  }

  //----------------------------------------------------
  // 機能：データの送信
  // 引数：kind データの送信の種類
  // 返値：なし
  //----------------------------------------------------
  private _post(kind: string) {
    let postText = '';  // スプシにセットするテキスト
    const pt = document.querySelector('[name="post_text"]');
    if (pt) {
      postText = (<HTMLInputElement>pt).value;
    }
    // console.log(postText, kind);
    // 登録するテキストがない場合は何もしない
    if (postText === '' && kind !== 'draw_lots') {
      return;
    }

    // ボタンを非アクティブに
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      (<HTMLFormElement>sendBtn).disabled = true;
    }
    // 結果欄を送信中にする
    const result = document.getElementById('result');
    if (result) {
      result.innerHTML = 'SENDING......';
    }

    // 選択中の箱番号を保存
    let boxNo = 0;  // 選択中の箱番号
    const selectedBoxNo = document.querySelector('#boxImage .no');
    if (selectedBoxNo) {
      boxNo = Number(selectedBoxNo.innerHTML);
    }

    // FormDataオブジェクトに要素セレクタを渡して宣言する
    const formDatas = document.getElementById('form');
    if (!formDatas) {
      return;
    }
    const mixedDatas = new FormData(<HTMLFormElement>formDatas);
    // appendメソッドでキーとデータの組をセットする
    // append("キー(FORMで云うところのname属性値)",  "データ")でデータをセットできる
    // appendではデータは追加となる
    const keys= ['kind', 'post_user', 'box_no', 'post_text'];
    for (let i = 0; i < keys.length; i++) {
      const val = document.querySelector('[name="' + keys[i] + '"]');
      if (val) {
        mixedDatas.append(keys[i], (<HTMLInputElement>val).value);
      }
    }
    // XHRの宣言
    const XHR = new XMLHttpRequest();
    // openメソッドにPOSTを指定して送信先のURLを指定します
    XHR.open('POST', Const.URL, true);
    // sendメソッドにデータを渡して送信を実行する
    XHR.send(mixedDatas);
    // サーバの応答をonreadystatechangeイベントで検出して正常終了したらデータを取得する
    XHR.onreadystatechange = () => {
      if(XHR.readyState == 4 && XHR.status == 200){
        // POST送信した結果を表示する
        if (result) {
          // テキストエリアを空にする
          const textArea = document.querySelector('[name="post_text"]');
          if (textArea) {
            (<HTMLInputElement>textArea).value = '';
          }
          let log = ''; // ログテキスト
          switch (kind) {
            case 'add_text':  // くじの追加
              log = 'SUCCESSFULLY SENT!!!!<br>「' + postText + '」';
              break;
            case 'update_info': // 箱名称の変更
              // ログテキストの作成
              log = 'SUCCESSFULLY RENAME BOX!!!!<br>「' + postText + '」';
              break;
            case 'draw_lots': // くじをひく
              log = ''; // ログテキストクリア
              break;
            default:
              break;
          }
          // 結果出力
          const json = XHR.responseText;
          const obj = JSON.parse(json);
          for (let i = 0; i < obj.length; i++) {
            console.log(obj[i]);
            if (obj[i].result === 'OK') {
              result.innerHTML = log;
              this._addLog(kind, boxNo, obj[i].time, obj[i].text);
              if (kind === 'update_info') {
                this._updateBoxInfo(boxNo, obj[i].unselected_data_count, obj[i].all_data_count, postText);
              }
              else {
                this._updateBoxInfo(boxNo, obj[i].unselected_data_count, obj[i].all_data_count);
              }
            }
            else {
              result.innerHTML = obj[i].text;
            }
          }
        }
      }
      else {
        if (result) {
          result.innerHTML = 'SEND NG : ' + postText;
        }
      }
      // ボタンをアクティブに
      (<HTMLFormElement>sendBtn).disabled = false;
    };
  }

  //----------------------------------------------------
  // 機能：データの取得
  // 引数：kind データの送信の種類
  // 返値：なし
  //----------------------------------------------------
  private _get(kind: string) {
    const url = Const.URL;
    const selectedBox = document.querySelector('#selectableBoxes .-selected');
    if (!selectedBox) {
      return ;
    }
    const params = { kind : `${kind}`, box_no: `${(<any>selectedBox).dataset.boxid}` };
    const query = new URLSearchParams(params);
    // ボタンを非アクティブに
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn) {
      (<HTMLFormElement>sendBtn).disabled = true;
    }
    // APIを使って非同期データを取得する
    fetch(url + `?${query}`)
    .then(response => response.json())
    // 成功時の処理
    .then(data => {
      console.log(data);
      const table = document.getElementById('tableBody'); // テーブルデータ領域
      if (table) {
        // 表示中のデータ削除
        table.innerHTML = '';
        // データ表のタイトル更新
        const tableNo = document.querySelector('#tableName .no');
        if (tableNo) {
          const number = selectedBox.querySelector('.front .no');
          if (number) {
            tableNo.innerHTML = number.innerHTML;
            (<HTMLElement>tableNo).style.color = Const.COLORS[(Number(number.innerHTML) - 1) % 5];
          }
        }
        const tableName = document.querySelector('#tableName .name');
        if (tableName) {
          tableName.innerHTML = (<any>selectedBox).dataset.name;
        }

        // データ行の作成
        for (let i = 0; i < data.length; i++) {
          const time = data[i]['time_stamp'];
          const user = data[i]['post_user'];
          const text = data[i]['post_text'];
          const draw = data[i]['post_selected_user'];
          let drawn = '';
          if (draw.length > 0) {
            drawn = 'class="-drawn"'
          }
          const row = `<tr ${drawn}>
              <td class="time">${time}</td>
              <td class="user">${user}</td>
              <td class="text">${text}</td>
              <td class="draw">${draw}</td>
            </tr>`;
          table.insertAdjacentHTML('beforeend', row);
        }
      }
      // ボタンをアクティブに
      (<HTMLFormElement>sendBtn).disabled = false;
    });
  }

  // ----------------------------------------------------
  // 機能：ログの追加
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _addLog(kind: string, boxNo: number, time: string, text: string) {
    let area;
    if (kind === 'add_text') {
      area = document.getElementById('logAdd');
    }
    else if (kind === 'draw_lots') {
      area = document.getElementById('logDraw');
    }
    if (area) {
      let html = '';
      html = html + `<dt class="no" style="color: ${Const.COLORS[(boxNo - 1) % 5]};">${boxNo}</dt>`;
      html = html + `<dd class="time">${time}</dd>`;
      html = html + `<dd class="text">${text}</dd>`;
      area.insertAdjacentHTML('afterbegin', html);
    }
  }

  // ----------------------------------------------------
  // 機能：ログイン処理（ユーザー名決定処理）
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _login() {
    // STARTボタンイベント登録
    const startBtn = document.getElementById('startBtn');
    const yourName = document.getElementById('yourName');
    if (startBtn && yourName) {
      startBtn.addEventListener('click', () => {
        // 名前のチェック
        const name = (<HTMLInputElement>yourName).value;
        if (name === '') {
          alert('お名前を入力してください。');
          return;
        }
        // 名前の保存
        const nameInput = document.querySelector('[name="post_user"]');
        if (nameInput) {
          (<HTMLInputElement>nameInput).value = name;
        }
        else {
          console.error('ユーザー名が保存できないため、開始できません。');
          return ;
        }
        // ボタンのイベント登録
        this._setBtnEvent();
        // メニューの表示
        this._showMenu();
      });
    }
    else {
      console.error('このアプリケーションをするために必要な要素が存在しないため、開始できません。');
    }
  }

  // ----------------------------------------------------
  // 機能：ボタンのイベント登録
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _setBtnEvent() {
    // メニューボタンのイベント登録
    let btn = document.getElementById('addBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        this._showAddLots();
      });
    }
    btn = document.getElementById('drawBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        this._showDrawLots();
      });
    }
    btn = document.getElementById('renameBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        this._showRenameBoxes();
      });
    }
    btn = document.getElementById('showBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        this._showShowData();
      });
    }
    // メニューに戻るボタンイベント登録
    btn = document.getElementById('backToMenu');
    if (btn) {
      btn.addEventListener('click', () => {
        // メニューの表示
        this._showMenu();
      });
    }
    // 送信ボタンイベント登録

  }

  // ----------------------------------------------------
  // 機能：メニューの表示
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _showMenu() {
    // メニューの表示
    if (this._loginArea) {
      this._loginArea.style.display = 'none'; // ログイン領域を非表示に
    }
    if (this._mainArea) {
      this._mainArea.style.display = 'none'; // メイン領域を非表示に
    }
    if (this._firstArea) {
      this._firstArea.style.display = 'block'; // ログイン＆メニューエリアを表示
    }
    if (this._menuArea) {
      this._menuArea.style.display = 'block'; // メニューエリアを表示
    }
    // BOXのテキストを変更
    const loginBoxText = document.getElementById('loginBoxText');
    if (loginBoxText) {
      loginBoxText.innerHTML = 'Please tap a button.';
    }
  }

  // ----------------------------------------------------
  // 機能：くじをひく画面の表示
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _showDrawLots() {
    console.log('くじをひく画面表示');
    if (this._firstArea) {
      this._firstArea.style.display = 'none'; // ログイン＆メニューエリアを非表示に
    }
    // テキスト欄を非表示
    const postTextRow = document.getElementById('postTextRow');
    if (postTextRow) {
      postTextRow.style.display = 'none';
    }
    // ボタンのキャプション設定
    const btn = document.getElementById('sendBtn');
    if (btn) {
      btn.innerHTML = Const.BTN_DROW;
    }
    // 種別の設定
    const kind = document.querySelector('[name="kind"]');
    if (kind) {
      (<HTMLInputElement>kind).value = 'draw_lots';
    }
    // ログの表示設定
    const addLog = document.getElementById('logAddArea');
    if (addLog) {
      addLog.style.display = 'none';
    }
    const drawLog = document.getElementById('logDrawArea');
    if (drawLog) {
      drawLog.style.display = 'block';
    }
    const resultLog = document.getElementById('result');
    if (resultLog) {
      resultLog.innerHTML = '';
    }
    // くじリスト欄表示設定
    const AllLotsData = document.getElementById('AllLotsData');
    if (AllLotsData) {
      AllLotsData.style.display = 'none';
    }
    if (this._mainArea) {
      this._mainArea.style.display = 'block'; // メイン領域を表示
    }
  }

  // ----------------------------------------------------
  // 機能：くじ追加画面の表示
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _showAddLots() {
    console.log('追加画面表示');
    if (this._firstArea) {
      this._firstArea.style.display = 'none'; // ログイン＆メニューエリアを非表示に
    }
    // テキスト欄を表示
    const postTextRow = document.getElementById('postTextRow');
    if (postTextRow) {
      postTextRow.style.display = 'block';
    }
    // ボタンのキャプション設定
    const btn = document.getElementById('sendBtn');
    if (btn) {
      btn.innerHTML = Const.BTN_ADD;
    }
    // 種別の設定
    const kind = document.querySelector('[name="kind"]');
    if (kind) {
      (<HTMLInputElement>kind).value = 'add_text';
    }
    // ログの表示設定
    const addLog = document.getElementById('logAddArea');
    if (addLog) {
      addLog.style.display = 'block';
    }
    const drawLog = document.getElementById('logDrawArea');
    if (drawLog) {
      drawLog.style.display = 'none';
    }
    const resultLog = document.getElementById('result');
    if (resultLog) {
      resultLog.innerHTML = '';
    }
    // くじリスト欄表示設定
    const AllLotsData = document.getElementById('AllLotsData');
    if (AllLotsData) {
      AllLotsData.style.display = 'none';
    }
    if (this._mainArea) {
      this._mainArea.style.display = 'block'; // メイン領域を表示
    }
  }
  // ----------------------------------------------------
  // 機能：箱名称変更画面の表示
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _showRenameBoxes() {
    console.log('箱名称変更画面表示');
    if (this._firstArea) {
      this._firstArea.style.display = 'none'; // ログイン＆メニューエリアを非表示に
    }
    // テキスト欄を表示
    const postTextRow = document.getElementById('postTextRow');
    if (postTextRow) {
      postTextRow.style.display = 'block';
    }
    // ボタンのキャプション設定
    const btn = document.getElementById('sendBtn');
    if (btn) {
      btn.innerHTML = Const.BTN_RENAME;
    }
    // 種別の設定
    const kind = document.querySelector('[name="kind"]');
    if (kind) {
      (<HTMLInputElement>kind).value = 'update_info';
    }
    // ログの表示設定
    const addLog = document.getElementById('logAddArea');
    if (addLog) {
      addLog.style.display = 'none';
    }
    const drawLog = document.getElementById('logDrawArea');
    if (drawLog) {
      drawLog.style.display = 'none';
    }
    const resultLog = document.getElementById('result');
    if (resultLog) {
      resultLog.innerHTML = '';
    }
    // くじリスト欄表示設定
    const AllLotsData = document.getElementById('AllLotsData');
    if (AllLotsData) {
      AllLotsData.style.display = 'none';
    }
    if (this._mainArea) {
      this._mainArea.style.display = 'block'; // メイン領域を表示
    }
  }

  // ----------------------------------------------------
  // 機能：一覧データ表示
  // 引数：なし
  // 返値：なし
  //----------------------------------------------------
  private _showShowData() {
    console.log('データ一覧表示');
    if (this._firstArea) {
      this._firstArea.style.display = 'none'; // ログイン＆メニューエリアを非表示に
    }
    // テキスト欄を表示
    const postTextRow = document.getElementById('postTextRow');
    if (postTextRow) {
      postTextRow.style.display = 'none';
    }
    // ボタンのキャプション設定
    const btn = document.getElementById('sendBtn');
    if (btn) {
      btn.innerHTML = Const.BTN_ALLDATA;
    }
    // 種別の設定
    const kind = document.querySelector('[name="kind"]');
    if (kind) {
      (<HTMLInputElement>kind).value = 'get_alldata';
    }
    // ログの表示設定
    const addLog = document.getElementById('logAddArea');
    if (addLog) {
      addLog.style.display = 'none';
    }
    const drawLog = document.getElementById('logDrawArea');
    if (drawLog) {
      drawLog.style.display = 'none';
    }
    const resultLog = document.getElementById('result');
    if (resultLog) {
      resultLog.innerHTML = '';
    }
    // くじリスト欄表示設定
    const table = document.getElementById('tableBody'); // テーブルデータ領域
    if (table) {
      // 前回のデータ削除
      table.innerHTML = '';
    }
    const AllLotsData = document.getElementById('AllLotsData');
    if (AllLotsData) {
      AllLotsData.style.display = 'block';
    }
    if (this._mainArea) {
      this._mainArea.style.display = 'block'; // メイン領域を表示
    }
  }
}
