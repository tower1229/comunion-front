import path from 'path'
import fs from 'fs'
import prism from 'prismjs'
import loadLanguages from 'prismjs/components/index'

loadLanguages(['typescript', 'tsx'])

var RE = /<Demo /i

function DemoBlockRender(md, tokens, idx) {
  var content = tokens[idx].content
  if (RE.test(content.trim())) {
    var src = (content.match(/src=("|')(\S+)('|")/) || [])[2] ?? ''
    var title = (content.match(/title=("|')(\S+)('|")/) || [])[2] ?? ''
    var desc = content.match(/desc\=\"([\s\S]*)\"/)[1] ?? ''

    var demoPagePath = path.join(__dirname, '../../_demos', `${src}.tsx`)
    if (!src || !fs.existsSync(demoPagePath)) {
      var warningMsg = `${demoPagePath} does not exist!`
      console.warn(`[vitepress]: ${warningMsg}`)
      return `<Demo src="${demoPagePath}" errorMsg="${warningMsg}">`
    }

    var codeStr = fs.readFileSync(demoPagePath).toString()
    var codeHtml = prism.highlight(codeStr, prism.languages.tsx, 'tsx').replace(/\n/g, '<br/>')
    return `<Demo src="${src}" language="tsx" title="${title}" code="${codeStr}" desc="${desc}">
        <pre class="__demo-code language-tsx"><code class="language-tsx">${codeHtml}</code></pre>
      </Demo>`
  } else {
    return content
  }
}

module.exports = function DemoComponentPlugin(md) {
  md.renderer.rules.html_block = (tokens, idx) => {
    return DemoBlockRender(md, tokens, idx)
  }
}
