import {Token, tokenName} from "./tokens_public"
import {TokenConstructor, ILexerDefinitionError, LexerDefinitionErrorType, Lexer} from "./lexer_public"
import {
    reject,
    indexOf,
    map,
    zipObject,
    isString,
    isUndefined,
    reduce,
    has,
    filter,
    difference,
    isRegExp,
    compact,
    contains,
    first
} from "../utils/utils"

let PATTERN = "PATTERN"

export interface IAnalyzeResult {
    allPatterns: RegExp[]
    patternIdxToClass: Function[]
    patternIdxToGroup : any[]
    patternIdxToLongerAltIdx : number[]
    patternIdxToCanLineTerminator: boolean[]
    emptyGroups: { [groupName: string] : Token }
}

export function analyzeTokenClasses(tokenClasses:TokenConstructor[]):IAnalyzeResult {

    let onlyRelevantClasses = reject(tokenClasses, (currClass) => {
        return currClass[PATTERN] === Lexer.NA
    })

    let allTransformedPatterns = map(onlyRelevantClasses, (currClass) => {
        return addStartOfInput(currClass[PATTERN])
    })

    let allPatternsToClass = zipObject(<any>allTransformedPatterns, onlyRelevantClasses)

    let patternIdxToClass:any = map(allTransformedPatterns, (pattern) => {
        return allPatternsToClass[pattern.toString()]
    })

    let patternIdxToGroup = map(onlyRelevantClasses, (clazz:any) => {
        let groupName = clazz.GROUP
        if (groupName === Lexer.SKIPPED) {
            return undefined
        }
        else if (isString(groupName)) {
            return groupName
        }
        else if (isUndefined(groupName)) {
            return "default"
        }
        else {
            throw Error("non exhaustive match")
        }
    })

    let patternIdxToLongerAltIdx:any = map(onlyRelevantClasses, (clazz:any) => {
        let longerAltClass = clazz.LONGER_ALT

        if (longerAltClass) {
            let longerAltIdx = indexOf(onlyRelevantClasses, longerAltClass)
            return longerAltIdx
        }
    })

    let patternIdxToCanLineTerminator = map(allTransformedPatterns, (pattern:RegExp) => {
        // TODO: unicode escapes of line terminators too?
        return /\\n|\\r|\\s/g.test(pattern.source)
    })

    let emptyGroups = reduce(onlyRelevantClasses, (acc, clazz:any) => {
        let groupName = clazz.GROUP
        if (isString(groupName)) {
            acc[groupName] = []
        }
        return acc
    }, {})

    return {
        allPatterns:                   allTransformedPatterns,
        patternIdxToClass:             patternIdxToClass,
        patternIdxToGroup:             patternIdxToGroup,
        patternIdxToLongerAltIdx:      patternIdxToLongerAltIdx,
        patternIdxToCanLineTerminator: patternIdxToCanLineTerminator,
        emptyGroups:                   emptyGroups
    }
}

export function validatePatterns(tokenClasses:TokenConstructor[]):ILexerDefinitionError[] {
    let errors = []

    let missingResult = findMissingPatterns(tokenClasses)
    let validTokenClasses = missingResult.validTokenClasses
    errors = errors.concat(missingResult.errors)

    let invalidResult = findInvalidPatterns(validTokenClasses)
    validTokenClasses = invalidResult.validTokenClasses
    errors = errors.concat(invalidResult.errors)

    errors = errors.concat(findEndOfInputAnchor(validTokenClasses))

    errors = errors.concat(findUnsupportedFlags(validTokenClasses))

    errors = errors.concat(findDuplicatePatterns(validTokenClasses))

    errors = errors.concat(findInvalidGroupType(validTokenClasses))

    return errors
}

export function findMissingPatterns(tokenClasses:TokenConstructor[]) {
    let tokenClassesWithMissingPattern = filter(tokenClasses, (currClass) => {
        return !has(currClass, PATTERN)
    })

    let errors = map(tokenClassesWithMissingPattern, (currClass) => {
        return {
            message:      "Token class: ->" + tokenName(currClass) + "<- missing static 'PATTERN' property",
            type:         LexerDefinitionErrorType.MISSING_PATTERN,
            tokenClasses: [currClass]
        }
    })

    let validTokenClasses = difference(tokenClasses, tokenClassesWithMissingPattern)
    return {errors: errors, validTokenClasses}
}

export function findInvalidPatterns(tokenClasses:TokenConstructor[]) {
    let tokenClassesWithInvalidPattern = filter(tokenClasses, (currClass) => {
        let pattern = currClass[PATTERN]
        return !isRegExp(pattern)
    })

    let errors = map(tokenClassesWithInvalidPattern, (currClass) => {
        return {
            message:      "Token class: ->" + tokenName(currClass) + "<- static 'PATTERN' can only be a RegExp",
            type:         LexerDefinitionErrorType.INVALID_PATTERN,
            tokenClasses: [currClass]
        }
    })

    let validTokenClasses = difference(tokenClasses, tokenClassesWithInvalidPattern)
    return {errors: errors, validTokenClasses}
}

