import {Token} from "../../src/scan/tokens_public"
import {Parser} from "../../src/parse/parser_public"
import {HashTable} from "../../src/lang/lang_extensions"
import {getLookaheadFuncsForClass} from "../../src/parse/cache"

export class OneTok extends Token {
    constructor() { super("One", 0, 1, 1) }
}

export class TwoTok extends Token {
    constructor() { super("Two", 0, 1, 1) }
}

export class ThreeTok extends Token {
    constructor() { super("Three", 0, 1, 1) }
}

export class FourTok extends Token {
    constructor() { super("Four", 0, 1, 1) }
}

export class FiveTok extends Token {
    constructor() { super("Five", 0, 1, 1) }
}

export class SixTok extends Token {
    constructor() { super("Six", 0, 1, 1) }
}

export class Comma extends Token {
    constructor() { super(",", 0, 1, 1) }
}

const ALL_TOKENS = [OneTok, TwoTok, ThreeTok, FourTok, FiveTok, SixTok, Comma]

class OptionsImplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public manyOptionsRule = this.RULE("manyOptionsRule", this.parseManyOptionsRule, () => { return "-666" })

    private parseManyOptionsRule():string {
        let total = ""

        this.OPTION1(() => {
            this.CONSUME1(OneTok)
            total += "1"
        })

        this.OPTION2(() => {
            this.CONSUME1(TwoTok)
            total += "2"
        })

        this.OPTION3(() => {
            this.CONSUME1(ThreeTok)
            total += "3"
        })

        this.OPTION4(() => {
            this.CONSUME1(FourTok)
            total += "4"
        })

        this.OPTION5(() => {
            this.CONSUME1(FiveTok)
            total += "5"
        })

        return total
    }
}

class OptionsExplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public manyOptionsRule = this.RULE("manyOptionsRule", this.parseManyOptionsRule, () => { return "-666" })

    private parseManyOptionsRule():string {
        let total = ""

        this.OPTION1(isOneTok, () => {
            this.CONSUME1(OneTok)
            total += "1"
        })

        this.OPTION2(isTwoTok, () => {
            this.CONSUME1(TwoTok)
            total += "2"
        })

        this.OPTION3(isThreeTok, () => {
            this.CONSUME1(ThreeTok)
            total += "3"
        })

        this.OPTION4(isFourTok, () => {
            this.CONSUME1(FourTok)
            total += "4"
        })

        this.OPTION5(isFiveTok, () => {
            this.CONSUME1(FiveTok)
            total += "5"
        })

        return total
    }
}

function isOneTok():boolean {
    return this.NEXT_TOKEN() instanceof OneTok
}

function isTwoTok():boolean {
    return this.NEXT_TOKEN() instanceof TwoTok
}

function isThreeTok():boolean {
    return this.NEXT_TOKEN() instanceof ThreeTok
}

function isFourTok():boolean {
    return this.NEXT_TOKEN() instanceof FourTok
}

function isFiveTok():boolean {
    return this.NEXT_TOKEN() instanceof FiveTok
}

describe("The implicit lookahead calculation functionality of the Recognizer For OPTION", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new OptionsImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can automatically compute lookahead for OPTION1", () => {
        let input = [new OneTok()]
        let parser = new OptionsImplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("1")
    })

    it("can automatically compute lookahead for OPTION2", () => {
        let input = [new TwoTok()]
        let parser = new OptionsImplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("2")
    })

    it("can automatically compute lookahead for OPTION3", () => {
        let input = [new ThreeTok()]
        let parser = new OptionsImplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("3")
    })

    it("can automatically compute lookahead for OPTION4", () => {
        let input = [new FourTok()]
        let parser = new OptionsImplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("4")
    })

    it("can automatically compute lookahead for OPTION5", () => {
        let input = [new FiveTok()]
        let parser = new OptionsImplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("5")
    })

    it("will cache the generatedLookAhead functions AFTER (check cache is filled)", () => {
        let parser = new OptionsImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(5)
    })
})


