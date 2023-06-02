function random_range(_min, _max) {
    //let _num = Math.random();
    //_num = Math.round(100*_num);
    
    let _diff = _max - _min;
    return Math.round(_min + (_diff * Math.random()) )
}

//###############################################################################################################
//###############################################################################################################

function boundaries(_min, _value, _max) {
    
    if(_value < _min) return _min;
    if(_value > _max) return _max;
    return _value;
}

//###############################################################################################################
//###############################################################################################################

function clear_chart() {
    
    for(let i = 0; i < global_chart_x; i++)
        for(let j = 0; j < global_chart_y; j++)
            chart[j][i] = " ";
}

//###############################################################################################################
//###############################################################################################################

function print_chart() {
    
    //console.clear();
    console.log("    [a] [b] [c] [d] [e] [f] [g] [h] [i] [j] [k] [l]");
    
    for(let i = 0; i < global_chart_y; i++) {
        in_line_string += ("[" + (i+1) + "] ");
        for(let j = 0; j < global_chart_x; j++) in_line_string += ("[" + chart[j][i] + "] ");
        console.log(in_line_string);
        in_line_string = "";
    }
}

//###############################################################################################################
//###############################################################################################################

function chart_fill_random() {
    
    let rx = 0, ry = 0, _aux_cont = 0;

    do{
        rx = random_range(0, global_chart_x - 1);
        ry = random_range(0, global_chart_y - 1);
        ++_aux_cont;
        if(_aux_cont > (global_chart_x * global_chart_y * 2)) return "err";

    } while( chart[rx] !== undefined && chart[rx][ry] !== " " );

    chart[rx][ry] = "x";
    // console.log(++debug,"new x:", rx, ry);
    return [rx, ry];
}

//###############################################################################################################
//###############################################################################################################

function create_ship(_len){
    
    let _aux = chart_fill_random();

    if(_aux == "err"){
        error_string += "Can't create ship! Try again with a bigger chart \u000a";
        show_error();

        console.log(_len, num_yachts, num_ships, num_cruisers);

        switch(_len){
            case 2: const obj_data1 = document.querySelector("#info-yachts");
                obj_data1.innerText = --num_yachts;
                if(num_yachts <= 0) obj_data1.style.textDecoration = "line-through";
                break;
            case 3: const obj_data2 = document.querySelector("#info-ships");
                obj_data2.innerText = --num_ships;
                if(num_ships <= 0) obj_data2.style.textDecoration = "line-through";
                break;
            case 4: const obj_data3 = document.querySelector("#info-cruisers");
                obj_data3.innerText = --num_cruisers;
                if(num_cruisers <= 0) obj_data3.style.textDecoration = "line-through";
                break;
        }

        console.log(_len, num_yachts, num_ships, num_cruisers);

    }
    else ship[ship.length] = [_aux[0], _aux[1], _len];
    // Añadir un barco con [X, Y, tamaño/vida]
}

//###############################################################################################################
//###############################################################################################################

function show_error(){
    
    const obj_err = document.querySelector("#error");
    // obj_err.innerText = error_string;
    // console.log(error_string);
    console.log("error");
}

//###############################################################################################################
//###############################################################################################################

