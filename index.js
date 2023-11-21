"use strict"

const MarkupRe = /\s*(<(((!)((\[CDATA\[([\S\s]*?)\]\]>)|(--([\S\s]*?)-->))?)|(\?))?)\s*/g,
    NameRe = /([:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:_\-\.·\dA-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0300-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]*)\s*/g,
    ExternalIDRe = /(SYSTEM\s*(((["'])([^\4]*?)\4)|([^\s</>]*)))|(PUBLIC\s*(((["'])([\sa-zA-Z0-9-'()+,./:=?;!*#@$_%]*)\10)|([a-zA-Z0-9-'()+,./:=?;!*#@$_%]*)))\s*(((["'])([^\15]*?)\15)|([^\s</>]*))\s*/g,
    AttributeRe = "xx",
    Node = {
        ELEMENT_NODE: 1,
        ATTRIBUTE_NODE: 2,
        TEXT_NODE: 3,
        CDATA_SECTION_NODE: 4,
        PROCESSING_INSTRUCTION_NODE: 7,
        COMMENT_NODE: 8,
        DOCUMENT_NODE: 9,
        DOCUMENT_TYPE_NODE: 10,
        DOCUMENT_FRAGMENT_NODE: 11
    }


function parseXml(raw) {

    
}


class XmlPaser {
    constructor(raw) {
        this.raw = raw
        this._MarkupRe = new RegExp(MarkupRe)
        this._NameRe = new RegExp(NameRe)
        this._ExternalIDRe = new RegExp(ExternalIDRe)

        this.lastIndex = 0

        this.breadcrumb = []
        this.cur = this.origins = { children: [] }
    }
    _parseAttributes() {

    }

    _parseName() {
        const re = this._NameRe
        re.lastIndex = this.lastIndex
        const rs = re.exec(this.raw)
        this.lastIndex = re.lastIndex
        return rs
    }

    _parseExternalID() {
        const re = this.ExternalIDRe
        re.lastIndex = this.lastIndex

        const rs = re.exec(this.raw)

        this.lastIndex = re.lastIndex
    }
    _parseDoctypedecl() {

        this.cur.name = this._parseName()

    }
    _parseDeclaration() {
        if ((this.cur.type = this._parseName()) === "DOCTYPE") return this._parseDoctypedecl()
    }

    parse() {
        const l = this.raw.length
        const MarkupRe = this._MarkupRe
        MarkupRe.lastIndex = 0
        var rs, v, cNode
        while (rs = MarkupRe.exec(this.raw)) {
            this.lastIndex = MarkupRe.lastIndex
            if ((v = rs[8]) !== undefined) {
                this.cur.children.push({
                    nodeType: Node.CDATA_SECTION_NODE,
                    data: v
                })
            }
            else if ((g = rs[10]) !== undefined) {
                this.cur.children.push({
                    nodeType: Node.COMMENT_NODE,
                    data: v
                })
            }
            else if (rs[5] !== undefined) {
                // Declaration
                cNode = this.cur = { nodeType: Node.DOCUMENT_TYPE_NODE }
                this.cur.children.push(cNode)
                this.breadcrumb.push(this.cur)
                this.cur = cNode
                this._parseDeclaration()
            }
            else if (rs[11] !== undefined) {
                // Processing Instruction
                this.cur.children.push({
                    nodeType: Node.COMMENT_NODE,
                    data: v
                })
            }
            else if ((v = rs[12]) !== undefined) {
                // Processing Instruction
                this.cur.children.push({
                    nodeType: Node.TEXT_NODE,
                    data: v
                })
            }
            MarkupRe.lastIndex = this.lastIndex
            console.log("re.lastIndex", MarkupRe.lastIndex)
        }
        return "OKKKKKK"
    }


}

module.exports = function (raw) { return (new XmlPaser(raw)).parse() }



// prolog element