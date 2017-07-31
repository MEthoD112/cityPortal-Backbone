import jQuery from 'jquery';
global.jQuery = jQuery;
global.jquery = jQuery;
global.$ = jQuery;
let Bootstrap = require('bootstrap');
import $ from 'jquery';
import { Collection, Model, View } from 'backbone';

import { AppView } from './application';
import { FilterModal } from './filtermodal';

const app = new AppView();
const filterModal = new FilterModal();

export { app };
