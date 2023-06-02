class obj_wall {

    // Create Event
    constructor(element, x, y){
        
        this.id = element;
    }

}

// ################################################################################################
// ################################################################################################

function sumVector(u, v){
    return new Vector2(u.x + v.x, u.y + v.y);
}

function multiplyScalarVector(u, a){
    return new Vector2(u.x * a, u.y * a);
}

class Vector2 {
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

}

// ################################################################################################
// ################################################################################################

class obj_car {

    // Create Event
    constructor(element, x, y){
        this.id = element;

        // const _data =  this.id.getBoundingClientRect();

        this.x = x;
        this.y = y;

        this.max_hspeed = 100;
        this.max_vspeed = 100;

        this.hspeed = 0;
        this.vspeed = 0;

        this.acc = 0.03;
        this.fric = 0.2;

        this.move = 0;

        this.update();
    }

    // Step Event
    update() {
        this.id.style.top = `${this.y}px`;
        this.id.style.left = `${this.x}px`;
    }

}

// ################################################################################################
// ################################################################################################

class obj_character extends obj_car {

    // Create Event
    constructor(element, x, y){
        
        super(element, x, y);
        

    }

    // Step Event
    update() {
        this.id.style.top = `${this.y}px`;
        this.id.style.left = `${this.x}px`;

        var Left = 0;
        var Right = 1;

        this.move = Left + Right;

    }

}

document.addEventListener("DOMContentLoaded", () => {

    for (let i = 0; i < 20; i++) {
        
        let number = 0;

        number = random_range( 1,  10);

        console.log(number);
        
    }


});