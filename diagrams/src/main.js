(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['./diagrams_builder', './diagrams_behavior'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('./diagrams_builder'), require('./diagrams_behavior'));
    } else {
        // Browser globals (root is window)
        root.main = factory(root.diagrams_builder, root.diagrams_behavior);
    }
}(this, function(builder, behavior) {
    return {
        drawDiagramsFromParserInstance: function(parserInstanceToDraw, targetDiv) {
            var topRules = parserInstanceToDraw.getGAstProductions().values()
            targetDiv.innerHTML = diagrams_builder.buildSyntaxDiagramsText(topRules);
            diagrams_behavior.initDiagramsBehavior()
        }
    };
}));