const successResponse = (res, data, message) => {
  res.status(200).json({
    status: 'success',
    data,
    message
  })
}

const createdResponse = (res, data, message) => {
  res.status(201).json({
    status: 'success',
    data,
    message
  })
}

const noContentResponse = (res) => {
  res.status(204).send()
}

const movedPermanentlyResponse = (res, message) => {
  res.status(301).json({
    status: 'moved_permanently',
    message
  })
}

const foundResponse = (res, data, message) => {
  res.status(302).json({
    status: 'found',
    data,
    message
  })
}

const badRequestResponse = (res, message) => {
  res.status(400).json({
    status: 'bad_request',
    message
  })
}

const unauthorizedResponse = (res, message) => {
  res.status(401).json({
    status: 'unauthorized',
    message
  })
}

const forbiddenResponse = (res, message) => {
  res.status(403).json({
    status: 'forbidden',
    message
  })
}

const notFoundResponse = (res, message) => {
  res.status(404).json({
    status: 'not_found',
    message
  })
}

const internalServerErrorResponse = (res, message) => {
  res.status(500).json({
    status: 'internal_server_error',
    message
  })
}

const serviceUnavailableResponse = (res, message) => {
  res.status(503).json({
    status: 'service_unavailable',
    message
  })
}

// error response
const errorResponse = (res, message) => {
  res.status(500).json({
    status: 'error',
    message
  })
}

// exports
module.exports = {
  successResponse,
  createdResponse,
  noContentResponse,
  movedPermanentlyResponse,
  foundResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  internalServerErrorResponse,
  serviceUnavailableResponse,
  errorResponse
}