function start_game(){

    // Comenzar a desarrollar los barcos
    //let ship_len = ship.length;
    for(let id = 0; id < ship.length; id++){

        // Escoger el barco
        let _xx = ship[id][0],
            _yy = ship[id][1],
            _len = ship[id][2];
            _dir = random_range(1, 4);
        let free_place = true;
        chart[_xx][_yy] = id;
        let _aux = 1;
        let _coords = [];
        let _cont = 0;

        do{ // Buscar cómo organizarlo
            _cont ++;
            if(_dir > 4) _dir = 1;
            if(_dir < 1) _dir = 4;

            _coords.fill(null);
            _aux = 1;
            free_place = true;
            if(_dir == 2 || _dir == 3) _aux = -1;

            // Horizontal
            if(_dir == 1 || _dir == 2){
            
                for(let i = 1; i < _len; i++){
                    const tt = (_xx + (i * _aux));
                    if( chart[tt] != undefined && chart[tt][_yy] === " ") _coords[i] = [tt, _yy];
                    else {
                        free_place = false;
                        //console.log("id: "+id+" dir: "+_dir); //#########################################
                        //console.log("Colisión en: "+tt+", "+_yy);
                        _coords.fill(null);
                        break;
            }   }   }
            else{ //Vertical
                for(let i = 1; i < _len; i++){
                    const tt = (_yy + (i * _aux));
                    if( chart[_xx][tt] != undefined && chart[_xx][tt] === " ") _coords[i] = [_xx, tt];
                    else {
                        free_place = false;
                        //console.log("id: "+id+" dir: "+_dir); //#########################################
                        //console.log("Colisión en: "+_xx+", "+tt);
                        _coords.fill(null);
                        break;
            }   }   }

            _dir ++;

            // Si hay espacio libre
            if(free_place){
                for(let i = 1; i < _len; i++){
                    if(chart[_coords[i][0]][_coords[i][1]] === " ") chart[_coords[i][0]][_coords[i][1]] = id;
                    else chart[_coords[i][0]][_coords[i][1]] = "+";
                }
            }

        } while(_cont < 5 && !free_place) // Parar hasta que se haya colocado o se haya quedado atrapado (error)

        if(_cont > 4) {
            console.log("Error");
            /*  // Escoger el barco
                let _xx = ship[id][0],
                    _yy = ship[id][1],
                    _len = ship[id][2];
                    _dir = random_range(1, 4);
                let free_place = true;
                chart[_xx][_yy] = id;
                let _aux = 1;
                let _coords = [];
                let _cont = 0;      */
            console.log(`ID: ${id}, X: ${_xx}, Y: ${_yy}, Len:${_len}`);
            chart[_xx][_yy] = " ";
            print_chart();
            switch(_len){
                case 2: const obj_data1 = document.querySelector("#info-yachts");
                    obj_data1.innerText = --num_yachts;
                    if(num_yachts <= 0) obj_data1.style.textDecoration = "line-through";
                    break;
                case 3: const obj_data2 = document.querySelector("#info-ships");
                    obj_data2.innerText = --num_ships;
                    if(num_ships <= 0) obj_data2.style.textDecoration = "line-through";
                    break;
                case 4: const obj_data3 = document.querySelector("#info-cruisers");
                    obj_data3.innerText = --num_cruisers;
                    if(num_cruisers <= 0) obj_data3.style.textDecoration = "line-through";
                    break;
            }
            ship.splice(id, 1);
            --id;
            error_string += "Can't place ship! Try again with a bigger chart \u000a";
            show_error();
        }
    }
}

//###############################################################################################################
//###############################################################################################################

function say_time(_display){

    let timestop = performance.now();

    let _mil = Math.floor(timestop - timeprev);
    let _seg = Math.floor((_mil / 1000) % 60);
    let _min = Math.floor((_mil / 1000) / 60);
    _mil = Math.floor(_mil % 1000);

    // console.log(_mil, _seg, _min);

    let _time_string = "";
    _time_string += _min < 10 ? "0"+_min+":" : _min+":";
    _time_string += _seg < 10 ? "0"+_seg+"." : _seg+".";
    _time_string += _mil < 100? "0"      : "";
    _time_string += _mil < 10 ? "0"+_mil : _mil;

    // console.log(_time_string);

    if(_display !== undefined) _display.innerText = "Time: "+_time_string;

    return _time_string;
}

//###############################################################################################################
//###############################################################################################################

