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
pokemon('Altaria').      'Altaria'     :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),        gen(3),                  has_wings,      verify('tiene alas en forma de nubes').
pokemon('Metagross').    'Metagross'   :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),        gen(3),               \+ has_wings,      verify('tiene una X en el rostro').
pokemon('Garchomp').     'Garchomp'    :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,               has_color(azul),     \+ gen(3),                  true,           verify('parece un tiburón martillo').
pokemon('Charizard').    'Charizard'   :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,            \+ has_color(azul),        has_color(rojo),         true,           verify('es un dragón'), verify('tiene una llama en la punta de la cola').
pokemon('Gengar').       'Gengar'      :-    two_types,     is_evolution,     flys_or_levitates,         has_mega,            \+ has_color(azul),     \+ has_color(rojo),         true,           verify('es un fantasma'), verify('tiene una sonrisa burlona').
pokemon('Lunala').       'Lunala'      :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,               poketype(fantasma),     is_legend,               true,           verify('simboliza a la luna').
pokemon('Froslass').     'Froslass'    :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,               poketype(fantasma),  \+ is_legend,               true,           verify('siempre es hembra'), verify('tiene un par de cuernos de hielo').
pokemon('Talonflame').   'Talonflame'  :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,            \+ poketype(fantasma),     has_color(rojo),         true,           verify('es un águila'), verify('tiene puntos rojos por el cuerpo y alas').
pokemon('Hydreigon').    'Hydreigon'   :-    two_types,     is_evolution,     flys_or_levitates,      \+ has_mega,            \+ poketype(fantasma),  \+ has_color(rojo),         true,           verify('es un dragón'), verify('tiene tres cabezas').
pokemon('Abomasnow').    'Abomasnow'   :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,           gen(4),                 has_color(blanco),       true,           verify('tiene las manos, pies y cola de color verde'), verify('representa a un pino nevado').
pokemon('Lucario').      'Lucario'     :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,           gen(4),              \+ has_color(blanco),       true,           verify('tiene un pincho en el pecho y las manos').
pokemon('Hatterene').    'Hatterene'   :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,        \+ gen(4),                 has_color(rosa),         true,           verify('tiene un sombrero de bruja').
pokemon('Gardevoir').    'Gardevoir'   :-    two_types,     is_evolution,  \+ flys_or_levitates,         mega_or_dmax,        \+ gen(4),              \+ has_color(rosa),         true,           verify('tiene un vestido blanco largo'), verify('tiene una protuberancia rosa en el pecho').
pokemon('Meowscarada').  'Meowscarada' :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),                 is_starter,              shape(biped),   verify('tiene un gran antifaz oscuro').
pokemon('Skeledirge').   'Skeledirge'  :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),                 is_starter,           \+ shape(biped),   verify('tiene un ave de fuego en la nariz').
pokemon('Tinkaton').     'Tinkaton'    :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,           gen(9),              \+ is_starter,              true,           verify('utiliza un gran martillo para atacar').
pokemon('Greninja').     'Greninja'    :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),                 gen(6),                  is_starter,     verify('usa su propia lengua como bufanda').
pokemon('Pyroar').       'Pyroar'      :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),                 gen(6),               \+ is_starter,     verify('tiene diferencia de género'), verify('tiene melena si es macho, o cresta si es hembra').
pokemon('Weavile').      'Weavile'     :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),              \+ gen(6),                  gen(4),         verify('usa sus grandes garras para escalar').
pokemon('Bewear').       'Bewear'      :-    two_types,     is_evolution,  \+ flys_or_levitates,      \+ mega_or_dmax,        \+ gen(9),              \+ gen(6),               \+ gen(4),         verify('es un oso'), verify('tiene una fuerza descomunal').
pokemon('Flamigo').      'Flamigo'     :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),          has_wings,              has_color(rosa),         true,           verify('es un flamenco').
pokemon('Hawlucha').     'Hawlucha'    :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),          has_wings,           \+ has_color(rosa),         true,           verify('parece luchador de lucha libre').
pokemon('Inkay').        'Inkay'       :-    two_types,  \+ is_evolution,     flys_or_levitates,         shape(animal),       \+ has_wings,              true,                    true,           verify('es un calamar'), verify('evoluciona cuando está de cabeza').
pokemon('Pecharunt').    'Pecharunt'   :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),          poketype(fantasma),     is_mythical,             true,           verify('hipnotiza a las personas con mochis').
pokemon('Rotom').        'Rotom'       :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),          poketype(fantasma),  \+ is_mythical,             true,           verify('puede convertirse en electrodomésticos').
pokemon('Klefki').       'Klefki'      :-    two_types,  \+ is_evolution,     flys_or_levitates,      \+ shape(animal),       \+ poketype(fantasma),     true,                    true,           verify('tiene forma de llaves').
pokemon('Mimikyu').      'Mimikyu'     :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,         poketype(fantasma),     has_color(amarillo),    true,                    true,           verify('trata de imitar a Pikachu').
pokemon('Sableye').      'Sableye'     :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,         poketype(fantasma),  \+ has_color(amarillo),    true,                    true,           verify('tiene ojos de gema').
pokemon('Victini').      'Victini'     :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),     is_mythical,            true,                    true,           verify('tiene una V roja en la frente'), verify('se conoce como el Pokémon victoria').
pokemon('Impidimp').     'Impidimp'    :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),  \+ is_mythical,            has_color(rosa),         true,           verify('es un duende'), verify('tiene la lengua de fuera').
pokemon('Togedemaru').   'Togedemaru'  :-    two_types,  \+ is_evolution,  \+ flys_or_levitates,      \+ poketype(fantasma),  \+ is_mythical,         \+ has_color(rosa),         true,           verify('es un erizo'), verify('tiene mejillas amarillas').
pokemon('Raichu').       'Raichu'      :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(amarillo),    gender(diff),           reg('Alola'),            true,           verify('puede surfear con su cola').
pokemon('Pikachu').      'Pikachu'     :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(amarillo),    gender(diff),        \+ reg('Alola'),            true,           verify('es el mejor amigo de Ash Ketchum').
pokemon('Ampharos').     'Ampharos'    :- \+ two_types,     is_evolution,     poketype('eléctrico'),     has_color(amarillo), \+ gender(diff),           true,                    true,           verify('tiene una bombilla en la punta de la cola'), verify('tiene anillos negros en el cuello').
pokemon('Eelektross').   'Eelektross'  :- \+ two_types,     is_evolution,     poketype('eléctrico'),  \+ has_color(amarillo),    has_fins,               true,                    true,           verify('parece sanguijuela o anguila'), verify('tiene brazos').
pokemon('Zebstrika').    'Zebstrika'   :- \+ two_types,     is_evolution,     poketype('eléctrico'),  \+ has_color(amarillo), \+ has_fins,               true,                    true,           verify('es una cebra').
pokemon('Feraligatr').   'Feraligatr'  :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),                 has_color(azul),        is_starter,              true,           verify('es un cocodrilo'), verify('tiene colmillos y garras grandes').
pokemon('Wobbuffet').    'Wobbuffet'   :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),                 has_color(azul),     \+ is_starter,              true,           verify('tiene los labios pintados cuando es hembra'), verify('es compinche del equipo Rocket').
pokemon('Umbreon').      'Umbreon'     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),     gen(2),              \+ has_color(azul),        true,                    true,           verify('evoluciona por la noche'), verify('tiene anillos amarillos en su cuerpo').
pokemon('Marowak').      'Marowak'     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),                 reg(any),               poketype(tierra),        true,           verify('utiliza un hueso para atacar').
pokemon('Zoroark').      'Zoroark'     :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),                 reg(any),            \+ poketype(tierra),        true,           verify('tiene pelo largo con una liga al final').
pokemon('Tsareena').     'Tsareena'    :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),              \+ reg(any),               gender(female),          true,           verify('parece que usa tacones o botas').
pokemon('Lycanroc').     'Lycanroc'    :- \+ two_types,     is_evolution,  \+ poketype('eléctrico'),  \+ gen(2),              \+ reg(any),            \+ gender(female),          true,           verify('es un canino'), verify('evoluciona según la posición del sol').
pokemon('Eevee').        'Eevee'       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),           poketype(normal),        has_dmax,       verify('evoluciona en ocho formas distintas').
pokemon('Bidoof').       'Bidoof'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),           poketype(normal),     \+ has_dmax,       verify('es un castor').
pokemon('Buizel').       'Buizel'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),       gender(diff),        \+ poketype(normal),        true,           verify('es una nutria'), verify('tiene un flotador en el cuello').
pokemon('Absol').        'Absol'       :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),           has_mega,                true,           verify('tiene un cuerno en forma de media luna').
pokemon('Vulpix').       'Vulpix'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),        \+ has_mega,                reg('Alola'),   verify('tiene nueve colas').
pokemon('Yamper').       'Yamper'      :- \+ two_types,  \+ is_evolution,     gender(both),              shape(quadruped),    \+ gender(diff),        \+ has_mega,             \+ reg('Alola'),   verify('es un perro Corgi').
pokemon('Oshawott').     'Oshawott'    :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),       is_starter,             poketype(water),         true,           verify('es una nutria'), verify('usa una concha marina para pelear').
pokemon('Grookey').      'Grookey'     :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),       is_starter,          \+ poketype(water),         true,           verify('es un mono'), verify('usa un palo para pelear').
pokemon('Charcadet').    'Charcadet'   :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),    \+ is_starter,             poketype(fire),          true,           verify('evoluciona con una armadura especial').
pokemon('Togepi').       'Togepi'      :- \+ two_types,  \+ is_evolution,     gender(both),           \+ shape(quadruped),    \+ is_starter,          \+ poketype(fire),          true,           verify('parece un huevo').
pokemon('Unown').        'Unown'       :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,      shape(abstract),        has_color(negro),        true,           verify('tiene forma de letra').
pokemon('Porygon').      'Porygon'     :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,      shape(abstract),     \+ has_color(negro),        true,           verify('fue creado con un código de programación').
pokemon('Kyogre').       'Kyogre'      :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,   \+ shape(abstract),        is_legend,               true,           verify('dicen que es el océano personificado').
pokemon('Flabébé').      'Flabébé'     :- \+ two_types,  \+ is_evolution,  \+ gender(both),              flys_or_levitates,   \+ shape(abstract),     \+ is_legend,               true,           verify('se transporta en una flor').
pokemon('Zacian').       'Zacian'      :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,      gen(8),                 is_legend,               true,           verify('pelea con una espada en la boca').
pokemon('Falinks').      'Falinks'     :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,      gen(8),              \+ is_legend,               true,           verify('son varios Pokémon en fila').
pokemon('Ditto').        'Ditto'       :- \+ two_types,  \+ is_evolution,  \+ gender(both),           \+ flys_or_levitates,   \+ gen(8),                 true,                    true,           verify('puede transformarse en otros Pokémon'), verify('tiene ojos de puntitos').

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