describe("The Explicit lookahead functionality of the Recognizer for OPTION", () => {

    it("can accept lookahead function param for OPTION1", () => {
        let input = [new OneTok()]
        let parser = new OptionsExplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("1")
    })

    it("can accept lookahead function param for OPTION2", () => {
        let input = [new TwoTok()]
        let parser = new OptionsExplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("2")
    })

    it("can accept lookahead function param for OPTION3", () => {
        let input = [new ThreeTok()]
        let parser = new OptionsExplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("3")
    })

    it("can accept lookahead function param for OPTION4", () => {
        let input = [new FourTok()]
        let parser = new OptionsExplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("4")
    })

    it("can accept lookahead function param for OPTION5", () => {
        let input = [new FiveTok()]
        let parser = new OptionsExplicitLookAheadParser(input)
        expect(parser.manyOptionsRule()).to.equal("5")
    })

    it("Will not cache any ImplicitLookahead functions", () => {
        let parser = new OptionsExplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })
})


class ManyImplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public manyRule = this.RULE("manyRule", this.parseManyRule, () => { return "-666" })

    private parseManyRule():string {
        let total = ""

        this.MANY1(() => {
            this.CONSUME1(OneTok)
            total += "1"
        })

        this.MANY2(() => {
            this.CONSUME1(TwoTok)
            total += "2"
        })

        this.MANY3(() => {
            this.CONSUME1(ThreeTok)
            total += "3"
        })

        this.MANY4(() => {
            this.CONSUME1(FourTok)
            total += "4"
        })

        this.MANY5(() => {
            this.CONSUME1(FiveTok)
            total += "5"
        })

        return total
    }
}

class ManyExplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public manyRule = this.RULE("manyRule", this.parseManyRule, () => { return "-666" })

    private parseManyRule():string {
        let total = ""

        this.MANY1(isOneTok, () => {
            this.CONSUME1(OneTok)
            total += "1"
        })

        this.MANY2(isTwoTok, () => {
            this.CONSUME1(TwoTok)
            total += "2"
        })

        this.MANY3(isThreeTok, () => {
            this.CONSUME1(ThreeTok)
            total += "3"
        })

        this.MANY4(isFourTok, () => {
            this.CONSUME1(FourTok)
            total += "4"
        })

        this.MANY5(isFiveTok, () => {
            this.CONSUME1(FiveTok)
            total += "5"
        })

        return total
    }
}

describe("The implicit lookahead calculation functionality of the Recognizer For MANY", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new ManyImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can automatically compute lookahead for MANY1", () => {
        let input = [new OneTok()]
        let parser = new ManyImplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("1")
    })

    it("can automatically compute lookahead for MANY2", () => {
        let input = [new TwoTok()]
        let parser = new ManyImplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("2")
    })

    it("can automatically compute lookahead for MANY3", () => {
        let input = [new ThreeTok()]
        let parser = new ManyImplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("3")
    })

    it("can automatically compute lookahead for MANY4", () => {
        let input = [new FourTok()]
        let parser = new ManyImplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("4")
    })

    it("can automatically compute lookahead for MANY5", () => {
        let input = [new FiveTok()]
        let parser = new ManyImplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("5")
    })

    it("can accept lookahead function param for flow mixing several MANYs", () => {
        let input = [new OneTok(), new OneTok(), new ThreeTok(), new ThreeTok(), new ThreeTok(), new FiveTok()]
        let parser = new ManyImplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("113335")
    })

    it("will cache the generatedLookAhead functions AFTER (check cache is filled)", () => {
        let parser = new ManyImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(5)
    })
})


describe("The Explicit lookahead functionality of the Recognizer for MANY", () => {

    it("can accept lookahead function param for MANY1", () => {
        let input = [new OneTok()]
        let parser = new ManyExplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("1")
    })

    it("can accept lookahead function param for MANY2", () => {
        let input = [new TwoTok()]
        let parser = new ManyExplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("2")
    })

    it("can accept lookahead function param for MANY3", () => {
        let input = [new ThreeTok()]
        let parser = new ManyExplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("3")
    })

    it("can accept lookahead function param for MANY4", () => {
        let input = [new FourTok()]
        let parser = new ManyExplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("4")
    })

    it("can accept lookahead function param for MANY5", () => {
        let input = [new FiveTok()]
        let parser = new ManyExplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("5")
    })

    it("can accept lookahead function param for flow mixing several MANYs", () => {
        let input = [new OneTok(), new OneTok(), new ThreeTok(), new ThreeTok(), new ThreeTok(), new FiveTok()]
        let parser = new ManyExplicitLookAheadParser(input)
        expect(parser.manyRule()).to.equal("113335")
    })

    it("Will not cache any ImplicitLookahead functions when provided with explicit versions", () => {
        let parser = new ManyExplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })
})


class ManySepImplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public manySepRule = this.RULE("manySepRule", this.parseManyRule, () => { return {total: 666, separators: []} })

    private parseManyRule():any {

        let total = ""
        let separators = []

        separators = separators.concat(this.MANY_SEP1(Comma, () => {
            this.CONSUME1(OneTok)
            total += "1"
        }))

        separators = separators.concat(this.MANY_SEP2(Comma, () => {
            this.CONSUME1(TwoTok)
            total += "2"
        }))

        separators = separators.concat(this.MANY_SEP3(Comma, () => {
            this.CONSUME1(ThreeTok)
            total += "3"
        }))

        separators = separators.concat(this.MANY_SEP4(Comma, () => {
            this.CONSUME1(FourTok)
            total += "4"
        }))

        separators = separators.concat(this.MANY_SEP5(Comma, () => {
            this.CONSUME1(FiveTok)
            total += "5"
        }))

        return {total: total, separators: separators}
    }
}

class ManySepExplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public manySepRule = this.RULE("manySepRule", this.parseManyRule, () => { return "-666" })

    private parseManyRule():string {
        let total = ""

        this.MANY_SEP1(Comma, isOneTok, () => {
            this.CONSUME1(OneTok)
            total += "1"
        })

        this.MANY_SEP2(Comma, isTwoTok, () => {
            this.CONSUME1(TwoTok)
            total += "2"
        })

        this.MANY_SEP3(Comma, isThreeTok, () => {
            this.CONSUME1(ThreeTok)
            total += "3"
        })

        this.MANY_SEP4(Comma, isFourTok, () => {
            this.CONSUME1(FourTok)
            total += "4"
        })

        this.MANY_SEP5(Comma, isFiveTok, () => {
            this.CONSUME1(FiveTok)
            total += "5"
        })

        return total
    }
}

describe("The implicit lookahead calculation functionality of the Recognizer For MANY_SEP", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new ManySepImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can automatically compute lookahead for MANY_SEP1", () => {
        let input = [new OneTok()]
        let parser = new ManySepImplicitLookAheadParser(input)
        expect(parser.manySepRule().total).to.equal("1")
    })

    it("can automatically compute lookahead for MANY_SEP2", () => {
        let input = [new TwoTok()]
        let parser = new ManySepImplicitLookAheadParser(input)
        expect(parser.manySepRule().total).to.equal("2")
    })

    it("can automatically compute lookahead for MANY_SEP3", () => {
        let input = [new ThreeTok()]
        let parser = new ManySepImplicitLookAheadParser(input)
        expect(parser.manySepRule().total).to.equal("3")
    })

    it("can automatically compute lookahead for MANY_SEP4", () => {
        let input = [new FourTok()]
        let parser = new ManySepImplicitLookAheadParser(input)
        expect(parser.manySepRule().total).to.equal("4")
    })

    it("can automatically compute lookahead for MANY_SEP5", () => {
        let input = [new FiveTok()]
        let parser = new ManySepImplicitLookAheadParser(input)
        expect(parser.manySepRule().total).to.equal("5")
    })

    it("can accept lookahead function param for flow mixing several MANY_SEPs", () => {
        let input = [new OneTok(), new Comma(), new OneTok(), new ThreeTok(), new Comma(),
            new ThreeTok(), new Comma(), new ThreeTok(), new FiveTok()]
        let parser = new ManySepImplicitLookAheadParser(input)
        let result = parser.manySepRule()
        expect(result.total).to.equal("113335")
        expect(result.separators).to.have.length(3)
        expect(result.separators).to.deep.equal([new Comma(), new Comma(), new Comma()])
    })

    it("will cache the generatedLookAhead functions AFTER (check cache is filled)", () => {
        let parser = new ManySepImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(5)
    })
})


