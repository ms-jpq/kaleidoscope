import $ from "jquery"
global["$"] = global["jQuery"] = $
import "jquery-ui/ui/core.js"
import "jquery-ui/ui/widget.js"
import "jquery-ui/ui/widgets/resizable.js"
import "bootstrap"
import "../wasm_go.js"
import en from "../_locales/en.json"

export const lang = en as any
