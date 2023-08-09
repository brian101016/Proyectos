export function position_meeting(_x, _y, _obj, _ignore) {
  if (typeof _obj === "object") {
    const _obj_coords = _obj.getBoundingClientRect();

    if (_obj_coords.x <= _x && _x <= _obj_coords.x + _obj_coords.width) {
      if (_obj_coords.y <= _y && _y <= _obj_coords.y + _obj_coords.height) {
        if (_obj != _ignore) {
          return _obj;
        }
      }
    }

    return false;
  }

  const _obj_list = document.querySelectorAll(_obj);
  for (const _obj_element of _obj_list) {
    const _obj_coords = _obj_element.getBoundingClientRect();

    if (_obj_coords.x <= _x && _x <= _obj_coords.x + _obj_coords.width) {
      if (_obj_coords.y <= _y && _y <= _obj_coords.y + _obj_coords.height) {
        if (_obj_element != _ignore) {
          console.log("colisión con " + toString(_obj_element));
          return _obj_element;
        }
      }
    }
  }
}

//###############################################################################################################
//###############################################################################################################

export function place_meeting(_x, _y, _obj, _ignore) {
  const _prev_left = _ignore.style.left;
  const _prev_top = _ignore.style.top;

  _ignore.style.top = `${_x}px`;
  _ignore.style.left = `${_y}px`;

  console.log(_x, _y);

  const _val = check_colision(_obj, _ignore);

  _ignore.style.top = _prev_top;
  _ignore.style.left = _prev_left;

  return _val;
}

//###############################################################################################################
//###############################################################################################################

export function check_colision(_obj1, _obj2) {
  const _obj_coords2 = _obj2.getBoundingClientRect();
  const _obj_list = document.querySelectorAll(_obj1);

  for (const _obj_element of _obj_list) {
    const _obj_coords1 = _obj_element.getBoundingClientRect();

    if (
      position_meeting(_obj_coords1.x, _obj_coords2.y, _obj_element) &&
      position_meeting(_obj_coords1.x, _obj_coords2.y, _obj2)
    ) {
      if (_obj_element != _obj2) {
        return _obj_element;
      }
    }

    if (
      position_meeting(_obj_coords2.x, _obj_coords1.y, _obj_element) &&
      position_meeting(_obj_coords2.x, _obj_coords1.y, _obj2)
    ) {
      if (_obj_element != _obj2) {
        return _obj_element;
      }
    }

    if (
      position_meeting(_obj_coords1.x, _obj_coords1.y, _obj2) ||
      position_meeting(_obj_coords2.x, _obj_coords2.y, _obj_element)
    ) {
      if (_obj_element != _obj2) {
        return _obj_element;
      }
    }
  }
}

//###############################################################################################################
//###############################################################################################################

export function random_range(_min, _max) {
  let _diff = _max - _min;
  return Math.round(_min + _diff * Math.random());
}

//###############################################################################################################
//###############################################################################################################

export function boundaries(_min, _value, _max, _wrap) {
  if (!_wrap) {
    if (_value < _min) return _min;
    if (_value > _max) return _max;
    return _value;
  }

  if (_value < _min) return _max;
  if (_value > _max) return _min;
  return _value;
}

//###############################################################################################################
//###############################################################################################################

export function approach(_start, _end, _amount) {
  if (_start < _end) return Math.min(_start + _amount, _end);
  else return Math.max(_start - _amount, _end);
}

//###############################################################################################################
//###############################################################################################################

export function music_scheme(_action, _value) {
  if (_action == "change") {
    music_queue[current_music].pause();

    current_music += _value;
    if (current_music < 0) current_music = music_queue.length - 1;
    if (current_music > music_queue.length - 1) current_music = 0;

    music_queue[current_music].play();
    music_queue[current_music].loop = true;
  }

  if (_action == "start") {
    if (music_queue[current_music].paused) music_queue[current_music].play();
    else music_queue[current_music].pause();
  }

  const obj_music_scheme = document.querySelector("#button-music");
  obj_music_scheme.innerText = music_track[current_music];

  const obj_volume_slider = document.querySelector("#volume-slider");
  music_queue[current_music].volume = obj_volume_slider.value / 100;
}

