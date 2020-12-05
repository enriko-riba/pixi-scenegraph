var DefaultScreenSizeCalculator = (function () {
    function DefaultScreenSizeCalculator(designedWidth, designedHeight) {
        this.designedWidth = designedWidth;
        this.designedHeight = designedHeight;
    }
    DefaultScreenSizeCalculator.prototype.GetAvailableSize = function () {
        return { x: window.innerWidth, y: window.innerHeight };
    };
    DefaultScreenSizeCalculator.prototype.GetAspectRatio = function () {
        return this.designedWidth / this.designedHeight;
    };
    DefaultScreenSizeCalculator.prototype.CalculateSize = function (availableSize, aspect) {
        var maxWidth = Math.floor(aspect * availableSize.y);
        var maxHeight = Math.floor(window.innerHeight);
        return { x: Math.min(maxWidth, availableSize.x), y: Math.min(maxHeight, availableSize.y) };
    };
    DefaultScreenSizeCalculator.prototype.CalculateScale = function (calculatedSize) {
        return {
            x: calculatedSize.x / this.designedWidth,
            y: calculatedSize.x / this.designedWidth,
        };
    };
    return DefaultScreenSizeCalculator;
}());
export { DefaultScreenSizeCalculator };
//# sourceMappingURL=DefaultScreenSizeCalculator.js.map