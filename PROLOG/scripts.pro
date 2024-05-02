/**############################################################################
 * Part of this code was taken and adapted from GitHub
 * https://github.com/dtonhofer/prolog_notes/blob/master/code/various/input_into_dict.pl
 * Special thanks to David Tonhofer.
 * 
 * ronerycoder@gluino.name says this is licensed under
 * https://opensource.org/licenses/0BSD
 * 
 * Modified and adapted by
 * brianwoolfolk@hotmail.com
 * ############################################################################*/
% EXPORT MODULE
% :- module(scripts,[end/0,await/0,use_file/2,use_file/1]).

% CURRENT PATH use dynamic user:~
:- dynamic user:current_folder/1.

% SET ENCODING UTF8
:- set_flag(encoding, utf8).
:- encoding(utf8).

/**############################################################################
 * GET PATH FROM WORKING DIRECTORY
 * Similar a importar modulos, pero con todo el archivo.
 * Lee el archivo desde el `pwd`.
 * 
 * use_file(+File_name) is det.
 * ############################################################################*/
use_file(File_name) :-
  working_directory(PWD, PWD),
  format(atom(Path), "~sPROLOG/~s.pro", [PWD, File_name]) -> [Path].
%

/**############################################################################
 * GET PATH FROM CURRENT FOLDER
 * Similar a importar modulos, pero con todo el archivo.
 * Si el Folder es 'true' entonces lee desde el `current_folder`.
 * Sino, lee el archivo desde el `pwd` + Folder.
 * 
 * use_file(+File_name, +Folder) is det.
 * ############################################################################*/
% Leer desde el `current_folder`.
use_file(File_name, true) :-
  working_directory(PWD, PWD),
  user:current_folder(Curr),
  (format(atom(Path), "~sPROLOG/~s~s.pro", [PWD, Curr, File_name]) -> [Path]),
  !.
% Leer desde el Folder otorgado.
use_file(File_name, Folder) :-
  working_directory(PWD, PWD),
  format(atom(Path), "~sPROLOG/~s~s.pro", [PWD, Folder, File_name]) -> [Path].
%

/**############################################################################
 * Espera a que el usuario pulse ENTER para continuar con el proceso.
 * 
 * await/0 is det.
 * ############################################################################*/
await :- format("\n\nPress ENTER to continue..."), read_string(user_input, "\n", "\t ", _, _).

/**############################################################################
 * Espera a que el usuario pulse ENTER para finalizar el programa.
 * 
 * end/0 is det.
 * ############################################################################*/
end :- format("\n\nPress ENTER to exit..."), read_string(user_input, "\n", "\t ", _, _), halt.

/**############################################################################
 * Funcion utilizada dentro de `foldl/4` para mostrar una lista.
 * Imprime contando desde el 1 hasta N.
 * 
 * Si se usa como `show_list/1` va a imprimir todos los elementos de la List
 * de forma recursiva con `show_list/3`. En caso de que la List no sea una
 * lista, entonces primero la convierte en lista usando `findall/3`.
 * 
 * show_list(+List|Category) is semi-det.
 * ############################################################################*/
% Si le pasamos una lista de elementos, entonces...
show_list(List) :-
  is_list(List), % Verificamos que sea lista
  % Iteramos para cada elemento de List, ejecutando `show_list/3` iniciando en 1.
  foldl(show_list, List, 1, _), !.
% Si en lugar de pasarle una lista, le pasamos una categoria, entonces...
show_list(Category) :-
  % Busca todas las X tal que `Category(X)` exista, luego genera una lista.
  findall(X, call(Category, X), List),
  show_list(List). % Muestra la lista creada
% Predicado para imprimir un elemento atomico. Se usa mediante `show_list/1`.
show_list(Element, Count, Next) :-
  % Llenamos con " " + Count hasta la posicion 6, luego ponemos el Element.
  format("~` t~w~6|.- ~q~n", [Count, Element]),
  Next is Count+1. % Sumar el contador.
%

/**############################################################################
 * Simula el comportamiento de 'Akinator'. Ingresa una categoria que contenga
 * registros unicos como `Category(X)` y Akinator primero generara una lista
 * de todos los elementos existentes dentro de Category y la revisa paso a
 * paso hasta encontrar la primera respuesta valida cuando se ejecute X/0.
 * 
 * No basta con que exista `Category(X)` sino que tambien debe existir un
 * `X/0` de la forma
 *    X :- <logic>.
 * El predicado `hypothesize/2` verifica una hipotesis mediante `call(X)`.
 * 
 * Es identico en esencia al predicado `hypothesize/2`, pero primero crea la
 * lista a partir de la categoria marcada.
 * 
 * akinator(+Category, -Response) is det.
 * ############################################################################*/
