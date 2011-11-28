var fs = require('fs');
var _ = require('underscore');

module.exports = {
    name: "html",
    format: function(coverageData) {
        var source = coverageData.source.split("\n");
        var stats = coverageData.stats();
        var finalOutput = [];
        var fileOutput = [];
        
        for(var i = 0 ; i < source.length; i++) {
            var sourceLine = source[i];
            var line = i;
            var lineOutput = [];
            if (!stats.coverage.hasOwnProperty(line + 1)) {
                lineOutput.push("<span class='covered'>  ");
                lineOutput.push(sourceLine);
                lineOutput.push("</span>");
            }
            else {
                var lineInfo = stats.coverage[line + 1];
                sourceLine = lineInfo.source;
                
                if (!lineInfo.partial) {
                    // If it isn't partial, then we can just append the entire line
                    lineOutput.push("<span class='uncovered'>  ");
                    lineOutput.push(sourceLine.replace(/</g, "&lt;"));
                    lineOutput.push("</span>");
                }
                else {
                    lineOutput.push("<span class='partial'>  ");
                    
                    for(var j = 0; j < lineInfo.missing.length; j++) {
                        curStart = j == 0 ? 0 : (lineInfo.missing[j-1].endCol + 1);
                        curEnd = lineInfo.missing[j].startCol;
                        
                        lineOutput.push(sourceLine.slice(curStart, curEnd).replace(/</g, "&lt;"));
                        
                        lineOutput.push("<span class='partialuncovered'>  ");
                        lineOutput.push(sourceLine.slice(lineInfo.missing[j].startCol, lineInfo.missing[j].endCol + 1).replace(/</g, "&lt;"));
                        lineOutput.push("</span>");
                    }
                    
                    // Add the straggling part
                    curStart = lineInfo.missing[lineInfo.missing.length - 1].endCol + 1;
                    curEnd = sourceLine.length;
                    lineOutput.push(sourceLine.slice(curStart, curEnd).replace(/</g, "&lt;"));
                    
                    lineOutput.push("</span>");
                }
            }
            fileOutput.push(lineOutput.join(""));
        }
      
        finalOutput.push("<pre class='prettyprint lang-js linenums'>");
        finalOutput.push(fileOutput.join("\n"));
        finalOutput.push("</pre>");

        var outputString = finalOutput.join("\n");

        return outputString;
    }
}