//###############################################################################################################
//###############################################################################################################

export class Obj_Timer {
  constructor(display, countdown, ejfunction) {
    this.starting_time = 0;
    this.diff_time = 0;
    this.stopping_time = [0, 0, 0, "00:00.000"]; // MIN, SEG, MIL, "00:00.000"

    this.is_playing = false;
    this.interval_id = null;

    this.display = display;
    this.say_time = this.say_time.bind(this);
    this.update_display = this.update_display.bind(this);

    this.countdown = countdown;
    this.ejfunction = ejfunction;
  }

  // INICIAR A CONTAR
  start() {
    if (this.is_playing) return; // Ya está corriendo, entonces salir

    this.diff_time = 0;
    this.resume();
  }

  // CONTINUAR EL TIEMPO DESDE DONDE SE QUEDÓ
  resume() {
    if (this.is_playing) return;

    this.starting_time = performance.now();
    this.is_playing = true;

    if (this.display != null)
      this.interval_id = window.setInterval(this.update_display, 10);
  }

  // DEJAR DE CONTAR
  stop() {
    if (!this.is_playing) return; // No estaba corriendo, entonces salir

    this.pause();
    this.diff_time = 0;
  }

  // PAUSAR TEMPORIZADOR
  pause() {
    if (!this.is_playing) return;

    this.stopping_time = this.say_time();
    this.diff_time = performance.now() - this.starting_time + this.diff_time;
    this.is_playing = false;

    window.clearInterval(this.interval_id);
    this.interval_id = null;
  }

  // STOP Y START
  restart() {
    this.stop();
    this.start();
  }

  // TOGGLE
  toggle() {
    if (this.is_playing) this.pause();
    else this.resume();
  }

  // IS PLAYING
  is_timer_playing() {
    return this.is_playing;
  }

  // MOSTRAR EL TIEMPO
  say_time() {
    if (!this.is_playing) return this.stopping_time; // SI YA SE DETUVO, REGRESA SU ÚLTIMO TIEMPO

    //                      TIEMPO DE PREGUNTA, INICIO DE CONTAR, EL TIEMPO ANTERIOR
    let _mil = Math.floor(
      performance.now() - this.starting_time + this.diff_time
    );

    // SI HAY UNA CUENTA REGRESIVA
    if (this.countdown != null) {
      _mil =
        this.countdown[0] * 60000 +
        this.countdown[1] * 1000 +
        this.countdown[2] -
        _mil;
      if (_mil <= 0) {
        this.stopping_time = [0, 0, 0, "00:00.000"];
        this.is_playing = false;
        this.diff_time = 0;

        window.clearInterval(this.interval_id);
        this.interval_id = null;

        if (this.ejfunction != null) this.ejfunction();

        return [0, 0, 0, "Time out!"];
      }
    }

    let _seg = Math.floor((_mil / 1000) % 60);
    let _min = Math.floor(_mil / 1000 / 60);
    _mil = Math.floor(_mil % 1000);

    let _time_string = "";
    _time_string += _min < 10 ? "0" + _min + ":" : _min + ":";
    _time_string += _seg < 10 ? "0" + _seg + "." : _seg + ".";
    _time_string += _mil < 100 ? "0" : "";
    _time_string += _mil < 10 ? "0" + _mil : _mil;

    return [_min, _seg, _mil, _time_string]; // MIN, SEG, MIL, "00:00.000"
  }

  // ACTUALIZAR ALGÚN DISPLAY
  update_display() {
    if (this.display === null) return;

    const time = this.say_time();
    this.display.innerText = time[3];
  }
}
