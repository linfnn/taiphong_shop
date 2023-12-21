const successStatus = (res, data, status) => {
    return res.status(200).json({
        status: status,
        count: data.length,
        data: data
    })
}

const successPaginationStatus = (res, data, pagination, status) => {
    return res.status(200).json({
        status: status,
        pagination: pagination,
        data: data
    })
}

const successCreateStatus = (res, data, status) => {
    return res.status(201).json({
        status: status,
        data: data
    })
}

const errorStatus = (res, error) => {
    return res.status(500).json({
        status: 'Internal Server Error',
        message: error.message
    })
}

const badRequestStatus = (res, message) => {
    return res.status(400).json({
        status: 'Bad Request',
        message: message
    })
}

const notFoundStatus = (res, message) => {
    return res.status(404).json({
        status: 'Not found',
        message: message
    })
}

module.exports = {
    successStatus,
    successCreateStatus,
    successPaginationStatus,
    errorStatus,
    badRequestStatus,
    notFoundStatus
}