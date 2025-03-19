import { path } from './path.js';
// gulp
import gulp from 'gulp';
import browserSync from 'browser-sync';
import { deleteSync } from 'del';
import ttf2woff2 from 'gulp-ttf2woff2';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import gcmq from 'gulp-group-css-media-queries';
import sourcemaps from 'gulp-sourcemaps';
import cleanCSS from 'gulp-clean-css';
import gulpImg from 'gulp-image';
import svgSprite from 'gulp-svg-sprite';

const sass = gulpSass(dartSass);
//tasks
export const html = done => {
    gulp.src(path.src.html).pipe(gulp.dest(path.dist.html)).pipe(browserSync.stream());
    done();
};
//scss
export const scss = () =>
    gulp
        .src(path.src.scss)
        //surcemaps init
        // .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(
            autoprefixer({
                cascade: false,
                grid: false,
            })
        )
        .pipe(gcmq())
        // .pipe(
        //     cleanCSS({
        //         2: {
        //             specialComments: 0,
        //         },
        //     })
        // ) // Uncomment to minify css
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dist.css))
        .pipe(browserSync.stream());
//images
export const img = done => {
    gulp.src(path.src.img, { encoding: false })
        .pipe(
            gulpImg({
                optipng: ['-i 1', '-strip all', '-fix', '-o7', '-force'],
                pngquant: ['--speed=1', '--force', 256],
                zopflipng: ['-y', '--lossy_8bit', '--lossy_transparent'],
                jpegRecompress: ['--strip', '--quality', 'medium', '--min', 40, '--max', 80],
                mozjpeg: ['-optimize', '-progressive'],
                gifsicle: ['--optimize'],
                svgo: false,
            })
        )
        .pipe(gulp.dest(path.dist.img))
        .pipe(browserSync.stream());
    done();
};
//svg
export const svg = () =>
    gulp
        .src(path.src.svg)
        .pipe(
            svgSprite({
                mode: {
                    symbol: {
                        sprite: '../sprite.svg',
                    },
                },
                shape: {
                    transform: [
                        {
                            svgo: {
                                plugins: [
                                    {
                                        name: 'removeAttrs',
                                        params: {
                                            attrs: ['class', 'data-name', 'fill'],
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            })
        )
        .pipe(gulp.dest(path.dist.img))
        .pipe(
            browserSync.stream({
                once: true,
            })
        );
//convertFonts
export const convertFonts = done => {
    gulp.src(path.src.fontsToConvert, {
        encoding: false,
        removeBOM: false,
    })
        .pipe(ttf2woff2())
        .pipe(gulp.dest('src/assets/fonts/'));
    done();
};
//copy
export const copy = () =>
    gulp
        .src(path.src.assets, {
            base: path.src.base,
        })
        .pipe(gulp.dest('dist/'))
        .pipe(
            browserSync.stream({
                once: true,
            })
        );
//server
export const server = () => {
    browserSync.init({
        ui: false,
        notify: false,
        host: 'localhost',
        port: 3001,
        // tunnel: true,
        server: {
            baseDir: 'dist',
        },
    });

    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.css, scss);
    gulp.watch(path.watch.img, img);
    gulp.watch(path.watch.svg, svg);
};
//clear
export const clear = done => {
    deleteSync([path.dist.base], {
        force: true,
    });
    done();
};
export const base = gulp.parallel(html, scss, img, svg, copy);
export const convert = gulp.parallel(convertFonts);
export default gulp.series(base, server);
