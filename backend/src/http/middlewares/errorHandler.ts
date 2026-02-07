// Middleware global de tratamentos de erros
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../application/use-cases/errors/AppError"; 


export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }

    console.error("Erro inesperado:", error);

    return res.status(500).json({
        message: "Erro de servidor"
    })
}