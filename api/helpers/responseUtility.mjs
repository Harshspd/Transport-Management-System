export const serverError = (res,error) => {
    console.error('Internal Server Error:', error); 
    return res.status(500).json({ "message": 'Internal Server Error',error:error.message });
};

export const sendErrorResponse = (res, error , message , statusCode) => {
    return res.status(statusCode).json({data:{
        message,
        error},status:statusCode
    });
};