describe("The Explicit lookahead functionality of the Recognizer for MANY", () => {

    it("can accept lookahead function param for MANY1", () => {
        let input = [new OneTok()]
        let parser = new ManySepExplicitLookAheadParser(input)
        expect(parser.manySepRule()).to.equal("1")
    })

    it("can accept lookahead function param for MANY2", () => {
        let input = [new TwoTok()]
        let parser = new ManySepExplicitLookAheadParser(input)
        expect(parser.manySepRule()).to.equal("2")
    })

    it("can accept lookahead function param for MANY3", () => {
        let input = [new ThreeTok()]
        let parser = new ManySepExplicitLookAheadParser(input)
        expect(parser.manySepRule()).to.equal("3")
    })

    it("can accept lookahead function param for MANY4", () => {
        let input = [new FourTok()]
        let parser = new ManySepExplicitLookAheadParser(input)
        expect(parser.manySepRule()).to.equal("4")
    })

    it("can accept lookahead function param for MANY5", () => {
        let input = [new FiveTok()]
        let parser = new ManySepExplicitLookAheadParser(input)
        expect(parser.manySepRule()).to.equal("5")
    })

    it("can accept lookahead function param for flow mixing several MANYs", () => {
        let input = [new OneTok(), new Comma(), new OneTok(), new ThreeTok(), new Comma(),
            new ThreeTok(), new Comma(), new ThreeTok(), new FiveTok()]
        let parser = new ManySepExplicitLookAheadParser(input)
        expect(parser.manySepRule()).to.equal("113335")
    })

    it("Will not cache any ImplicitLookahead functions when provided with explicit versions", () => {
        let parser = new ManySepExplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })
})


class AtLeastOneImplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public atLeastOneRule = this.RULE("atLeastOneRule", this.parseAtLeastOneRule, () => { return "-666" })

    private parseAtLeastOneRule():string {
        let total = ""

        this.AT_LEAST_ONE1(() => {
            this.CONSUME1(OneTok)
            total += "1"
        }, "Ones")

        this.AT_LEAST_ONE2(() => {
            this.CONSUME1(TwoTok)
            total += "2"
        }, "Twos")

        this.AT_LEAST_ONE3(() => {
            this.CONSUME1(ThreeTok)
            total += "3"
        }, "Threes")

        this.AT_LEAST_ONE4(() => {
            this.CONSUME1(FourTok)
            total += "4"
        }, "Fours")

        this.AT_LEAST_ONE5(() => {
            this.CONSUME1(FiveTok)
            total += "5"
        }, "Fives")

        return total
    }
}

class AtLeastOneExplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public atLeastOneRule = this.RULE("atLeastOneRule", this.parseAtLeastOneRule, () => { return "-666" })

    private parseAtLeastOneRule():string {
        let total = ""

        this.AT_LEAST_ONE1(isOneTok, () => {
            this.CONSUME1(OneTok)
            total += "1"
        }, "Ones")

        this.AT_LEAST_ONE2(isTwoTok, () => {
            this.CONSUME1(TwoTok)
            total += "2"
        }, "Twos")

        this.AT_LEAST_ONE3(isThreeTok, () => {
            this.CONSUME1(ThreeTok)
            total += "3"
        }, "Threes")

        this.AT_LEAST_ONE4(isFourTok, () => {
            this.CONSUME1(FourTok)
            total += "4"
        }, "Fours")

        this.AT_LEAST_ONE5(isFiveTok, () => {
            this.CONSUME1(FiveTok)
            total += "5"
        }, "Fives")

        return total
    }
}

describe("The implicit lookahead calculation functionality of the Recognizer For AT_LEAST_ONE", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new AtLeastOneImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can accept lookahead function param for AT_LEAST_ONE1-5", () => {
        let input = [new OneTok(), new TwoTok(), new TwoTok(), new ThreeTok(),
            new FourTok(), new FourTok(), new FiveTok()]
        let parser = new AtLeastOneImplicitLookAheadParser(input)
        expect(parser.atLeastOneRule()).to.equal("1223445")
    })

    it("will fail when zero occurrences of AT_LEAST_ONE in input", () => {
        let input = [new OneTok(), new TwoTok(), /*new ThreeTok(),*/ new FourTok(), new FiveTok()]
        let parser = new AtLeastOneImplicitLookAheadParser(input)
        expect(parser.atLeastOneRule()).to.equal("-666")
    })

    it("will cache the generatedLookAhead functions AFTER (check cache is filled)", () => {
        let parser = new AtLeastOneImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(5)
    })
})

