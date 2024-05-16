/* animal.pro
  animal identification game.

    start with ?- go.     */

    go :- hypothesize(Animal),
    write('I guess that the pokemon is: '),
    write(Animal),
    nl,
    undo.

/* how to ask questions */
ask(Question) :-
  write('Your Pokemon... '),
  write(Question),
  write('? '),
  read(Response),
  nl,
  ( (Response == yes ; Response == y)
    ->
     assert(yes(Question)) ;
     assert(no(Question)), fail).

:- dynamic yes/1,no/1.

/* How to verify something */
verify(S) :-
 (yes(S) 
  ->
  true ;
  (no(S)
   ->
   fail ;
   ask(S))).

/* undo all yes/no assertions */
undo :- retract(yes(_)),fail. 
undo :- retract(no(_)),fail.
undo.

hypothesize('Altaria')      :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),        gen(3),                  has_wings,      verify('tiene alas en forma de nubes'), !.
hypothesize('Metagross')    :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),        gen(3),               \+ has_wings,      verify('tiene una X en el rostro'), !.
hypothesize('Garchomp')     :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),     \+ gen(3),                  true,           verify('parece un tiburón martillo'), !.
hypothesize('Charizard')    :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,            \+ has_color(azul),        has_color(rojo),         true,           verify('es un dragón'), verify('tiene una llama en la punta de la cola'), !.
hypothesize('Gengar')       :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,            \+ has_color(azul),     \+ has_color(rojo),         true,           verify('es un fantasma'), verify('tiene una sonrisa burlona'), !.
hypothesize('Lunala')       :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,               poketype(fantasma),     is_legend,               true,           verify('simboliza a la luna'), !.
hypothesize('Froslass')     :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,               poketype(fantasma),  \+ is_legend,               true,           verify('siempre es hembra'), verify('tiene un par de cuernos de hielo'), !.
hypothesize('Talonflame')   :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,            \+ poketype(fantasma),     has_color(rojo),         true,           verify('es un águila'), verify('tiene puntos rojos por el cuerpo y alas'), !.
hypothesize('Hydreigon')    :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,            \+ poketype(fantasma),  \+ has_color(rojo),         true,           verify('es un dragón'), verify('tiene tres cabezas'), !.
hypothesize('Abomasnow')    :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,           gen(4),                 has_color(blanco),       true,           verify('tiene las manos, pies y cola de color verde'), verify('representa a un pino nevado'), !.
hypothesize('Lucario')      :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,           gen(4),              \+ has_color(blanco),       true,           verify('tiene un pincho en el pecho y las manos'), !.
hypothesize('Hatterene')    :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,        \+ gen(4),                 has_color(rosa),         true,           verify('tiene un sombrero de bruja'), !.
hypothesize('Gardevoir')    :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,        \+ gen(4),              \+ has_color(rosa),         true,           verify('tiene un vestido blanco largo'), verify('tiene una protuberancia rosa en el pecho'), !.
hypothesize('Meowscarada')  :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),                 is_starter,              shape(biped),   verify('tiene un gran antifaz oscuro'), !.
hypothesize('Skeledirge')   :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),                 is_starter,           \+ shape(biped),   verify('tiene un ave de fuego en la nariz'), !.
hypothesize('Tinkaton')     :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),              \+ is_starter,              true,           verify('utiliza un gran martillo para atacar'), !.
hypothesize('Greninja')     :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),                 gen(6),                  is_starter,     verify('usa su propia lengua como bufanda'), !.
hypothesize('Pyroar')       :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),                 gen(6),               \+ is_starter,     verify('tiene diferencia de género'), verify('tiene melena si es macho, o cresta si es hembra'), !.
hypothesize('Weavile')      :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),              \+ gen(6),                  gen(4),         verify('usa sus grandes garras para escalar'), !.
hypothesize('Bewear')       :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),              \+ gen(6),               \+ gen(4),         verify('es un oso'), verify('tiene una fuerza descomunal'), !.
hypothesize('Flamigo')      :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),          has_wings,              has_color(rosa),         true,           verify('es un flamenco'), !.
hypothesize('Hawlucha')     :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),          has_wings,           \+ has_color(rosa),         true,           verify('parece luchador de lucha libre'), !.
hypothesize('Inkay')        :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),       \+ has_wings,              true,                    true,           verify('es un calamar'), verify('evoluciona cuando está de cabeza'), !.
hypothesize('Pecharunt')    :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),          poketype(fantasma),     is_mythical,             true,           verify('hipnotiza a las personas con mochis'), !.
hypothesize('Rotom')        :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),          poketype(fantasma),  \+ is_mythical,             true,           verify('puede convertirse en electrodomésticos'), !.
hypothesize('Klefki')       :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),       \+ poketype(fantasma),     true,                    true,           verify('tiene forma de llaves'), !.
hypothesize('Mimikyu')      :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,         poketype(fantasma),     has_color(amarillo),    true,                    true,           verify('trata de imitar a Pikachu'), !.
hypothesize('Sableye')      :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,         poketype(fantasma),  \+ has_color(amarillo),    true,                    true,           verify('tiene ojos de gema'), !.
hypothesize('Victini')      :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),     is_mythical,            true,                    true,           verify('tiene una V roja en la frente'), verify('se conoce como el Pokémon victoria'), !.
hypothesize('Impidimp')     :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),  \+ is_mythical,            has_color(rosa),         true,           verify('es un duende'), verify('tiene la lengua de fuera'), !.
hypothesize('Togedemaru')   :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),  \+ is_mythical,         \+ has_color(rosa),         true,           verify('es un erizo'), verify('tiene mejillas amarillas'), !.
hypothesize('Raichu')       :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(amarillo),    gender(diff),           reg('Alola'),            true,           verify('puede surfear con su cola'), !.
hypothesize('Pikachu')      :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(amarillo),    gender(diff),        \+ reg('Alola'),            true,           verify('es el mejor amigo de Ash Ketchum'), !.
hypothesize('Ampharos')     :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(amarillo), \+ gender(diff),           true,                    true,           verify('tiene una bombilla en la punta de la cola'), verify('tiene anillos negros en el cuello'), !.
hypothesize('Eelektross')   :- \+ two_types,     is_evolution,     poketype('eléctrico'),  \+ has_color(amarillo),    has_fins,               true,                    true,           verify('parece sanguijuela o anguila'), verify('tiene brazos'), !.
hypothesize('Zebstrika')    :- \+ two_types,     is_evolution,     poketype('eléctrico'),  \+ has_color(amarillo), \+ has_fins,               true,                    true,           verify('es una cebra'), !.
hypothesize('Feraligatr')   :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),                 has_color(azul),        is_starter,              true,           verify('es un cocodrilo'), verify('tiene colmillos y garras grandes'), !.
hypothesize('Wobbuffet')    :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),                 has_color(azul),     \+ is_starter,              true,           verify('tiene los labios pintados cuando es hembra'), verify('es compinche del equipo Rocket'), !.
hypothesize('Umbreon')      :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),              \+ has_color(azul),        true,                    true,           verify('evoluciona por la noche'), verify('tiene anillos amarillos en su cuerpo'), !.
hypothesize('Marowak')      :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),                 reg(any),               poketype(tierra),        true,           verify('utiliza un hueso para atacar'), !.
hypothesize('Zoroark')      :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),                 reg(any),            \+ poketype(tierra),        true,           verify('tiene pelo largo con una liga al final'), !.
hypothesize('Tsareena')     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),              \+ reg(any),               gender(female),          true,           verify('parece que usa tacones o botas'), !.
hypothesize('Lycanroc')     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),              \+ reg(any),            \+ gender(female),          true,           verify('es un canino'), verify('evoluciona según la posición del sol'), !.
hypothesize('Eevee')        :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),           poketype(normal),        has_dmax,       verify('evoluciona en ocho formas distintas'), !.
hypothesize('Bidoof')       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),           poketype(normal),     \+ has_dmax,       verify('es un castor'), !.
hypothesize('Buizel')       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),        \+ poketype(normal),        true,           verify('es una nutria'), verify('tiene un flotador en el cuello'), !.
hypothesize('Absol')        :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),           has_mega,                true,           verify('tiene un cuerno en forma de media luna'), !.
hypothesize('Vulpix')       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),        \+ has_mega,                reg('Alola'),   verify('tiene nueve colas'), !.
hypothesize('Yamper')       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),        \+ has_mega,             \+ reg('Alola'),   verify('es un perro Corgi'), !.
hypothesize('Oshawott')     :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),       is_starter,             poketype(water),         true,           verify('es una nutria'), verify('usa una concha marina para pelear'), !.
hypothesize('Grookey')      :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),       is_starter,          \+ poketype(water),         true,           verify('es un mono'), verify('usa un palo para pelear'), !.
hypothesize('Charcadet')    :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),    \+ is_starter,             poketype(fire),          true,           verify('evoluciona con una armadura especial'), !.
hypothesize('Togepi')       :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),    \+ is_starter,          \+ poketype(fire),          true,           verify('parece un huevo'), !.
hypothesize('Unown')        :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,      shape(abstract),        has_color(negro),        true,           verify('tiene forma de letra'), !.
hypothesize('Porygon')      :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,      shape(abstract),     \+ has_color(negro),        true,           verify('fue creado con un código de programación'), !.
hypothesize('Kyogre')       :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,   \+ shape(abstract),        is_legend,               true,           verify('dicen que es el océano personificado'), !.
hypothesize('Flabébé')      :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,   \+ shape(abstract),     \+ is_legend,               true,           verify('se transporta en una flor'), !.
hypothesize('Zacian')       :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,      gen(8),                 is_legend,               true,           verify('pelea con una espada en la boca'), !.
hypothesize('Falinks')      :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,      gen(8),              \+ is_legend,               true,           verify('son varios Pokémon en fila'), !.
hypothesize('Ditto')        :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,   \+ gen(8),                 true,                    true,           verify('puede transformarse en otros Pokémon'), verify('tiene ojos de puntitos'), !.
hypothesize(unknown).

