/**############################################################################
 * Marcamos todo lo necesario como :- multifile/1 para esperar otro archivo.
 * ############################################################################*/
:- multifile verify/1.
:- multifile show_list/1.
% verify(Str) :- writeln(Str), read(Term), Term == yes.

% SET ENCODING UTF8
:- set_flag(encoding, utf8).
:- encoding(utf8).

/**############################################################################
 * ANIMAL IDENTIFICATION RULES
 * 
 * Todos los atomos marcados como animal. Si se accede con `animal/0` entonces
 * se mostrara en pantalla la lista con todos los animales disponibles.
 * 
 * Describimos los atributos de los animales para luego verificar si dichos attrs
 * se cumplen o no segun lo que indique el usuario.
 * 
 * animal/1 is semi-det.
 * ############################################################################*/
:- discontiguous animal/1. % Esto es para poder acomodarlos de la siguiente manera
animal :- show_list(animal).
animal(cheetah).     cheetah    :- mammal,    carnivore,                  verify(has_tawny_color),        verify(has_dark_spots).
animal(tiger).       tiger      :- mammal,    carnivore,                  verify(has_tawny_color),        verify(has_black_stripes).
animal(polar_bear).  polar_bear :- mammal,    carnivore,                  verify(swims),                  verify(lives_in_cold_areas).
animal(giraffe).     giraffe    :- ungulate,  verify(has_long_neck),      verify(has_dark_spots),         true.
animal(camel).       camel      :- ungulate,  verify(has_long_neck),      verify(lives_in_desert_areas),  true.
animal(zebra).       zebra      :- ungulate,  verify(has_black_stripes),  true,                           true.
animal(ostrich).     ostrich    :- bird,      \+ verify(flys),            verify(has_long_neck),          true.
animal(penguin).     penguin    :- bird,      \+ verify(flys),            verify(swims),                  verify(is_black_and_white).
animal(falcon).      falcon     :- bird,      carnivore,                  verify(flys_at_high_speed),     true.
animal(albatross).   albatross  :- bird,      verify(has_long_wings),     true,                           true.

/**======================================
 * AUXILIAR RULES
 * X/0 is det.
 * ======================================*/
mammal    :- verify(has_hair), !.
mammal    :- verify(gives_milk).
bird      :- \+ mammal,                 verify(has_feathers), !.
bird      :- \+ mammal,                 verify(flys),         verify(lays_eggs).
carnivore :- verify(eats_meat), !.
carnivore :- verify(has_pointed_teeth), verify(has_claws),    verify(has_forward_eyes).
ungulate  :- mammal,                    \+ carnivore,         verify(has_hooves), !.
ungulate  :- mammal,                    \+ carnivore,         verify(chews_cud).

/**############################################################################
 * POKEMON IDENTIFICATION GAME
 * 
 * Todos los atomos marcados como Pokemon. Si se accede con `pokemon/0` entonces
 * se mostrara en pantalla la lista con todos los pokemon disponibles.
 * 
 * Describimos los atributos de los pokemon para luego verificar si dichos attrs
 * se cumplen o no segun lo que indique el usuario.
 * 
 * pokemon/1 is semi-det.
 * ############################################################################*/