describe("The Explicit lookahead functionality of the Recognizer for AT_LEAST_ONE", () => {

    it("can accept lookahead function param for AT_LEAST_ONE1-5", () => {
        let input = [new OneTok(), new TwoTok(), new TwoTok(), new ThreeTok(),
            new FourTok(), new FourTok(), new FiveTok()]
        let parser = new AtLeastOneExplicitLookAheadParser(input)
        expect(parser.atLeastOneRule()).to.equal("1223445")
    })

    it("will fail when zero occurrences of AT_LEAST_ONE in input", () => {
        let input = [new OneTok(), new TwoTok(), /*new ThreeTok(),*/ new FourTok(), new FiveTok()]
        let parser = new AtLeastOneExplicitLookAheadParser(input)
        expect(parser.atLeastOneRule()).to.equal("-666")
    })

    it("Will not cache any ImplicitLookahead functions when provided with explicit versions", () => {
        let parser = new AtLeastOneExplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })
})


class AtLeastOneSepImplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public atLeastOneSepRule = this.RULE("atLeastOneSepRule", this.parseAtLeastOneRule, () => {
        return {
            total:      "-666",
            separators: []
        }
    })

    private parseAtLeastOneRule():any {
        let total = ""
        let separators = []

        separators = separators.concat(this.AT_LEAST_ONE_SEP1(Comma, () => {
            this.CONSUME1(OneTok)
            total += "1"
        }, "Ones"))

        separators = separators.concat(this.AT_LEAST_ONE_SEP2(Comma, () => {
            this.CONSUME1(TwoTok)
            total += "2"
        }, "Twos"))

        separators = separators.concat(this.AT_LEAST_ONE_SEP3(Comma, () => {
            this.CONSUME1(ThreeTok)
            total += "3"
        }, "Threes"))

        separators = separators.concat(this.AT_LEAST_ONE_SEP4(Comma, () => {
            this.CONSUME1(FourTok)
            total += "4"
        }, "Fours"))

        separators = separators.concat(this.AT_LEAST_ONE_SEP5(Comma, () => {
            this.CONSUME1(FiveTok)
            total += "5"
        }, "Fives"))

        return {total: total, separators: separators}
    }
}

class AtLeastOneSepExplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public atLeastOneSepRule = this.RULE("atLeastOneSepRule", this.parseAtLeastOneSepRule, () => { return "-666" })

    private parseAtLeastOneSepRule():string {
        let total = ""

        this.AT_LEAST_ONE_SEP1(Comma, isOneTok, () => {
            this.CONSUME1(OneTok)
            total += "1"
        }, "Ones")

        this.AT_LEAST_ONE_SEP2(Comma, isTwoTok, () => {
            this.CONSUME1(TwoTok)
            total += "2"
        }, "Twos")

        this.AT_LEAST_ONE_SEP3(Comma, isThreeTok, () => {
            this.CONSUME1(ThreeTok)
            total += "3"
        }, "Threes")

        this.AT_LEAST_ONE_SEP4(Comma, isFourTok, () => {
            this.CONSUME1(FourTok)
            total += "4"
        }, "Fours")

        this.AT_LEAST_ONE_SEP5(Comma, isFiveTok, () => {
            this.CONSUME1(FiveTok)
            total += "5"
        }, "Fives")

        return total
    }
}

describe("The implicit lookahead calculation functionality of the Recognizer For AT_LEAST_ONE_SEP", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new AtLeastOneSepImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can accept lookahead function param for AT_LEAST_ONE_SEP1-5", () => {
        let input = [new OneTok(), new TwoTok(), new Comma(), new TwoTok(), new ThreeTok(),
            new FourTok(), new Comma(), new FourTok(), new FiveTok()]
        let parser = new AtLeastOneSepImplicitLookAheadParser(input)
        let parseResult = parser.atLeastOneSepRule()
        expect(parseResult.total).to.equal("1223445")
        expect(parseResult.separators).to.deep.equal([new Comma(), new Comma()])
    })

    it("will fail when zero occurrences of AT_LEAST_ONE_SEP in input", () => {
        let input = [new OneTok(), new TwoTok(), /*new ThreeTok(),*/ new FourTok(), new FiveTok()]
        let parser = new AtLeastOneSepImplicitLookAheadParser(input)
        expect(parser.atLeastOneSepRule().total).to.equal("-666")
    })

    it("will cache the generatedLookAhead functions AFTER (check cache is filled)", () => {
        let parser = new AtLeastOneSepImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(5)
    })
})

