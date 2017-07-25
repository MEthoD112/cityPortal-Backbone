import jQuery from 'jquery';
global.jQuery = jQuery;
global.jquery = jQuery;
global.$ = jQuery;
let Bootstrap = require('bootstrap');
import $ from 'jquery';
import { _ } from 'underscore';
import { Collection, Model, View } from 'backbone';

import { AppView } from './application';

const app = new AppView();