function create_chart(){

    // const obj_chart = document.querySelector("#chart");
    const obj_chart = document.querySelector("#chart");


    for(let i = 0; i < global_chart_y; i++) {

        for(let j = 0; j < global_chart_x; j++) {
            const obj_square = document.createElement("button");

            obj_square.classList.add("square");
            const _id = chart[j][i];
            //obj_square.innerText = _id;
            obj_square.name = "canclick";
            if(squares_id[_id] === undefined) squares_id[_id] = [];
            squares_id[_id] = [...squares_id[_id], obj_square];

            if(_id === " "){
                obj_square.addEventListener("click", function test() {

                    start_time();

                    if(missiles > 0){
                        current_points -= missiles;
                        show_score();

                        const obj_missiles = document.querySelector("#info-missiles");
                        obj_square.style.backgroundColor = "var(--color-fail-red)";

                        if(missiles <= 10) obj_missiles.innerHTML = `0${--missiles}`;
                        else obj_missiles.innerHTML = --missiles;

                        obj_square.name = "clicked";
                        if(missiles <= 0){
                            const _win = document.querySelector("#status");
                            _win.style.color = "red";
                            _win.innerText = "You Lose!"; //\u000aTime: "+say_time();
                            window.clearInterval(interval_id);
                            display.style.color = "#009688";
                            display.style.fontStyle = "italic";

                            current_points -= Math.floor((performance.now() - timeprev)/600);
                            show_score();

                            for(let i = 0; i < squares_id.length; i++){
                                for(let _sqr of squares_id[i]){
                                    _sqr.style.backgroundColor = "var(--color-reveal-purple)";
                                }
                            }
                        }

                        obj_square.removeEventListener("click", test);
                    }
                });
            }
            else{
                obj_square.addEventListener("click", function test() {

                    start_time();

                    if(missiles > 0){
                        //const obj_missiles = document.querySelector("#info-missiles");
                        obj_square.style.backgroundColor = "var(--color-hit-yellow)";
                        // missiles--;
                        // obj_missiles.innerHTML = `Missiles left: ${missiles}`;
                        obj_square.name = "clicked";

                        // hit & color when done
                        ship[_id][2] -= 1;
                        if(ship[_id][2] <= 0){
                            let _aux_cont = 0;

                            for(let _sqr of squares_id[_id]){
                                _aux_cont++;
                                _sqr.style.backgroundColor = "var(--color-hit-green)";
                            }

                            current_points += (150 - (missiles - global_missiles_max))*(5-_aux_cont);
                            show_score();

                            switch(_aux_cont){
                                case 2: const obj_data1 = document.querySelector("#info-yachts");
                                    obj_data1.innerText = --num_yachts;
                                    if(num_yachts <= 0) obj_data1.style.textDecoration = "line-through";
                                    break;
                                case 3: const obj_data2 = document.querySelector("#info-ships");
                                    obj_data2.innerText = --num_ships;
                                    if(num_ships <= 0) obj_data2.style.textDecoration = "line-through";
                                    break;
                                case 4: const obj_data3 = document.querySelector("#info-cruisers");
                                    obj_data3.innerText = --num_cruisers;
                                    if(num_cruisers <= 0) obj_data3.style.textDecoration = "line-through";
                                    break;
                            }

                            if(num_cruisers === 0 && num_ships === 0 && num_yachts === 0){
                                const _win = document.querySelector("#status");
                                _win.style.color = "yellow";
                                _win.innerText = "You Win!"; //\u000aTime: "+say_time();
                                window.clearInterval(interval_id);
                                display.style.color = "#2196F3";
                                display.style.fontStyle = "italic";

                                current_points -= Math.floor((performance.now() - timeprev)/600);
                                current_points += 1000;
                                show_score();

                                save_score();
                                missiles = 0;
                            }
                        }

                        obj_square.removeEventListener("click", test);
                    }
                });
            }

            obj_chart.appendChild(obj_square);
        }
    }
}

//###############################################################################################################
//###############################################################################################################

function show_score(){

    current_points = Math.floor(current_points);
    obj_points.innerText = "Points: "+current_points+" High: "+global_highscore;
}

//###############################################################################################################
//###############################################################################################################

function save_score(){

    if(current_points > global_highscore){
        localStorage.setItem("global_highscore", current_points);
        obj_points.innerText = "Points: "+current_points+" new record!";}
}

//###############################################################################################################
//###############################################################################################################

