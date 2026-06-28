const CHORD_TOKEN_RE = /^[A-G][#b]?(m|maj|min|dim|aug|sus[24]?|add|M|maj7|m7|7|9|11|13)?(\/[A-G][#b]?)?$/

function isChordToken(t: string) {
  return CHORD_TOKEN_RE.test(t)
}

function isChordLine(line: string) {
  const tokens = line.trim().split(/\s+/).filter(Boolean)
  return tokens.length > 0 && tokens.every(isChordToken)
}

export interface SongLine {
  chord: string
  lyric: string
}

export function parseSheet(text: string): SongLine[] {
  const raw = text.split('\n')
  const lines: SongLine[] = []
  let i = 0

  while (i < raw.length) {
    const cur = raw[i]
    if (isChordLine(cur)) {
      const next = raw[i + 1] ?? ''
      if (!isChordLine(next) && next.trim()) {
        lines.push({ chord: cur, lyric: next })
        i += 2
      } else {
        lines.push({ chord: cur, lyric: '' })
        i += 1
      }
    } else if (cur.trim() === '') {
      lines.push({ chord: '', lyric: '' })
      i += 1
    } else {
      lines.push({ chord: '', lyric: cur })
      i += 1
    }
  }

  return lines
}

export function extractChords(lines: SongLine[]): string[] {
  return [...new Set(
    lines.flatMap((l) =>
      (l.chord || '').trim().split(/\s+/).filter((t) => isChordToken(t))
    )
  )]
}

export const GRADIENTS = [
  ['#5C1A00', '#1A0800'],
  ['#1A1A5C', '#08081A'],
  ['#1A5C2A', '#081A0B'],
  ['#5C4A00', '#1A1400'],
  ['#3D1A5C', '#0F0820'],
  ['#005C4A', '#001A15'],
  ['#5C1A1A', '#1A0808'],
  ['#1A3D5C', '#080F1A'],
]
