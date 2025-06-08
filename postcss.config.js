export default {
    plugins: {
        autoprefixer: {},
        "postcss-px-to-viewport-8-plugin": {
            unitToConvert: "px",
            viewportWidth: 375,
            unitPrecision: 6,
            propList: ["*"],
            viewportUnit: "vw",
            fontViewportUnit: "vw",
            selectorBlackList: [],
            minPixelValue: 1,
            mediaQuery: true,
            exclude: [],
            landscape: false
        }
    }
};
