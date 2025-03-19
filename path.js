export const path = {
    dist: {
        base: 'dist/',
        html: 'dist/',
        js: 'dist/js/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
        css: 'dist/css/',
    },
    src: {
        base: 'src/',
        html: 'src/*.html',
        js: 'src/js/index.js',
        img: 'src/assets/img/**/*.*',
        svg: 'src/svg/**/*.svg',
        scss: 'src/scss/**/*.scss',
        assets: ['src/assets/fonts/**/*.*'],
        fontsToConvert: 'src/assets/fontsToConvert/*.*',
    },
    watch: {
        html: 'src/*.html',
        img: 'src/img/**/*.*',
        css: 'src/**/*.scss',
        img: 'src/img/**/*.*',
        svg: 'src/svg/**/*.svg',
    },
};
