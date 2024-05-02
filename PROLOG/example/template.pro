% IMPORT GLOBAL SCRIPTS
:- ['PROLOG/scripts.pro'].

% INIT CURRENT PATH
current_folder('example/').
:- use_file('example_db', true).

% TEMPLATE CONTENTS
process:-
  writeln('Hello World'),
  await.

:- process.