function reset_all(){

    // Variables
    global_chart_x = JSON.parse(localStorage.getItem("global_chart_x"), 10);
    global_chart_y = JSON.parse(localStorage.getItem("global_chart_y"), 10);
    global_missiles_max = JSON.parse(localStorage.getItem("global_missiles_max"), 10);

    global_yachts_max = JSON.parse(localStorage.getItem("global_yachts_max"), 10);
    global_ships_max = JSON.parse(localStorage.getItem("global_ships_max"), 10);
    global_cruisers_max = JSON.parse(localStorage.getItem("global_cruisers_max"), 10);

    global_highscore = JSON.parse(localStorage.getItem("global_highscore"), 10);

    error_string = "";
    total_score = 0;

    if(global_chart_x === null) global_chart_x = 8;
    if(global_chart_y === null) global_chart_y = 8;
    if(global_missiles_max === null) global_missiles_max = 15;

    if(global_yachts_max === null) global_yachts_max = 1;
    if(global_ships_max === null) global_ships_max = 2;
    if(global_cruisers_max === null) global_cruisers_max = 1;

    if(global_highscore === null) global_highscore = 0;

    chart = [];
    chart = new Array(global_chart_x).fill(" ").map(()=>new Array(global_chart_y).fill(" "));
    in_line_string = "";
    // letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    ship = [];
    squares_id = [];
    missiles = global_missiles_max;

    num_yachts = global_yachts_max;
    num_ships = global_ships_max;
    num_cruisers = global_cruisers_max;

    display = null;
    obj_points = null;
    current_points = null;

    timeprev = 0;

    if((global_cruisers_max + global_ships_max + global_yachts_max) == 0){
        num_yachts = 1;
        global_yachts_max = 1;
        localStorage.setItem("global_yachts_max", num_yachts);
    }

    // LOAD CONTENT
    let obj_load = document.querySelector("#yachts");
    obj_load.value = global_yachts_max;
    obj_load = document.querySelector("#ships");
    obj_load.value = global_ships_max;
    obj_load = document.querySelector("#cruisers");
    obj_load.value = global_cruisers_max;
    obj_load = document.querySelector("#missiles");
    obj_load.value = global_missiles_max;
    obj_load = document.querySelector("#chart-x");
    obj_load.value = global_chart_x;
    obj_load = document.querySelector("#chart-y");
    obj_load.value = global_chart_y;

    // Show Info
    obj_load = document.querySelector("#info-missiles");
    obj_load.style.color = "rgb(168, 2, 2)";
    if(missiles < 10) obj_load.innerText = `0${missiles}`;
    else obj_load.innerText = missiles;

    obj_load = document.querySelector("#status");
    obj_load.innerText = "";

    obj_load = document.querySelector("#info-yachts");
    obj_load.style.textDecoration = "none";
    obj_load.innerText = num_yachts;
    if(num_yachts <= 0) obj_load.style.textDecoration = "line-through";
    
    obj_load = document.querySelector("#info-ships");
    obj_load.style.textDecoration = "none";
    obj_load.innerText = num_ships;
    if(num_ships <= 0) obj_load.style.textDecoration = "line-through";

    obj_load = document.querySelector("#info-cruisers");
    obj_load.style.textDecoration = "none";
    obj_load.innerText = num_cruisers;
    if(num_cruisers <= 0) obj_load.style.textDecoration = "line-through";

    obj_points = document.querySelector("#info-points");
    current_points = (global_chart_x * global_chart_y * 10) + (10 * 150 / global_missiles_max);
    show_score();

    // Clear previous chart
    const obj_column_childs = document.querySelectorAll("div.chart-column > *");
    for(let _item of obj_column_childs) _item.remove();

    const obj_row_childs = document.querySelectorAll("div.chart-row > *");
    for(let _item of obj_row_childs) _item.remove();

    const obj_chart_childs = document.querySelectorAll("div#chart > *");
    for(let _item of obj_chart_childs) _item.remove();

    // Rewrite CSS variables
    var html = document.querySelector("html");
    html.style.setProperty("--square-size", `calc((100vh / ${Math.max(global_chart_x, global_chart_y) + 1}))`);
    html.style.setProperty("--chart-size" , `calc(100vh - var(--square-size))`);
    html.style.setProperty("--chart-hsize", `calc((${global_chart_x} * var(--square-size) ))`);
    html.style.setProperty("--chart-vsize", `calc((${global_chart_y} * var(--square-size) ))`);

    // Create rows and columns
    // const obj_chart_container = document.querySelector(".chart-size");
    const obj_row = document.querySelector(".chart-row");
    for(let i = 1; i <= global_chart_x; i++){
        
        const obj_span = document.createElement("span");
        obj_span.classList.add("bold-text", "square-size");
        obj_span.innerText = letters[i - 1];
        obj_row.appendChild(obj_span);
    }
    
    const obj_column = document.querySelector(".chart-column");
    for(let i = 1; i <= global_chart_y; i++){
    
        const obj_span = document.createElement("span");
        obj_span.classList.add("bold-text", "square-size");
        obj_span.innerText = i;
        obj_column.appendChild(obj_span);
    }
    
    console.clear();

    // Timer stuff
    display = document.querySelector("#info-time");
    display.style.fontStyle = "normal";
    display.style.color = "rgb(20, 175, 14)";
    display.innerText = "00:00.000"
    window.clearInterval(interval_id);
    interval_id = null;
}

