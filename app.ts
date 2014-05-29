/// <reference path="jquery.d.ts" />

class NumberBtnManager {
  private _size: number;
  private _currentNum: number;

  get size(): number {
    return this._size;
  }

  constructor() {
    this._size = 3;
    this._currentNum = 1;
  }

  initNumberBtn(): JQuery[] {
    var buttons: JQuery[] = [];

    for (var i = 1; i <= this._size * this._size; i++) {
      buttons.push(this._createButton(i));
    }
    return buttons;
  }

  private _createButton(num) :JQuery {
    var _this = this;

    return $('<input />', {
      'type': 'button',
      'value': num,
      'click': function () {
        if (this.value == _this._currentNum) {
          this.disabled = true;
          _this._currentNum++;
        }

        if (_this._currentNum > _this._size * _this.size) {
          var gameOver = new $.Event('GameOver');
          $('#time').trigger(gameOver);
        }
      }
    });
  }
}

class Timer {
  private _timer: number;
  private _startTime: number;
  private _ticker: JQueryEventObject;

  constructor() {
    this._timer = null;
    this._startTime = null;
    this._ticker = null;
  }

  startTimer(): void {
    this._startTime = this.now();
    this.runTimer();
  }

  runTimer(): void {
    var sec: number;
    sec = (this.now() - this._startTime) / 1000
    var secString: string = sec.toFixed(1);

    this._timer = setTimeout(() => {
      this.runTimer();
      }, 100);
    this._ticker = new $.Event('Ticker', { second: sec });
    $('#time').trigger(this._ticker);
  }

  now(): number {
    return (new Date()).getTime();
  }
}

$(function() {
  var timerObj: Timer;
  var numberBtnManager: NumberBtnManager;
  var isPlaying = false;

  $('#time').bind('Ticker', function (ev) {
    $('#time').html(ev['second']);
    })
  $('#time').bind('GameOver', function () {
    alert('Your Score:' + $('#time').html());
  });
  $('#timerStart').click(function () {
    numberBtnManager = new NumberBtnManager();
    timerObj = new Timer();
    initBoard();
    timerStart();
    })

  function timerStart() {
    if(!isPlaying) {
      isPlaying = true;
      timerObj.startTimer();
    }
  }

  function initBoard() {
    var buttons = numberBtnManager.initNumberBtn();
    var board = $('#board');
    var button : JQuery;
    if (board.children().length != 0) {
      board.children().remove();
    }

    while (buttons.length) {
      button = buttons.splice(Math.floor(Math.random() * buttons.length), 1)[0];
      board.append(button);

      if (buttons.length % numberBtnManager.size == 0) {
        board.append($('<br />'));
      }
    }
  }
});