let end_of_input = /[^\\][\$]/

export function findEndOfInputAnchor(tokenClasses:TokenConstructor[]):ILexerDefinitionError[] {
    let invalidRegex = filter(tokenClasses, (currClass) => {
        let pattern = currClass[PATTERN]
        return end_of_input.test(pattern.source)
    })

    let errors = map(invalidRegex, (currClass) => {
        return {
            message:      "Token class: ->" + tokenName(currClass) + "<- static 'PATTERN' cannot contain end of input anchor '$'",
            type:         LexerDefinitionErrorType.EOI_ANCHOR_FOUND,
            tokenClasses: [currClass]
        }
    })

    return errors
}

export function findUnsupportedFlags(tokenClasses:TokenConstructor[]):ILexerDefinitionError[] {
    let invalidFlags = filter(tokenClasses, (currClass) => {
        let pattern = currClass[PATTERN]
        return pattern instanceof RegExp && (pattern.multiline || pattern.global)
    })

    let errors = map(invalidFlags, (currClass) => {
        return {
            message:      "Token class: ->" + tokenName(currClass) +
                          "<- static 'PATTERN' may NOT contain global('g') or multiline('m')",
            type:         LexerDefinitionErrorType.UNSUPPORTED_FLAGS_FOUND,
            tokenClasses: [currClass]
        }
    })

    return errors
}

// This can only test for identical duplicate RegExps, not semantically equivalent ones.
export function findDuplicatePatterns(tokenClasses:TokenConstructor[]):ILexerDefinitionError[] {

    let found = []
    let identicalPatterns = map(tokenClasses, (outerClass:any) => {
        return reduce(tokenClasses, (result, innerClass:any) => {
            if ((outerClass.PATTERN.source === innerClass.PATTERN.source) && !contains(found, innerClass) &&
                innerClass.PATTERN !== Lexer.NA) {
                // this avoids duplicates in the result, each class may only appear in one "set"
                // in essence we are creating Equivalence classes on equality relation.
                found.push(innerClass)
                result.push(innerClass)
                return result
            }
            return result
        }, [])
    })

    identicalPatterns = compact(identicalPatterns)

    let duplicatePatterns = filter(identicalPatterns, (currIdenticalSet) => {
        return currIdenticalSet.length > 1
    })

    let errors = map(duplicatePatterns, (setOfIdentical:any) => {
        let classNames = map(setOfIdentical, (currClass:any) => {
            return tokenName(currClass)
        })

        let dupPatternSrc = (<any>first(setOfIdentical)).PATTERN
        return {
            message:      `The same RegExp pattern ->${dupPatternSrc}<-` +
                          `has been used in all the following classes: ${classNames.join(", ")} <-`,
            type:         LexerDefinitionErrorType.DUPLICATE_PATTERNS_FOUND,
            tokenClasses: setOfIdentical
        }
    })

    return errors
}

export function findInvalidGroupType(tokenClasses:TokenConstructor[]):ILexerDefinitionError[] {
    let invalidTypes = filter(tokenClasses, (clazz:any) => {
        if (!has(clazz, "GROUP")) {
            return false
        }
        let group = clazz.GROUP

        return group !== Lexer.SKIPPED &&
            group !== Lexer.NA && !isString(group)
    })

    let errors = map(invalidTypes, (currClass) => {
        return {
            message:      "Token class: ->" + tokenName(currClass) + "<- static 'GROUP' can only be Lexer.SKIPPED/Lexer.NA/A String",
            type:         LexerDefinitionErrorType.INVALID_GROUP_TYPE_FOUND,
            tokenClasses: [currClass]
        }
    })

    return errors
}

export function addStartOfInput(pattern:RegExp):RegExp {
    let flags = pattern.ignoreCase ? "i" : ""
    // always wrapping in a none capturing group preceded by '^' to make sure matching can only work on start of input.
    // duplicate/redundant start of input markers have no meaning (/^^^^A/ === /^A/)
    return new RegExp(`^(?:${pattern.source})`, flags)
}

export function countLineTerminators(text:string):number {
    let lineTerminators = 0
    let currOffset = 0

    while (currOffset < text.length) {
        let c = text.charCodeAt(currOffset)
        if (c === 10) { // "\n"
            lineTerminators++
        }
        else if (c === 13) { // \r
            if (currOffset !== text.length - 1 &&
                text.charCodeAt(currOffset + 1) === 10) { // "\n"
            }
            else {
                lineTerminators++
            }
        }

        currOffset++
    }

    return lineTerminators
}

