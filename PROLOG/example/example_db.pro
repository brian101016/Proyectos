:- module(ejemplo, [numero/1, par/1]).

/*
  ############################################################################
  :- module(nombre_modulo, [ definitions/1, etc/2 ]).
  Para exportar este archivo como un modulo bajo un nombre.
  Esto nos permite seleccionar una parte de las definiciones a exportar,
  en lugar de hacer ['path/archivo.pro'] que te agarra todo tal cual.

  ############################################################################
  El ! lo que hace es que elimina todas las posibles respuestas anteriores.
  Por ejemplo, si tenemos:
    par(dos).
    par(cuatro).
    par(seis).
  Cuando hacemos
    ?- par(X).
  Nos regresa el siguiente orden:
    dos ; cuatro ; seis.
  Pero cuando hacemos
    ?- par(X), !.
  Solamente nos regresa el primer resultado:
    dos.
  Porque par(X) busca todas las respuestas que sean verdaderas, y despues
  continua con la coma (,) y encuentra el ! que le hace destruir las alternativas
  almacenadas hasta el momento (los de la izquierda).

  Si hacemos:
    ?- par(X), !, par(Y).
  normalmente se iteraria por todos los X y por todas las Y, pero en este caso se
  toma la primera X, y se detiene la iteracion de X, pero se siguen mostrando todas
  las iteraciones para Y.

  ############################################################################
  La diferencia entre If->Then y el usar !, es que el If->Then falla en caso
  de que no se cumpla el If inicial, y continua con todas las iteraciones
  disponibles. Pero si funciona inicialmente entonces elimina todos los puntos
  de decision anteriores y consigue 'un unico resultado'. Por ejemplo:
  Si hacemos
    ?- (true, true) ; true.
  Prolog nos regresaria true ; true, porque evalua ambos lados del ;
  Pero si le ponemos
    ?- (true, true) -> true ; true.
  Entonces nos regresa un solo true.
  Es lo mismo que si hacemos
    ?- (true, true, !) ; true.
  Pues cuando llega al !, detiene todos los puntos de decision anteriores.

  ############################################################################
  La diferencia entre '' y "" es que cuando escribimos atomos lo hacemos con
  '', pero si queremos usar strings lo hacemos con "".
  Por ejemplo, un atomo puede ser 'dos' dentro del predicado `numero(dos)`,
  pero el utilizar los '' nos permite colocar espacios como `numero('uno dos')`
  en lugar de escribir `numero(uno dos)` que marcaria error.

  ############################################################################
  :- discontiguous
  Significa que las definiciones pueden estar repartidas
  aleatoriamente en el mismo archivo.

  ############################################################################
  :- multifile
  Significa que las definiciones pueden estar repartidas
  aleatoriamente en múltiples archivos.

  ############################################################################
  PARA MOSTRAR TODAS LAS RESPUESTAS, PODEMOS HACER
  ?- pregunta(Response), writeln(Response), fail.

  ############################################################################
  Cuando hacemos user:predicado, nos referimos a el predicado del user.
  Es como hacer user.predicado; muy util para cuando tenemos algo como
  scripts:numero | db:numero | user:numero, que todos son diferentes.

  El user:predicado se refiere a todos aquellos fuera de algun modulo.
*/

% :- multifile numero/1.
% :- multifile par/1.

numero(cero).
numero(uno).
numero(dos).
numero(tres).
numero(cuatro).
numero(cinco).
numero(seis).
numero(siete).
numero(ocho).
numero(nueve).
numero(diez).

par(dos).
par(cuatro).
par(seis).
par(ocho).
par(diez).

% valid_list(Name, Msg, Allowed, Default).
valid_list(age, "Some text string", L, D) :- L = [uno, dos, tres], D = uno, (L == [] -> true ; member(D, L)).
valid_list(name, "Some text string", L, D) :- L = [uno, dos, tres], D = dos, (L == [] -> true ; member(D, L)).
valid_list(foo, "Some text string", L, D) :- L = [uno, dos, tres], D = tres, (L == [] -> true ; member(D, L)).
valid_list(bar, "Some text string", L, D) :- L = [uno, dos, tres], D = cuatro, (L == [] -> true ; member(D, L)). % Marked as invalid

% bagof(
%   ejemplo:valid_list(A,B,C,D),
%   ejemplo:valid_list(A,B,C,D),
%   List)
% , format("~q", [List]).