describe("The Explicit lookahead functionality of the Recognizer for AT_LEAST_ONE_SEP", () => {

    it("can accept lookahead function param for AT_LEAST_ONE_SEP1-5", () => {
        let input = [new OneTok(), new TwoTok(), new Comma(), new TwoTok(), new ThreeTok(),
            new FourTok(), new Comma(), new FourTok(), new FiveTok()]
        let parser = new AtLeastOneSepExplicitLookAheadParser(input)
        expect(parser.atLeastOneSepRule()).to.equal("1223445")
    })

    it("will fail when zero occurrences of AT_LEAST_ONE_SEP in input", () => {
        let input = [new OneTok(), new TwoTok(), /*new ThreeTok(),*/ new FourTok(), new FiveTok()]
        let parser = new AtLeastOneSepExplicitLookAheadParser(input)
        expect(parser.atLeastOneSepRule()).to.equal("-666")
    })

    it("Will not cache any ImplicitLookahead functions when provided with explicit versions", () => {
        let parser = new AtLeastOneSepExplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })
})


class OrImplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public orRule = this.RULE("orRule", this.parseOrRule, () => { return "-666" })

    private parseOrRule():string {
        let total = ""

        // @formatter:off
            this.OR1([
                {ALT: () => {
                    this.CONSUME1(OneTok)
                    total += "A1"
                }},
                {ALT: () => {
                    this.CONSUME1(TwoTok)
                    total += "A2"
                }},
                {ALT: () => {
                    this.CONSUME1(ThreeTok)
                    total += "A3"
                }},
                {ALT: () => {
                    this.CONSUME1(FourTok)
                    total += "A4"
                }},
                {ALT: () => {
                    this.CONSUME1(FiveTok)
                    total += "A5"
                }},
            ])

            this.OR2([
                {ALT: () => {
                    this.CONSUME2(OneTok)
                    total += "B1"
                }},
                {ALT: () => {
                    this.CONSUME2(FourTok)
                    total += "B4"
                }},
                {ALT: () => {
                    this.CONSUME2(ThreeTok)
                    total += "B3"
                }},
                 {ALT: () => {
                    this.CONSUME2(TwoTok)
                    total += "B2"
                }},
                {ALT: () => {
                    this.CONSUME2(FiveTok)
                    total += "B5"
                }},
            ], "digits")

            this.OR3([
                {ALT: () => {
                    this.CONSUME3(TwoTok)
                    total += "C2"
                }},
                {ALT: () => {
                    this.CONSUME3(FourTok)
                    total += "C4"
                }},
                {ALT: () => {
                    this.CONSUME3(ThreeTok)
                    total += "C3"
                }},
                {ALT: () => {
                    this.CONSUME3(FiveTok)
                    total += "C5"
                }},
                 {ALT: () => {
                    this.CONSUME3(OneTok)
                    total += "C1"
                }}
            ], "digits")

            this.OR4([
                {ALT: () => {
                    this.CONSUME4(OneTok)
                    total += "D1"
                }},
                {ALT: () => {
                    this.CONSUME4(ThreeTok)
                    total += "D3"
                }},
                {ALT: () => {
                    this.CONSUME4(FourTok)
                    total += "D4"
                }},
                {ALT: () => {
                    this.CONSUME4(TwoTok)
                    total += "D2"
                }},
                {ALT: () => {
                    this.CONSUME4(FiveTok)
                    total += "D5"
                }}
            ], "digits")

            this.OR5([
                {ALT: () => {
                    this.CONSUME5(TwoTok)
                    total += "E2"
                }},
                 {ALT: () => {
                    this.CONSUME5(OneTok)
                    total += "E1"
                }},
                {ALT: () => {
                    this.CONSUME5(FourTok)
                    total += "E4"
                }},
                 {ALT: () => {
                    this.CONSUME5(ThreeTok)
                    total += "E3"
                }},
                {ALT: () => {
                    this.CONSUME5(FiveTok)
                    total += "E5"
                }},
            ], "digits")

            // @formatter:on
        return total
    }
}

