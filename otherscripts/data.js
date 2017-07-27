import { app, search } from './app';


export class ExampleData {
    constructor() {
        const json = [
            {
                'id': 0,
                'country': 'Belarus',
                'name': 'Minsk',
                'isIndustrial': true,
                'isCriminal': false,
                'isPolluted': false,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'Serebryanka',
                        description: 'The best place in the world',
                        citizenAmount: 300000
                    },
                    {
                        id: 1,
                        name: 'Chigovka',
                        description: 'The worst place in the world',
                        citizenAmount: 200000
                    }
                ]
            },
            {
                'id': 1,
                'country': 'USA',
                'name': 'New York',
                'isIndustrial': true,
                'isCriminal': true,
                'isPolluted': true,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'Bronx',
                        description: 'The worst place in the New York',
                        citizenAmount: 450000
                    },
                    {
                        id: 1,
                        name: 'Brooklyn',
                        description: 'The best place in the New York',
                        citizenAmount: 350000
                    }
                ]
            },
            {
                'id': 2,
                'country': 'Japan',
                'name': 'Tokyo',
                'isIndustrial': true,
                'isCriminal': false,
                'isPolluted': true,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'YakudzaDistrict',
                        description: 'The best sushi in this place',
                        citizenAmount: 130000
                    },
                    {
                        id: 1,
                        name: 'Fukusima',
                        description: 'Be carefull, it is dirty',
                        citizenAmount: 70000
                    }
                ]
            },
            {
                'id': 3,
                'country': 'Russia',
                'name': 'Varkuta',
                'isIndustrial': false,
                'isCriminal': true,
                'isPolluted': true,
                'cityAreas': []
            },
            {
                'id': 4,
                'country': 'Russia',
                'name': 'Moscow',
                'isIndustrial': true,
                'isCriminal': true,
                'isPolluted': true,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'Ximki',
                        description: 'Far away from Kremlin',
                        citizenAmount: 190000
                    },
                    {
                        id: 1,
                        name: 'Zamoskvorech\'e',
                        description: 'The center of the city',
                        citizenAmount: 770000
                    }
                ]
            },
             {
                'id': 5,
                'country': 'USA',
                'name': 'Los Angeles',
                'isIndustrial': true,
                'isCriminal': true,
                'isPolluted': true,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'Hollywood',
                        description: 'Here people make movies',
                        citizenAmount: 120000
                    },
                    {
                        id: 1,
                        name: 'Beach District',
                        description: 'Here you can have a rest',
                        citizenAmount: 790000
                    }
                ]
            },
            {
                'id': 6,
                'country': 'Russia',
                'name': 'Ekaterenburg',
                'isIndustrial': true,
                'isCriminal': true,
                'isPolluted': true,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'XimMash',
                        description: 'A lot of plants here',
                        citizenAmount: 120000
                    },
                    {
                        id: 1,
                        name: 'Center',
                        description: 'Here you can have a rest',
                        citizenAmount: 790000
                    }
                ]
            },
            {
                'id': 7,
                'country': 'Germany',
                'name': 'Berlin',
                'isIndustrial': true,
                'isCriminal': true,
                'isPolluted': true,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'SchtirlitzPlatz',
                        description: 'Do not think about the seconds from height',
                        citizenAmount: 670000
                    },
                    {
                        id: 1,
                        name: 'Damschtrasse',
                        description: 'Here you can attend interesting places',
                        citizenAmount: 867000
                    }
                ]
            },
            {
                'id': 8,
                'country': 'France',
                'name': 'Paris',
                'isIndustrial': true,
                'isCriminal': false,
                'isPolluted': true,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'District of 13th',
                        description: 'Nice frog legs here',
                        citizenAmount: 260000
                    },
                    {
                        id: 1,
                        name: 'Notre dam de paris',
                        description: 'Very beatiful church',
                        citizenAmount: 912000
                    }
                ]
            },
            {
                'id': 9,
                'country': 'Urugvay',
                'name': 'Montevideo',
                'isIndustrial': true,
                'isCriminal': false,
                'isPolluted': false,
                'cityAreas': [
                    {
                        id: 0,
                        name: 'Center of the city',
                        description: 'Very nice nature',
                        citizenAmount: 460000
                    }
                ]
            }
        ];
        this.loadButton = document.getElementById('load-data');
        this.loadButton.addEventListener('click', () => {
            localStorage.setItem('cities', JSON.stringify(json));
            app.clearDisplay();
            app.displayCities(json);
            app.clearSearchList();
            app.initSearchList(json);
            app.clearCountriesList();
            app.initCountriesList(json);
            app.cities = JSON.parse(localStorage.getItem('cities')) || [];
        });
    }
}