:- discontiguous pokemon/1.  % Esto es para poder acomodarlos de la siguiente manera
pokemon :- show_list(pokemon).
pokemon('Altaria').      'Altaria'     :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),        gen(3),                  has_wings.
pokemon('Metagross').    'Metagross'   :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),        gen(3),               \+ has_wings.
pokemon('Garchomp').     'Garchomp'    :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),     \+ gen(3),                  true.
pokemon('Charizard').    'Charizard'   :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,            \+ has_color(azul),        has_color(rojo),         true.
pokemon('Gengar').       'Gengar'      :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,            \+ has_color(azul),     \+ has_color(rojo),         true.
pokemon('Lunala').       'Lunala'      :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,               poketype(fantasma),     is_legend,               true.
pokemon('Froslass').     'Froslass'    :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,               poketype(fantasma),  \+ is_legend,               true.
pokemon('Talonflame').   'Talonflame'  :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,            \+ poketype(fantasma),     has_color(rojo),         true.
pokemon('Hydreigon').    'Hydreigon'   :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,            \+ poketype(fantasma),  \+ has_color(rojo),         true.
pokemon('Lucario').      'Lucario'     :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,           gen(6),                 has_color(azul),         true. % Originally check white
pokemon('Abomasnow').    'Abomasnow'   :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,           gen(6),              \+ has_color(azul),         true.
pokemon('Hatterene').    'Hatterene'   :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,        \+ gen(6),                 has_color(pink),         true. % Originally check white
pokemon('Gardevoir').    'Gardevoir'   :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,        \+ gen(6),              \+ has_color(pink),         true.
pokemon('Meowscarada').  'Meowscarada' :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),                 is_starter,              shape(biped).
pokemon('Skeledirge').   'Skeledirge'  :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),                 is_starter,           \+ shape(biped). % Better color rojo
pokemon('Tinkaton').     'Tinkaton'    :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),              \+ is_starter,              true.
pokemon('Greninja').     'Greninja'    :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),                 gen(6),                  is_starter.
pokemon('Pyroar').       'Pyroar'      :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),                 gen(6),               \+ is_starter.
pokemon('Weavile').      'Weavile'     :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),              \+ gen(6),                  gen(4).
pokemon('Bewear').       'Bewear'      :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),              \+ gen(6),               \+ gen(4).
pokemon('Flamigo').      'Flamigo'     :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),          has_wings,              has_color(pink),         true.
pokemon('Hawlucha').     'Hawlucha'    :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),          has_wings,           \+ has_color(pink),         true.
pokemon('Inkay').        'Inkay'       :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),       \+ has_wings,              true,                    true.
pokemon('Pecharunt').    'Pecharunt'   :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),          poketype(fantasma),     is_mythical,             true.
pokemon('Rotom').        'Rotom'       :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),          poketype(fantasma),  \+ is_mythical,             true.
pokemon('Klefki').       'Klefki'      :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),       \+ poketype(fantasma),     true,                    true.
pokemon('Mimikyu').      'Mimikyu'     :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,         poketype(fantasma),     has_color(yellow),      true,                    true.
pokemon('Sableye').      'Sableye'     :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,         poketype(fantasma),  \+ has_color(yellow),      true,                    true.
pokemon('Victini').      'Victini'     :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),     is_mythical,            true,                    true.
pokemon('Impidimp').     'Impidimp'    :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),  \+ is_mythical,            has_color(pink),         true.
pokemon('Togedemaru').   'Togedemaru'  :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),  \+ is_mythical,         \+ has_color(pink),         true.
pokemon('Raichu').       'Raichu'      :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(yellow),      gen(1),                 reg('Alola'),            true.
pokemon('Pikachu').      'Pikachu'     :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(yellow),      gen(1),              \+ reg('Alola'),            true.
pokemon('Ampharos').     'Ampharos'    :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(yellow),   \+ gen(1),                 true,                    true.
pokemon('Eelektrik').    'Eelektrik'   :- \+ two_types,     is_evolution,     poketype('eléctrico'),  \+ has_color(yellow),      has_fins,               true,                    true.
pokemon('Zebstrika').    'Zebstrika'   :- \+ two_types,     is_evolution,     poketype('eléctrico'),  \+ has_color(yellow),   \+ has_fins,               true,                    true.
pokemon('Feraligatr').   'Feraligatr'  :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),                 has_color(azul),        is_starter,              true.
pokemon('Wobbuffet').    'Wobbuffet'   :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),                 has_color(azul),     \+ is_starter,              true. % Originally check team rocket
pokemon('Umbreon').      'Umbreon'     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),              \+ has_color(azul),        true,                    true.
pokemon('Zoroark').      'Zoroark'     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),                 reg(any),               reg('Hisui'),            true. % Originally check long hair
pokemon('Marowak').      'Marowak'     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),                 reg(any),            \+ reg('Hisui'),            true.
pokemon('Tsareena').     'Tsareena'    :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),              \+ reg(any),               gender(female),          true.
pokemon('Lycanroc').     'Lycanroc'    :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),              \+ reg(any),            \+ gender(female),          true.
pokemon('Eevee').        'Eevee'       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),           poketype(normal),        has_dmax.
pokemon('Bidoof').       'Bidoof'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),           poketype(normal),     \+ has_dmax.
pokemon('Buizel').       'Buizel'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),        \+ poketype(normal),        true.
pokemon('Absol').        'Absol'       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),           has_mega,                true.
pokemon('Vulpix').       'Vulpix'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),        \+ has_mega,                reg('Alola').
pokemon('Yamper').       'Yamper'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),        \+ has_mega,             \+ reg('Alola').
pokemon('Oshawott').     'Oshawott'    :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),       is_starter,             poketype(water),         true. % Better color azul
pokemon('Grookey').      'Grookey'     :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),       is_starter,          \+ poketype(water),         true.
pokemon('Charcadet').    'Charcadet'   :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),    \+ is_starter,             poketype(fire),          true. % Better color rojo
pokemon('Togepi').       'Togepi'      :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),    \+ is_starter,          \+ poketype(fire),          true.
pokemon('Unown').        'Unown'       :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,      shape(abstract),        has_color(black),        true.
pokemon('Porygon').      'Porygon'     :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,      shape(abstract),     \+ has_color(black),        true. % Better color azul
pokemon('Kyogre').       'Kyogre'      :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,   \+ shape(abstract),        is_legend,               true.
pokemon('Flabébé').      'Flabébé'     :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,   \+ shape(abstract),     \+ is_legend,               true.
pokemon('Zacian').       'Zacian'      :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,      gen(8),                 is_legend,               true.
pokemon('Falinks').      'Falinks'     :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,      gen(8),              \+ is_legend,               true.
pokemon('Ditto').        'Ditto'       :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,   \+ gen(8),                 true,                    true.

/**======================================
 * AUXILIAR RULES
 * ======================================*/
% CLASIFICACION SEGUN CARACTERISTICAS FISICAS
flys_or_levitates :- verify('puede volar o levitar').
has_wings         :- verify('tiene alas').
has_fins          :- verify('tiene aletas').
has_color(X)      :- format(atom(Str), "es mayormente de color ~q", [X]), verify(Str).
% CLASIFICACION SEGUN GRUPOS
is_starter        :- verify('es un pokémon inicial').
is_evolution      :- verify('es evolución de otro pokémon').
legend_or_myth    :- is_legend, ! ; is_mythical.
is_legend         :- verify('es un pokémon legendario').
is_mythical       :- verify('es un pokémon mítico').
% CLASIFICACION SEGUN FORMAS ESPECIALES
mega_or_dmax      :- has_mega, ! ; has_dmax.
has_mega          :- verify('puede mega-evolucionar').
has_dmax          :- verify('tiene una forma dynamax especial').
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
