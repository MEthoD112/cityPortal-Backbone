import $ from 'jquery';
import { constants } from './constants';

export class ToggleAttrModal {
    constructor() {
        $('#modal-city').on('click', (event) => {
            const id = event.target.id;
            if (id === 'c' || id === 'p' || id === 'i') {
                this.toogleColor(event.target);
            }
        });
    }

    toogleColor(target) {
        if (target.getAttribute('data-act') === 'true') {
            target.style.background = constants.noActiveColor;
            target.setAttribute('data-act', 'false');
        } else {
            target.style.background = constants.activeColor;
            target.setAttribute('data-act', 'true');
        }
    }
}