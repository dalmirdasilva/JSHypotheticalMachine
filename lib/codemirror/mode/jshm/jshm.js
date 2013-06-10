CodeMirror.defineMode("jshm", function(_config, parserConfig) {

    // The symbol used to start a line comment
    var lineCommentStartSymbol = "#";

    var directives = {
        ".db": "keyword",
        ".at": "keyword",
        ".def": "keyword"
    };

    var instructioSet = ["nop", "sta", "lda", "add", "or", "and", "not", "jmp", "jn", "jz", "call", "ret", "push", "pop", "hlt"];

    return {
        
        startState: function() {
            return {
                tokenize: null
            };
        },

        token: function(stream, state) {
            
            if (stream.eatSpace()) {
                return null;
            }

            var style, cur, ch = stream.next();

            if (ch === lineCommentStartSymbol) {
                stream.skipToEnd();
                return "comment";
            }

            if (ch === '-') {
                ch = stream.next();
                if (ch === "0" && stream.eat("x")) {
                    stream.eatWhile(/[0-9a-fA-F]/);
                    return "number";
                }
                stream.eatWhile(/\d/);
                return "number";
            }

            if (ch === '.') {
                stream.eatWhile(/\w/);
                cur = stream.current().toLowerCase();
                style = directives[cur];
                return style || null;
            }

            if (ch === ':') {
                stream.eatWhile(/\w/);
                return "def";
            }

            if (/\d/.test(ch)) {
                if (ch === "0" && stream.eat("x")) {
                    stream.eatWhile(/[0-9a-fA-F]/);
                    return "number";
                }
                stream.eatWhile(/\d/);
                return "number";
            }
            
            stream.eatWhile(/\w/);
            cur = stream.current();
            if (~(instructioSet.indexOf(cur.toLowerCase()))) {
                return "builtin";
            }
        },
        lineComment: lineCommentStartSymbol,
        blockCommentStart: "/*",
        blockCommentEnd: "*/"
    };
});