akinator(Category, Response) :-
  findall(X, call(Category, X), List),
  hypothesize(List, Response).
%

/**############################################################################
 * Predicado recursivo que ayuda a `akinator/2` en su proceso logico.
 * 
 * Revisa de una lista de Xs hasta obtener la primera donde `call(Xn)` == true.
 * Para esto, es necesario que todas las X cuenten con una definicion `X/0`:
 *    Xn :- <logic> ; true ; read() ; etc.
 * 
 * En caso de encontrar una directiva positiva, regresa la X de dicha directiva.
 * Response = first `ItemN` where `call(ItemN) == true`.
 * 
 * En caso de no encontrar ninguna directiva positiva, Response = 'unknown'.
 * 
 * hypothesize(+List, -Response) is det.
 * ############################################################################*/
% Si ya no hay mas elementos de la lista, regresamos 'unknown'.
hypothesize([], unknown) :- !.
% Tomamos el primer elemento de la lista (Item) y lo ejecutamos.
hypothesize([Item|Rest], Response) :-
  % Si funciona Item, cortamos el proceso y regresamos como Response.
  call(Item), !, Response=Item
  % Si no funciono, entonces seguimos intentando con el resto de la lista.
  ; hypothesize(Rest, Response).
%

/**############################################################################
 * Indica si el valor se encuentra dentro de los valores permitidos del campo
 * seleccionado. Si el campo no existe, o el valor no es admitido, entonces
 * marca un error en consola y falla.
 * 
 * allowed(+ID, +Value) is multi.
 * ############################################################################*/
allowed(ID, Value) :-
  (
    % Verificar que el campo exista, y obtenemos su lista de admitidos.
    q(ID, _, AllowedList, _),
    (
      (
        % Verificar que el valor sea admitido (o que no haya restriccion).
        (AllowedList == [] ; memberchk(Value, AllowedList)),
        ! % En cuanto funcione algo de lo anterior, nos salimos para no considerar otras opciones.
      ) ; (
        % Error, no se permite el valor ingresado.
        format(string(Msg), "El valor ~q no es válido para ~q (los válidos son ~q)", [Value, ID, AllowedList]),
        throw(Msg)
      )
    )
  ) ; (
    % El campo no existe, entonces marcamos error.
    format(string(Msg), "No existe una pregunta para ~q", [ID]),
    throw(Msg)
  ).
%

/**############################################################################
 * Similar a `allowed/2`, pero con una lista de valores otorgados.
 * Verifica uno a uno los campos mediante `allowed/2` recursivamente.
 * 
 * all_allowed(+ID, ?[Values]) is multi.
 * ############################################################################*/
% Si nada mas es el nombre del campo, verificamos si permite cualquier valor.
all_allowed(ID) :- q(ID, _, [], _), !.
% Si la lista esta vacia se permite cualquier valor.
all_allowed(ID, []) :- allowed(ID, _), !.
% Verificar uno a uno los valores, y los demas de forma recursiva.
all_allowed(ID, [Value | Values]) :- 
  allowed(ID, Value),
  all_allowed(ID, Values).
%

/**############################################################################
 * Representa las preguntas que se pueden hacer al usuario. Todos los IDs deben
 * ser diferentes, los mensajes deben ser String y se permite usar una lista de
 * opciones permitidas asi como una respuesta default.
 * 
 * Para poder admitir cualquier valor, se usa [].
 * Para que no exista un valor default, se usa ''.
 * En caso de que el valor default no exista dentro de la lista, no se considera.
 * 
 * q(+ID, +Message:String, +AllowedList:List, +Default) is det.
 * ############################################################################*/
:- multifile q/4.
% q(name           , "what is subject name?"                     , []                    , '')        .
% q(patient_risk   , "what is patient risk?"                     , [high, medium, low]   , medium)    .
% q(condition_time , "how long have they had the condition for?" , [months, weeks, days] , weeks)     .
% q(clinical_trial , "is the trial justifiable?"                 , [yes, no]             , yes)       .
% q(antibody_count , "what is their antibody count?"             , [high, medium, low]   , medium)    .
% q(life_style     , "how do they live?"                         , [sedentary, active]   , sedentary) .
% q(anaemia_state  , "do they have anaemia?"                     , [yes, no]             , no)        .
% q(blood_pressure , "is their blood pressure raised?"           , [yes, no]             , no)        .