/**======================================
* AUXILIAR RULES
* ======================================*/
% CLASIFICACION SEGUN CARACTERISTICAS FISICAS
flys_or_levitates :- verify('puede volar o levitar').
has_wings         :- verify('tiene alas').
has_fins          :- verify('tiene aletas').
has_color(X)      :- format(atom(Str), "es mayormente de color ~q", [X]), verify(Str).
% CLASIFICACION SEGUN GRUPOS
is_starter        :- verify('es un Pokémon inicial').
is_evolution      :- verify('es evolución de otro Pokémon').
legend_or_myth    :- is_legend, ! ; is_mythical.
is_legend         :- verify('es un Pokémon legendario').
is_mythical       :- verify('es un Pokémon mítico').
% CLASIFICACION SEGUN FORMAS ESPECIALES
% mega_or_dmax      :- has_mega, ! ; has_dmax.
mega_or_dmax      :- verify('puede mega-evolucionar o tiene una forma gigamax especial').
has_mega          :- verify('puede mega-evolucionar').
has_dmax          :- verify('tiene una forma gigamax especial').
% CLASIFICACION SEGUN CUERPO Y POSTURAS
shape(animal)     :- verify('tiene forma animal').
shape(quadruped)  :- verify('se mueve en cuatro patas').
shape(biped)      :- verify('se mueve en dos patas').
shape(marine)     :- verify('parece un animal marino').
shape(abstract)   :- verify('tiene una forma abstracta o extraña').
% CLASIFICACION SEGUN GENEROS
gender(both)      :- verify('existe en ambos géneros (hay machos y hembras)').
gender(diff)      :- verify('tiene diferencias físicas según su género').
gender(female)    :- verify('existe únicamente como hembra').
gender(male)      :- verify('existe únicamente como macho').
gender(none)      :- verify('no tiene género').
% CLASIFICACION SEGUN TIPOS
two_types         :- verify('es de dos tipos distintos').
poketype(X)       :- atom(X), format(atom(Str), "es de tipo ~s", [X]), verify(Str).
% CLASIFICACION SEGUN REGIONES
gen(X)            :- atom(X), format(atom(Str), "es originario de la region de ~s", [X]), verify(Str), !.
gen(X)            :- gen_name(Name, X), gen(Name).
reg(any)          :- !, verify('tiene otras variantes según la región'), !.
reg(X)            :- atom(X), format(atom(Str), "tiene forma regional de ~s", [X]), verify(Str), !.
reg(X)            :- gen_name(Name, X), reg(Name).

/**======================================
* AUXILIAR DATA
* ======================================*/
gen_name('Hisui',   0).
gen_name('Kanto',   1).
gen_name('Johto',   2).
gen_name('Hoenn',   3).
gen_name('Sinnoh',  4).
gen_name('Teselia', 5).
gen_name('Kalos',   6).
gen_name('Alola',   7).
gen_name('Galar',   8).
gen_name('Paldea',  9).
