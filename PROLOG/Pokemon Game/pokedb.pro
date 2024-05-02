/**############################################################################
 * Marcamos todo lo necesario como :- multifile/1 para esperar otro archivo.
 * ############################################################################*/
:- multifile verify/1.
:- multifile show_list/1.

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
animal :- show_list(animal).
animal(cheetah).
animal(tiger).
animal(polar_bear).
animal(giraffe).
animal(camel).
animal(zebra).
animal(ostrich).
animal(penguin).
animal(falcon).
animal(albatross).

/**======================================
 * MAIN ANIMAL RULES
 * X/0 is det.
 * ======================================*/
cheetah    :- mammal,   carnivore,                  verify(has_tawny_color),        verify(has_dark_spots).
tiger      :- mammal,   carnivore,                  verify(has_tawny_color),        verify(has_black_stripes).
polar_bear :- mammal,   carnivore,                  verify(swims),                  verify(lives_in_cold_areas).
giraffe    :- ungulate, verify(has_long_neck),      verify(has_dark_spots).
camel      :- ungulate, verify(has_long_neck),      verify(lives_in_desert_areas).
zebra      :- ungulate, verify(has_black_stripes).
ostrich    :- bird,     \+ verify(flys),            verify(has_long_neck).
penguin    :- bird,     \+ verify(flys),            verify(swims),                  verify(is_black_and_white).
falcon     :- bird,     carnivore,                  verify(flys_at_high_speed).
albatross  :- bird,     verify(has_long_wings).

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