/**############################################################################
 * Crea un diccionario vacio con el nombre `newdict{}` para ir preguntando y
 * recuperando las respuestas a todas las preguntas `q/4` que existan.
 * Una vez finalizado, regresa el diccionario generado mediante `DictOut`.
 * 
 * ask_all(?DictIn, -DictOut) is det.
 * ############################################################################*/
% Utilizando `newdict{}`.
ask_all(DictOut) :- ask_all(newdict{}, DictOut).
% Permite ingresar un diccionario personalizado.
ask_all(DictIn, DictOut) :-
  % Verificamos rapidamente que sea un diccionario.
  is_dict(DictIn),
  % Agarramos todas las preguntas `q/4` y las metemos en una lista.
  bagof(q(ID, M, L, D), q(ID, M, L, D), QuestionsList),
  % Ejecutamos `ask_question` para cada elemento de la lista (iniciando desde DictIn para obtener DictOut).
  foldl(ask_question, QuestionsList, DictIn, DictOut).
%

/**############################################################################
 * Agarra un predicado `q/4` con todos sus campos para preguntarlo al usuario.
 * Utiliza DictIn para agregarle la respuesta a la pregunta y lo regresa como
 * DictOut.
 * 
 * ask_question(+q(ID, Message, AllowedList, Default), +DictIn, -DictOut) is det.
 * ############################################################################*/
ask_question(q(ID, Message, AllowedList, Default), DictIn, DictOut) :-
  % Obtenemos la respuesta del usuario.
  obtain_from_user(Message, AllowedList, Default, Obtained, Quit),
  (
    % Si el usuario quiere salir, salimos.
    (Quit == true) -> fail
    % Sino, modificamos el diccionario y lo regresamos como `DictOut`.
    ; put_dict(ID, DictIn, Obtained, DictOut)
  ).
%

/**############################################################################
 * Muestra un mensaje `Message` para obtener una respuesta del usuario.
 * Cuenta con una lista de valores admitidos y un valor default en caso de que
 * el usuario ingrese "".
 * Finalmente, tambien cuenta con la posibilidad de salir de la pregunta si
 * el usuario ingresa 'q'|'quit'|'exit'.
 * 
 * obtain_from_user(+Message, +AllowedList, +Default, -Obtained, -Quit) is det.
 * ############################################################################*/
obtain_from_user(Message, AllowedList, Default, Obtained, Quit) :-
  % Mostrar el mensaje.
  format("~n> ~s", [Message]),
  % En caso de que existan restricciones, se imprimen.
  (is_nonempty_list(AllowedList) -> format(" (selecciona: ~q)", [AllowedList]) ; true),
  % En caso de que exista un valor default, se imprime.
  (is_valid_default(Default, AllowedList) -> format(" (default: ~q)", [Default]) ; true),
  % Imprime un salto de linea.
  format("~n"),
  (
    (
      % Leer string hasta un \n, omitiendo \t al inicio y final.
      read_string(user_input, "\n", "\t ", _, RawInput),
      % Verificar si la respuesta es valida.
      valid(AllowedList, Default, RawInput, Obtained, Quit), !
    )
    % La respuesta no es valida, entonces se pregunta otra vez.
    ; obtain_from_user(Message, AllowedList, Default, Obtained, Quit)
  ).
%

/**############################################################################
 * Revisa si un valor Default es valido, ya sea porque es diferente a '' y
 * porque no existen restricciones, o si existen pero si las cumple.
 * 
 * is_valid_default(+Default, +AllowedList) is semi-det.
 * ############################################################################*/
% Default no existe.
is_valid_default('', _) :- !, fail.
% Default existe y no hay restricciones.
is_valid_default(Default, []) :- \+ empty_stringy(Default), !.
% Default existe y entra en las restricciones.
is_valid_default(Default, AllowedList) :-
  \+ empty_stringy(Default),
  memberchk(Default, AllowedList).
%

/**############################################################################
 * Procesa la respuesta del usuario y la valida segun una lista de valores
 * permitidos, un valor default en caso de no ingresar nada e incluso la
 * posibilidad de salir de la pregunta si el usuario ingresa 'q'|'quit'|'exit'.
 * 
 * valid(+AllowedList, +Default, +Input, -Obtained, -Quit) is semi-det.
 * ############################################################################*/
% Input "", entonces usamos Default (si hay) y cerramos.
valid(AllowedList, Default, "", Default, false) :-
  is_valid_default(Default, AllowedList), !
  ; (!, fail).
