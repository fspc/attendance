import { getError } from './engine-errors'
import keywords from './engine-keywords'

const debug = require('debug')('app:forms:engine')

const validQtypes = 'multiple single grid text array paragraph signature'.split(/\s+/)
let survey = { sections: [] }
let currentStep
let currentQ
let current
let errs
let currentA

const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-slug'
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
}

const addQ = (survey, title, lineno) => {
  if (!currentStep) addStep(survey, `Section ${survey.sections.length + 1}`, 1)
  currentQ = {
    title,
    answers: [],
    grid: [],
    id: slugify(title),
    type: 'text',
    object: 'question',
    lineno,
  }
  currentStep.questions.push(currentQ)
  return currentQ
}

const addStep = (survey, title, lineno) => {
  currentStep = {
    title: title || `Section ${survey.sections.length + 1}`,
    questions: [],
    id: slugify(title),
    object: 'step',
    lineno,
  }
  survey.sections.push(currentStep)
  return currentStep
}

const addGrid = (survey, title, lineno) => {
  currentGrid = { title, id: slugify(title), object: 'grid', lineno }
  currentQ.grid.push(currentGrid)
  return currentGrid
}

const addAnswer = (survey, text, lineno) => {
  currentA = { title: text, id: slugify(text), type: 'text', object: 'answer', lineno }
  if (!currentQ) {
    return { errCode: 'e-no-ans' }
  } else currentQ.answers.push(currentA)
  return currentA
}

const objects = [
  { name: 'Question', letters: 'QT', method: addQ, keywords: keywords.question },
  { name: 'Grid', letters: 'G', method: addGrid, keywords: keywords.grid },
  { name: 'Answer', letters: 'A', method: addAnswer, keywords: keywords.answer },
  { name: 'Step', letters: 'S', method: addStep, keywords: keywords.step },
]

const findObject = (name) => objects.find((o) => o.name.toLowerCase() === name)

objects.forEach((o) => {
  o.regex = new RegExp(`^\\s*[${o.letters}][:\\s=]+(.*)\$`, 'i')
})

export const parse = (source) => {
  currentStep = currentQ = current = null
  errs = []
  if (typeof source !== 'string') throw new Error('Parameter to parse must be a string')
  try {
    currentStep = currentQ = current = null
    survey = {
      sections: [],
      name: 'Sample Survey',
      slug: 'sample',
      version: '1',
      active: true,
    }
    const lines = source.split('\n').map((line) => line.trim())
    lines.forEach((line, ix) => {
      const lineno = ix + 1
      // COMMENT
      // debug(`${lineno}: ${line}`)
      if (line && !line.match(/^\s*#/)) {
        let got = false
        objects.forEach((o) => {
          const m = line.match(o.regex)
          // debug(o.regex.toString(), m)
          if (m) {
            // debug(`${o.name}: ${m[1]}`)
            if (o.method) {
              const res = o.method(survey, m[1], lineno, line)
              if (res.errCode) errs.push({ lineno, errCode: res.errCode, line })
              else current = res
            }
            got = true
          }
        })
        if (!got && line.match(/^\s*[a-z][:\s=]/i))
          errs.push({ lineno, errCode: 'e-bad-letter', line })
        if (!got) {
          const m = line.match(/^\s*\+\s*([a-z0-9]+)\s*[:=]*\s*(.*)$/i)
          if (m) {
            got = true
            const [match, key, value] = m
            if (!current)
              errs.push({
                lineno,
                errCode: 'e-no-obj',
                line,
              })
            else {
              const obj = findObject(current.object) || []
              if (!obj?.keywords?.includes(key))
                errs.push({ lineno, errCode: 'e-unk-attrib', line })
              current[key] = value || true
              switch (key) {
                case 'condition':
                  if (typeof value === 'string') current[key] = value.split(/\s+/)
                  break
              }
            }
          } else {
            // debug('no attr', line)
            // It didn't exactly match, but if the line started with a "+", report an error"
            if (line.match(/^\s*\+/)) errs.push({ lineno, errCode: 'w-bad-option', line })
          }
        }
        if (!got) {
          // Just append the line to the title of the current object
          current.title = `${current.title} ${line}`

          // errs.push({ lineno, errCode: 'e-unk', line })
        }
      }
    })
    // Some post-checking for consistency
    survey.sections.forEach((section) => {
      if (section.id === 'no-slug')
        errs.push({ lineno: section.lineno, errCode: 'w-missing-title' })
      section.questions.forEach((q) => {
        if (!validQtypes.includes(q.type))
          errs.push({ lineno: q.lineno, errCode: 'w-unk-type', line: q.type })
        if (q.type === 'paragraph' && q.answers.length)
          errs.push({
            lineno: q.answers[0].lineno,
            errCode: 'w-ignore-attribs',
            line: q.type,
          })
      })
    })
    if (errs.length) {
      debug('Houston, we have problems...', errs)
      return {
        status: 'failed',
        message: '',
        survey,
        errs: errs.map((err) => ({ error: getError({ code: err.errCode }), ...err })),
      }
    }

    return { status: 'success', message: '', survey }
  } catch (e) {
    return { status: 'exception', message: `Error in parse: ${e.message}` }
  }
}