describe("The implicit lookahead calculation functionality of the Recognizer For OR", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new OrImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can compute the lookahead automatically for OR1-5", () => {
        let input = [new OneTok(), new TwoTok(), new ThreeTok(), new FourTok(), new FiveTok()]
        let parser = new OrImplicitLookAheadParser(input)
        expect(parser.orRule()).to.equal("A1B2C3D4E5")
    })

    it("will fail when none of the alternatives match", () => {
        let input = [new SixTok()]
        let parser = new OrImplicitLookAheadParser(input)
        expect(parser.orRule()).to.equal("-666")
    })

    it("will cache the generatedLookAhead functions AFTER (check cache is filled)", () => {
        let parser = new OrImplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(5)
    })
})

class OrExplicitLookAheadParser extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public orRule = this.RULE("orRule", this.parseOrRule, () => { return "-666" })

    private parseOrRule():string {
        let total = ""

        // @formatter:off
            this.OR1([
                {WHEN: isOneTok, THEN_DO: () => {
                    this.CONSUME1(OneTok)
                    total += "1"
                }},
                {WHEN: isTwoTok, THEN_DO: () => {
                    this.CONSUME1(TwoTok)
                    total += "2"
                }},
                {WHEN: isThreeTok, THEN_DO: () => {
                    this.CONSUME1(ThreeTok)
                    total += "3"
                }},
                {WHEN: isFourTok, THEN_DO: () => {
                    this.CONSUME1(FourTok)
                    total += "4"
                }},
                {WHEN: isFiveTok, THEN_DO: () => {
                    this.CONSUME1(FiveTok)
                    total += "5"
                }},
            ], "digits")

            // @formatter:on
        return total
    }
}

describe("The Explicit lookahead functionality of the Recognizer for OR", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new OrExplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can accept the lookahead param explicitly for OR", () => {
        let input = [new TwoTok()]
        let parser = new OrExplicitLookAheadParser(input)
        expect(parser.orRule()).to.equal("2")
    })

    it("will fail when none of the alternatives match", () => {
        let input = [new SixTok()]
        let parser = new OrExplicitLookAheadParser(input)
        expect(parser.orRule()).to.equal("-666")
    })

    it("will NOT cache the generatedLookAhead functions in explicit mode", () => {
        let parser = new OrExplicitLookAheadParser()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })
})

class OrAmbiguityLookAheadParser extends Parser {

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public ambiguityRule = this.RULE("ambiguityRule", this.parseAmbiguityRule)

    private parseAmbiguityRule():void {

        // @formatter:off
            this.OR1([
                {ALT: () => {
                    this.CONSUME1(OneTok)
                    this.CONSUME1(TwoTok)
                }},
                {ALT: () => { // <-- this alternative starts with the same token as the previous one, ambiguity!
                    this.CONSUME2(OneTok)
                    this.CONSUME1(ThreeTok)
                }},
                {ALT: () => {
                    this.CONSUME2(TwoTok)
                }},
                {ALT: () => {
                    this.CONSUME2(ThreeTok)
                }}
            ], "digits")
            // @formatter:on
    }
}

describe("OR production ambiguity detection when using implicit lookahead calculation", () => {

    it("will throw an error when two alternatives have the same single token (lookahead 1) prefix", () => {
        let parser = new OrAmbiguityLookAheadParser()
        expect(() => parser.ambiguityRule()).to.throw("Ambiguous alternatives")
    })
})

class OrImplicitLookAheadParserIgnoreAmbiguities extends Parser {

    public getLookAheadCache():HashTable<Function> {
        return getLookaheadFuncsForClass(this.className)
    }

    constructor(input:Token[] = []) {
        super(input, ALL_TOKENS)
        Parser.performSelfAnalysis(this)
    }

    public orRule = this.RULE("orRule", this.parseOrRule, () => { return "-666" })

