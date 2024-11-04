import db from '../src/lib/server/database.js'
import {readFile, writeFile} from 'fs/promises'

const contents = await readFile('./data/vocabulary.json')
const terms = JSON.parse(contents)

const endings = [
  '(av & v)',
  '(adj)',
  '(adj & n)',
  '(adj & v)',
  '(adj & adv)',
  '(adj & exclam)',
  '(adj & det)',
  '(adj, n & v)',
  '(adj, adv, det & v)',
  '(adj & adv, n)',
  '(adj, adv & n)',
  '(adj, adv & exclam)',
  '(adj, adv & prep)',
  '(adj, adv & v)',
  '(adj, adv, det & pron)',
  '(adj, exclam & v)',
  '(adj, det & pron)',
  '(adj & n & v)',
  '(adj, n & prep)',
  '(adj, n, prep & adv)',
  '(adj, pron & adv)',
  '(adj, pron & det)',
  '(adj, pron & v)',
  '(adv)',
  '(adv & adj)',
  '(adv & conj)',
  '(adv & n)',
  '(adv & prep)',
  '(adv, adj & n)',
  '(adv, adj & prep)',
  '(adv, det, pron)',
  '(adv, det & n)',
  '(adv, det & pron)',
  '(adv, det, n & pron)',
  '(adv, conj & prep)',
  '(adv, prep & adj)',
  '(conj)',
  '(conj & prep)',
  '(conj, n & v)',
  '(conj, det & pron)',
  '(det)',
  '(det & n)',
  '(det & pron)',
  '(exclam)',
  '(exclam & v)',
  '(phr)',
  '(phr v)',
  '(phr v & adj)',
  '(prep)',
  '(prep & conj)',
  '(prep phr)',
  '(prep, conj)',
  '(prep & adv)',
  '(prep & v)',
  '(prep, adv & conj)',
  '(pron)',
  '(pron & det)',
  '(mv)',
  '(n)',
  '(n pl)',
  '(n & adj)',
  '(n & mv)',
  '(n & v)',
  '(n, adj & adv)',
  '(v)',
  '(v & n)',
  '(v & phr v)',
]

const words = []
for (const term of terms) {
  const word = {term}
  const bulletPos = term.indexOf(' •')
  if (bulletPos !== -1) {
    word.examples = term.slice(bulletPos).replace(' • ','').split(' • ')
    word.term = term.slice(0,bulletPos)
  }
  const enbPos = term.indexOf(' (Br Eng) (Am Eng:')
  if (enbPos !== -1) {
    word.language = 'enb'
    word.dialect = term.slice(enbPos)
    word.term = term.slice(0,enbPos)
  }
  const enaPos = term.indexOf(' (Am Eng) (Br Eng:')
  if (enaPos !== -1) {
    word.language = 'ena'
    word.dialect = term.slice(enaPos)
    word.term = term.slice(0,enaPos)
  }
  const enaPos2 = term.indexOf(' (Am Eng)')
  if (enaPos2 !== -1) {
    word.language = 'ena'
    word.term = term.slice(0,enaPos2)
  }
  for (const ending of endings) {
    const term = word.term
      .replace(/\(\sn\)$/, '(n)')
      .replace(/\(\sadv\)$/, '(adv)')
      .replace(/\(\sadj\)$/, '(adj)')
      .replace('( phr v )', '(phr v)')
      .replace(/\(exclaim\)$/, '(exclam)')
      .replace(/\(adv,det/, '(adv, det')
      .replace('carefully (ad)', 'carefully (adv)')
    if (term.endsWith(ending)) {
      word.term = term.slice(0,-ending.length).trimEnd()
      word.type = ending.slice(1,-1).replace(' &', ',')
    }
  }
  if (word.term.endsWith(')')) console.log(word.term)
  words.push(word)
}

await writeFile('./data/vocabulary.json.json', JSON.stringify(words,null,2))
