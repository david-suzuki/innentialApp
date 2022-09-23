// import { capitalize } from './'

const normalizeSkills = data => {
  return data.reduce((acc, curr) => {
    const currentCategories = acc
      .filter(d => d.hasOwnProperty('value'))
      .reduce((accelerator, current) => {
        if (!accelerator.includes(current.value)) {
          return [...accelerator, current.value]
        }
        return [...accelerator]
      }, [])

    if (!currentCategories.includes(curr.category)) {
      const newCategory = {
        value: curr.category,
        // label: capitalize(curr.category),
        label: curr.category,
        children: [
          {
            // label: capitalize(curr.name),
            label: curr.name,
            value: curr._id,
            mandatory: curr.mandatory
          }
        ]
      }
      acc.push(newCategory)
    } else {
      acc.forEach(a => {
        if (a.value === curr.category) {
          a.children.push({
            // label: capitalize(curr.name),
            label: curr.name,
            value: curr._id,
            mandatory: curr.mandatory
          })
        }
      })
    }

    return acc
  }, [])
}

export default normalizeSkills
