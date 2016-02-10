export const get = (state) => (req, res, next) => {
  state.model.run().then((results) => res.json(results))
}

export const getSingle = (state) => (req, res, next) => {
  state.model.run().then((results) => res.json(results))
}

export const post = (state) => (req, res, next) => {
  state.model.run().then((results) => res.json(results))
}

export const put = (state) => (req, res, next) => {
  state.model.run().then((results) => res.json(results))
}

export const del = (state) => (req, res, next) => {
  state.model.run().then((results) => res.json(results))
}
