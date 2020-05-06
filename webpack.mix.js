const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/app.js', 'public/js')
.react('resources/js/components/Students/Studentlist.js', 'public/js')
.react('resources/js/components/Template/Markingtemplate.js', 'public/js')
.react('resources/js/components/Settings/Modules/Modules.js', 'public/js')
.react('resources/js/components/Settings/Template/Templategroups.js', 'public/js')
.react('resources/js/components/Settings/Template/Template.js', 'public/js')
   /* .sass('resources/sass/app.scss', 'public/css');
 */