//###############################################################################################################
//###############################################################################################################

function start_time(){

    if(interval_id === null){
        interval_id = window.setInterval(say_time, 10, display);
        timeprev = performance.now();
    }
}

//###############################################################################################################
//###############################################################################################################

function reset_game(){

    for(let i = 0; i < global_cruisers_max; i++)   create_ship(4);
    for(let i = 0; i < global_ships_max; i++)      create_ship(3);
    for(let i = 0; i < global_yachts_max; i++)     create_ship(2);

    print_chart();

    start_game();
    print_chart();
    create_chart();
}

//###############################################################################################################
//###############################################################################################################

function color_scheme() {
    const obj_color_scheme = document.querySelector("#button-color");
    obj_color_scheme.innerText = colors_palette[current_color];
}

//###############################################################################################################
//###############################################################################################################

function music_scheme(_action, _value) {

    if(_action == "change"){

        music_queue[current_music].pause();
        
        current_music += _value;
        if(current_music < 0) current_music = music_queue.length - 1;
        if(current_music > music_queue.length - 1) current_music = 0;

        music_queue[current_music].play();
        music_queue[current_music].loop = true;
    }

    if(_action == "start"){
        if(music_queue[current_music].paused) music_queue[current_music].play();
        else music_queue[current_music].pause();
    }

    const obj_music_scheme = document.querySelector("#button-music");
    obj_music_scheme.innerText = music_track[current_music];

    const obj_volume_slider = document.querySelector("#volume-slider");
    music_queue[current_music].volume = (obj_volume_slider.value / 100);

}

//###############################################################################################################
//###############################################################################################################

let global_chart_x, global_chart_y, global_missiles_max;
let global_yachts_max, global_ships_max, global_cruisers_max;
let global_highscore, error_string, total_score;

let chart, in_line_string;
let letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
let colors_palette = ["Supernavy", "Lava World", "M", "Lavander", "Neon", "Toxic"];
let music_track = ["Dream Speedrun Music", "New Main", "Morituros", "Track 4"];

let music_queue = [new Audio("./music/track1.mp3"), new Audio("./music/track2.ogg"), new Audio("./music/track3.ogg")];

let current_color = 0, current_music = 0;
let ship, squares_id, missiles;
let num_yachts, num_ships, num_cruisers;

let interval_id, display, obj_points, current_points;
let timeprev;

/*//
    Si aciertas un barco, te suma (5 - _len), de forma que los más chicos son los que más te dan puntos (5 - 2) = 3 puntos

    Entre menos misiles utilices y con menos misiles empieces, mejor

        Fallar resta puntos, y entre más lleves, más resta
        puntos -= (missiles * cantidad); 

        Un tablero grande trae mayor puntos
        (global_chart_x * global_chart_y) * (150 / global_missiles_max);

        puntos -= tiempo;

//*/

