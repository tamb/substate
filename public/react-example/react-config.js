import names from './names.json';


const config = {
    name: 'React_Profile_App',
    logic: {
        name: 'React_Profile_Logic',
        init: function(ref) {

        }
    },
    stateConfig: {
        name: 'React_Profile_State',
        state: {
        	people: names,
            animals: [
        {
            type: 'wolf',
            limbs: [
                {
                    type: 'legs',
                    working: true,
                    features: {
                        hair: true,
                        freckles: false
                    }
                }
            ]
        },

        {
            type: 'ape',
            limbs: [
                {   
                    type: 'legs',
                    working: true,
                    features: {
                        hair: true,
                        freckles: false
                    }
                },
                {   
                    type: 'arms',
                    working: true,
                    feaures: {
                        hair: true,
                        freckles: true
                    }
                }
            ]
        }

    ]
        },
        saveOnChange: true,
        pullFromLocal: true

    },
    element: {
        name: 'React_Profile_Elements',
        init: function(ref) {

        }
    }
};
export default config;