    private parseOrRule():string {
        let total = ""

        // @formatter:off
            this.OR([
                {ALT: () => {
                    this.CONSUME1(OneTok)
                    total += "A1"
                }},
                {ALT: () => {
                    this.CONSUME2(OneTok)
                    total += "OOPS!"
                }},
                {ALT: () => {
                    this.CONSUME1(ThreeTok)
                    total += "A3"
                }},
                {ALT: () => {
                    this.CONSUME1(FourTok)
                    total += "A4"
                }},
                {ALT: () => {
                    this.CONSUME1(FiveTok)
                    total += "A5"
                }},
            ], "digits", Parser.IGNORE_AMBIGUITIES)

            this.OR2([
                {ALT: () => {
                    this.CONSUME2(FourTok)
                    total += "B4"
                }},
                {ALT: () => {
                    this.CONSUME2(ThreeTok)
                    total += "B3"
                }},
                 {ALT: () => {
                    this.CONSUME2(TwoTok)
                    total += "B2"
                }},
                {ALT: () => {
                    this.CONSUME3(TwoTok)
                    total += "OOPS!"
                }},
                {ALT: () => {
                    this.CONSUME2(FiveTok)
                    total += "B5"
                }},
            ], "digits", Parser.IGNORE_AMBIGUITIES)

            this.OR3([
                {ALT: () => {
                    this.CONSUME3(FourTok)
                    total += "C4"
                }},
                {ALT: () => {
                    this.CONSUME3(ThreeTok)
                    total += "C3"
                }},
                {ALT: () => {
                    this.CONSUME4(ThreeTok)
                    total += "OOPS!"
                }},
                {ALT: () => {
                    this.CONSUME3(FiveTok)
                    total += "C5"
                }},
                 {ALT: () => {
                    this.CONSUME3(OneTok)
                    total += "C1"
                }}
            ], "digits", Parser.IGNORE_AMBIGUITIES)

            this.OR4([
                {ALT: () => {
                    this.CONSUME4(OneTok)
                    total += "D1"
                }},
                {ALT: () => {
                    this.CONSUME4(FourTok)
                    total += "D4"
                }},
                {ALT: () => {
                    this.CONSUME5(FourTok)
                    total += "OOPS!"
                }},
                {ALT: () => {
                    this.CONSUME4(TwoTok)
                    total += "D2"
                }},
            ], "digits", Parser.IGNORE_AMBIGUITIES)

            this.OR5([
                {ALT: () => {
                    this.CONSUME5(TwoTok)
                    total += "E2"
                }},
                 {ALT: () => {
                    this.CONSUME5(OneTok)
                    total += "E1"
                }},
                {ALT: () => {
                    this.CONSUME4(FiveTok)
                    total += "E5"
                }},
                 {ALT: () => {
                    this.CONSUME5(ThreeTok)
                    total += "E3"
                }},
                {ALT: () => {
                    this.CONSUME5(FiveTok)
                    total += "OOPS!"
                }},
            ], "digits", Parser.IGNORE_AMBIGUITIES)

            // @formatter:on
        return total
    }
}

describe("The implicit lookahead calculation functionality of the Recognizer For OR (with IGNORE_AMBIGUITIES)", () => {

    it("will cache the generatedLookAhead functions BEFORE (check cache is clean)", () => {
        let parser = new OrImplicitLookAheadParserIgnoreAmbiguities()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(0)
    })

    it("can compute the lookahead automatically for OR1-5", () => {
        let input = [new OneTok(), new TwoTok(), new ThreeTok(), new FourTok(), new FiveTok()]
        let parser = new OrImplicitLookAheadParserIgnoreAmbiguities(input)
        expect(parser.orRule()).to.equal("A1B2C3D4E5")
    })

    it("will fail when none of the alternatives match", () => {
        let input = [new SixTok()]
        let parser = new OrImplicitLookAheadParserIgnoreAmbiguities(input)
        expect(parser.orRule()).to.equal("-666")
    })

    it("will cache the generatedLookAhead functions AFTER (check cache is filled)", () => {
        let parser = new OrImplicitLookAheadParserIgnoreAmbiguities()
        let lookaheadCache = parser.getLookAheadCache()
        expect(lookaheadCache.keys().length).to.equal(5)
    })
})