document.addEventListener("DOMContentLoaded", () => {

    reset_all();
    color_scheme();
    music_scheme();

    // NEW GAME BUTTON
    const obj_button_newGame = document.querySelector("#new-game-button");
    obj_button_newGame.addEventListener("click", () => {
        
        let obj_custom_option = document.querySelector("#yachts");
        let _option_val = 1 * boundaries(0, obj_custom_option.value, 5);
        localStorage.setItem("global_yachts_max", _option_val);
        
        obj_custom_option = document.querySelector("#ships");
        _option_val = 1 * boundaries(0, obj_custom_option.value, 5);
        localStorage.setItem("global_ships_max", _option_val);
        
        obj_custom_option = document.querySelector("#cruisers");
        _option_val = 1 * boundaries(0, obj_custom_option.value, 5);
        localStorage.setItem("global_cruisers_max", _option_val);

        obj_custom_option = document.querySelector("#missiles");
        _option_val = 1 * boundaries(1, obj_custom_option.value, 150);
        localStorage.setItem("global_missiles_max", _option_val);

        obj_custom_option = document.querySelector("#chart-x");
        _option_val = 1 * boundaries(3, obj_custom_option.value, 12);
        localStorage.setItem("global_chart_x", _option_val);

        obj_custom_option = document.querySelector("#chart-y");
        _option_val = 1 * boundaries(3, obj_custom_option.value, 12);
        localStorage.setItem("global_chart_y", _option_val);

        reset_all();
        reset_game();
    });

    // const obj_save_button = document.querySelector("#save-button");
    // obj_save_button.addEventListener("click", () => {
 
    // });

    // DEFAULT BUTTON
    const obj_default_button = document.querySelector("#default-button");
    obj_default_button.addEventListener("click", () => {

        localStorage.setItem("global_chart_x", "8");
        localStorage.setItem("global_chart_y", "8");
        localStorage.setItem("global_missiles_max", "15");

        localStorage.setItem("global_yachts_max", "1");
        localStorage.setItem("global_ships_max", "2");
        localStorage.setItem("global_cruisers_max", "1");

        reset_all();
        reset_game();
    });

    // RANDOM BUTTON
    const obj_button_random = document.querySelector("#random-button");
    obj_button_random.addEventListener("click", () => {

        if(missiles > 0){
            const ran_square = document.querySelectorAll('button.square[name="canclick"]');    
            ran_square[random_range(0, ran_square.length - 1)].click();}
    });

    // COLORS BUTTONS --
    const obj_button_color_minus = document.querySelector("#button-color-minus");
    obj_button_color_minus.addEventListener("click", () => {

        current_color--;
        if(current_color < 0) current_color = colors_palette.length - 1;

        color_scheme();

    });

    // COLORS BUTTONS ++
    const obj_button_color_plus = document.querySelector("#button-color-plus");
    obj_button_color_plus.addEventListener("click", () => {

        current_color++;
        if(current_color > colors_palette.length - 1) current_color = 0;

        color_scheme();

    });

    // MUSIC BUTTONS --
    const obj_button_music_minus = document.querySelector("#button-music-minus");
    obj_button_music_minus.addEventListener("click", () => {

        music_scheme("change", -1);

    });

    // MUSIC BUTTONS ++
    const obj_button_music_plus = document.querySelector("#button-music-plus");
    obj_button_music_plus.addEventListener("click", () => {

        music_scheme("change", 1);

    });

    // MUSIC PLAY / STOP BUTTON
    const obj_button_music = document.querySelector("#button-music");
    obj_button_music.addEventListener("click", () => {

        music_scheme("start", 0);

    });

    // MUSIC SLIDER
    const obj_volume_slider = document.querySelector("#volume-slider");
    obj_volume_slider.addEventListener("change", () => {

        music_scheme("volume", obj_volume_slider.value);

    });

    reset_game();
});