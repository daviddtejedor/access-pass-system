// src/libs/TypeResponse.ts
import { Response } from "express";

export const typePagination = (
  page: number,
  limit: number,
  totalDocs: number,
  totalPages: number,
  hasNextPage: boolean,
  hasPrevPage: boolean,
  nextPage: number | null,
  prevPage: number | null
) => ({
  page, limit, totalDocs, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage,
});

export const SuccessRes = (res: Response, statusCode: number, message: string, key?: string, data?: any, pagination?: any) => {
  const response: any = { status: "success", message, };

  if (key && data !== undefined)
    response[key] = data;

  if (pagination)
    response.pagination = pagination;

  return res.status(statusCode).json(response);
};

export const ErrorRes = (res: Response, statusCode: number, message: string, details?: any) => {
  return res.status(statusCode).json({
    status: "error", message, ...(details && { details }),
  });
};