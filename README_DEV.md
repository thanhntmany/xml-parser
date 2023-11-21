# Concept:

This tool is built based on the leveraging the power of regex, and focuses in reducing creating new string while processing on raw string.



| Syntax | Markup type
| - | -
| `<![CDATA[`*{Data}*`]]>` | CDATA Sections
| `<!--`*{Data}*`-->` | Comment
| `<!`*{Name}* ... `>` | Declaration
| `<?`*{Name}* ... (`?`)?`>` | Processing Instructions
| `<`*{Name}* *{Attributes}\** (`/>` \| `>`) *{Content}* `</`*{Name}* S* `>`  | Element


### Markup regex

```
/\s*((<(((!)((\[CDATA\[([\S\s]*?)\]\]>)|(--([\S\s]*?)-->))?)|(\?))?\s*)|([^<]*))/g
```
Regex executing result:

| Group No | Current | Then
| - | - | -
| 8 | Content of CDATA | parse next Markup
| 10 | Content of Comment | parse next Markup
| 5 | This is a Declaration | parse current Declaration
| 11 | This is a Processing Instruction | parse current Processing Instruction
| 12 | This is a CharData | parse next Markup



---
XML Struction Notations

`document ::= prolog element Misc*`

`prolog ::= XMLDecl? Misc* (doctypedecl Misc*)?`


### NameStartChar
`NameStartChar ::= ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]`

To regex:

```regex
[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]
```

### NameChar
`NameChar ::= NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]`

To regex:

```regex
[:_\-\.·\dA-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]
```

### ==> Name
`Name ::= NameStartChar (NameChar)*`

To regex:

```regex
[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:_\-\.·\dA-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*
```



`Name ::= NameStartChar (NameChar)*`
`Names ::= Name (#x20 Name)*`

### Eq
`Eq ::= S? '=' S?`

### Tag Attribute
`Attribute ::= Name Eq AttValue`

### AttValue
`AttValue ::= '"' ([^<&"] | Reference)* '"' |  "'" ([^<&'] | Reference)* "'"`


### Reference
`Reference ::= EntityRef | CharRef`

`EntityRef ::= '&' Name ';'`

`CharRef ::= '&#' [0-9]+ ';' | '&#x' [0-9a-fA-F]+ ';'`