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

        $('#filter-attributes').on('click', (event) => {
            const id = event.target.id;
            if (id === 'c-filter' || id === 'p-filter' || id === 'i-filter') {
                this.toogleColor(event.target);
            }
        });
         $('#dropdown-button').on('click', (event) => {
            $('#countries-error').html('');
            $('#input-search-countries').val('');
            $('#atrributes-error').html('');
            $('#citizens-error').html('');
            $('#min-value-citizens').val('');
            $('#max-value-citizens').val('');
            $('#i-filter').attr('data-act', 'true');
            $('#c-filter').attr('data-act', 'false');
            $('#p-filter').attr('data-act', 'false');
            $('#i-filter').css('background', constants.activeColor);
            $('#c-filter').css('background', constants.noActiveColor);
            $('#p-filter').css('background', constants.noActiveColor);
            
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