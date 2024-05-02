% IMPORT GLOBAL SCRIPTS
:- ['PROLOG/scripts.pro'].

% SET ENCODING UTF8
:- set_flag(encoding, utf8).
:- encoding(utf8).

% INIT CURRENT PATH
current_folder('Pokemon Game/').
:- use_file('pokedb', true).

/**############################################################################
 * POKEMON IDENTIFICATION GAME
 * 
 * Programa que adivina un pokemon de una lista de 60 pokemones disponibles.
 * 
 * Realiza preguntas de Si y No hasta dar con la respuesta que mejor se adapte.
 * 
 * Para comenzar, ingrese
 *  ?- pokestart.
 * 
 * Para mostrar la lista de pokemones, ingrese
 *  ?- pokelist.
 * ############################################################################*/
:- multifile akinator/2.
% Acceso directo para mostrar toda la lista de animales.
pokelist :-
  format(
"\n~` t~2|+~`=t~48|
~` t~2|| Los animales disponibles son:
~` t~2|+~`=t~48|~n"),
  animal,
  format("~` t~2|+~`=t~48|").

/**############################################################################
 * Iniciar el programa.
 * 
 * Primero, se muestra la intro y se solicita al usuario si esta listo.
 * Si el usuario escribe que no, entonces se corta el programa.
 * 
 * Despues, comienza la hipotesis del pokemon, la conclusion lo imprime y se 
 * revierten los cambios gracias a `undo/0`.
 * ############################################################################*/
pokestart :-
  introduction,
  obtain_from_user("¿Listo?", [si, no], si, Response, Quit),
  (
    (Quit == true ; Response == no) -> fail
    ; format(
"\n~` t~2|+~`-t~64|
~` t~2|| ¡Allá vamos!
~` t~2|+~`-t~64|~n")
  ),
  akinator(animal, Pokemon),
  conclusion(Pokemon, true),
  await,
  undo.
%

/**############################################################################
 * Shortcut para guardar e imprimir el texto considerado como introduccion.
 * Si se ejecuta como `introduction/0` entonces lo imprime directamente.
 * 
 * introduction(?Msg) is det.
 * ############################################################################*/
introduction(
"\n~` t~2|+~`-t~96|
~` t~2|| ¡Hola entrenador!
~` t~2||
~` t~2|| Voy a adivinar el pokémon que estás pensando.
~` t~2|| Te haré preguntas y tú puedes responder con \"si\" o \"no\" según sea el caso.
~` t~2||
~` t~2|| Selecciona un pokémon de la lista y comencemos.
~` t~2|| (Para consultar la lista disponible utiliza ?- pokelist.)
~` t~2|+~`-t~96|~n").
introduction :- introduction(Msg), format(Msg).
intro :- introduction.

/**############################################################################
 * Shortcut para almacenar e imprimir el texto considerado como conclusion.
 * Permite ingresar un Pokemon para imprimirlo dentro del String.
 * 
 * Si lo usamos como `conclusion(Pokemon, true)` entonces en lugar de regresar
 * el String compuesto, directamente lo imprimira.
 * 
 * conclusion(?Pokemon, -Out|true) is det.
 * ############################################################################*/
conclusion(
"\n~` t~2|+~`-t~96|
~` t~2|| ¡Creo lo tengo!
~` t~2||
~` t~2|| Estás pensando en... ¡~s!
~` t~2||
~` t~2|| ¿Adiviné?
~` t~2|+~`-t~96|~n").
conclusion(
"\n~` t~2|+~`-t~96|
~` t~2|| ¡Vaya! No puede descifrar el pokémon que estabas pensando.
~` t~2||
~` t~2|| Parece como si fuera Mew transformado como otro pokémon...
~` t~2||
~` t~2|| ¡Pero no me rendiré! ¿Te animas a jugar otra ronda?
~` t~2|+~`-t~96|~n", failure).
% Caso especial cuando encuentra 'unknown' como pokemon.
conclusion(unknown, _) :- conclusion(Msg, failure), format(Msg), !.
% Imprime directamente la conclusion con el pokemon incrustado.
conclusion(Pokemon, true) :- conclusion(Msg), format(Msg, [Pokemon]), !.
% Genera la conclusion con el pokemon incrustado y lo regresa sin imprimirlo.
conclusion(Pokemon, Out) :- conclusion(Msg), format(atom(Out), Msg, [Pokemon]).
conc :- conclusion(unknown, _).

/**############################################################################
 * Lista de saludos para obtener uno aleatorio. Se elige uno aleatorio y se 
 * imprime usando `format/1`.
 * 
 * saludar(?List) is det.
 * ############################################################################*/
saludar(["¡Ajá!", "Ya veo...", "¡Muy bien!", "Interesante...", "¡Entiendo!"]).
saludar :- saludar(L), random_member(X, L), format(
"\n~` t~2|+~`=t~48|
~` t~2|| ~s
~` t~2|+~`=t~48|~n", [X]).

/**############################################################################
 * How to ask something. Utiliza el metodo `obtain_from_user/5` para recoger
 * una respuesta a una determinada pregunta.
 * 
 * Si la respuesta es positiva, entonces la pregunta se marca como `is_true/1`,
 * pero si es negativa se marca como `is_false/1`.
 * ############################################################################*/
ask(Question) :-
  % Combinar strings
  format(atom(ComposedQ), "Tu pokémon... ~s?", [Question]),
  % Solicitar al usuario una respuesta
  % obtain_from_user(+Message, +AllowedList, +Default, -Response, -Quit).
  obtain_from_user(ComposedQ, [si, s, no, n], no, Response, Quit),
  % Si el usuario quiere salir, cerramos todo; sino entonces saludamos.
  ((Quit == true) -> fail ; saludar),
  (
    % Hacemos las afirmaciones segun si la Response es positiva o no.
    memberchk(Response, [si, s]) -> assertz(is_true(Question))
    ; assertz(is_false(Question)), fail
  ).
%

/**############################################################################
 * How to verify something. Marcamos a `is_true/1` junto con `is_false/1` como
 * predicados dinamicos, es decir porque puede ser que cambien de valor segun
 * hagamos mas preguntas (y porque al inicio no estan definidos).
 * 
 * Con el `verify/1` vamos a ver si el atributo es verdadero, o falso.
 * ############################################################################*/
:- dynamic is_true/1, is_false/1.
verify(Attr) :- (is_true(Attr) -> true ; (is_false(Attr) -> fail ; ask(Attr))).

/**############################################################################
 * Asi como afirmamos todos los atributos segun `is_true/1` junto con
 * `is_false/1`, cuando queramos reiniciar el programa tenemos que eliminar
 * todas esas afirmaciones. `retract/1` es lo opuesto de `assertz/1`.
 * 
 * Al final, se marca cada `undo/0` con fail para que se ejecute el siguiente.
 * ############################################################################*/
undo :- retract(is_true(_)), fail. 
undo :- retract(is_false(_)), fail.
undo. % Este undo no hace nada, solo marca true.
