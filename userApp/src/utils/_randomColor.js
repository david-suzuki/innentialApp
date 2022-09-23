import gen from 'random-seed'

const InnentialColors = [
  '#152540',
  '#3B4B66',
  '#556685',
  '#8494B2',
  '#5A55AB',
  '#6b66b3',
  '#8c88c4',
  '#bdbbdd',
  '#29A399',
  '#2fbbb0',
  '#54d4c9',
  '#9de6e0',
  '#BA0913',
  '#E72E2D',
  '#FB5854',
  '#FD7C77',
  '#128945',
  '#1CB55C',
  '#2FC373',
  '#4ACF89',
  '#1564A3',
  '#347EB6',
  '#5296CA',
  '#77B1DD',
  '#BF7817',
  '#E89C36',
  '#FEBB5B',
  '#FEC97E'
]

const generatePseudoRandomColor = ({ seed }) => {
  const ix = gen.create(seed)(InnentialColors.length)
  return InnentialColors[ix]
}

export default generatePseudoRandomColor