% Input es 'q'|'quit'|'exit', entonces marcamos que quiere salir.
valid(_, _, Input, '', true) :-
  string_lower(Input, InputLower),
  % Buscamos si el string es uno de la lista (sin importar cual exactamente).
  stringy_membercheck(InputLower, ["q", "quit", "exit"], _), !.
% Input =\= "" y se acepta cualquier cosa.
valid([], _, Input, Input, false) :- !.
% Input es un valor de la lista de validos.
valid(AllowedList, _, Input, Obtained, false) :-
  string_lower(Input, InputLower),
  % Buscamos si el string existe dentro de AllowedList (y recogemos el que coincida).
  stringy_membercheck(InputLower, AllowedList, Obtained), !.
% Input no es un valor valido de la lista, marcamos error y advertencia.
valid(AllowedList, _, Input, _, _) :-
  string_lower(Input, InputLower),
  format("~q no es una respuesta válida ~q~n", [InputLower, AllowedList]),
  fail.
%

/**############################################################################
 * Similar al `memberchk/2` pero buscando Strings. Vincula un Atomo con un String
 * usando `atom_string/2` y recorre la lista hasta que encuentra uno que coincida.
 * Si se ingresa un String, regresa un Atom, y viceversa.
 * 
 * stringy_membercheck(+Select, +ListOfStringyThings, -Found) is det.
 * ############################################################################*/
% La representacion de String de lo que seleccionamos existe dentro de la lista.
stringy_membercheck(Select, [Stringy | _], Stringy) :-
  atom_string(Select, Stringy), !.
% Sino existe, seguimos intentando recursivo con el resto de elementos.
stringy_membercheck(Select, [_ | Stringies], Found) :-
  stringy_membercheck(Select, Stringies, Found).
%

/**############################################################################
 * Verifica si una variable es una lista, y que ademas contiene algo dentro.
 * 
 * is_nonempty_list(+List) is semi-det.
 * ############################################################################*/
is_nonempty_list(L) :- L=[_|_], is_list(L).
  
/**############################################################################
 * Verifica si una variable es un string vacio, pero primero revisa a ver si
 * ya tiene algo dentro o no (porque undefined =\= "").
 * 
 * empty_stringy(+String) is semi-det.
 * ############################################################################*/
empty_stringy(S) :- var(S), !, fail.
empty_stringy(S) :- atom_string(S, ""), !.

% ==========================================================================
% The following predicates belogs to David Tonhofer.
% These are formatting and printing functionalities.
% ==========================================================================
look(SlotName,Values,Dict) :-
  must_be(atom,SlotName),
  must_be(list,Values),
  all_allowed(SlotName,Values),
  get_dict(SlotName,Dict,Actual),  % fails if entry does not exist
  must_be(atom,Actual),            % relax this later
  memberchk(Actual,Values).        % may extract value via unification

punch(SlotName,NewValue,DictIn,OldValue,DictOut) :-
  must_be(atom,SlotName),
  must_be(atom,NewValue), 
  allowed(SlotName,NewValue),
  (get_dict(SlotName,DictIn,OldValue) -> true ; OldValue = ''),
  put_dict(SlotName,DictIn,NewValue,DictOut).

% ====================
% Dict prettyprinting
% ====================

prettyprint_dict(Dict) :-
  bagof(Key-Value, get_dict(Key, Dict, Value), Flat),
  keysort(Flat, FlatSorted),
  max_key_length(FlatSorted, MaxKeyLength),
  build_format_string(MaxKeyLength, FormatString),
  format_dict(FlatSorted, FormatString).
%

max_key_length(Flat, MaxKeyLength) :-
  foldl(
      ([Key-_, FromLeft, ToRight]>>(atom_length(Key, KeyLength), ToRight is max(FromLeft, KeyLength))),
      Flat,
      0,
      MaxKeyLength).
%

build_format_string(MaxKeyLength, FormatString) :-
  FieldWidth is MaxKeyLength+2,
  % set tab ~|, print datum ~a, add tab expanding-filler (will thus left justify) ~t,
  % set next tab stop FieldWidth positions after the previous tab stop ~FieldWidth+,
  % print datum ~a, add tab expanding-filler (will thus left justify) ~t,    
  % set next tab stop 5 positions after the previous tab stop, add newline ~n
  atomics_to_string(['  ~|~a~t~', FieldWidth, '+~a~t~5+~n'], FormatString).
  % format("Format string is: ~q\n",[FormatString]).

format_dict([Key-Value|More], FormatString) :-
  format(FormatString, [Key, Value]),   
  format_dict(More, FormatString).

format_dict([], _).

% ==========================================================================
% End of David Tonhofer's predicates.
% ==========================================================================
