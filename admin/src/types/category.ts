export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryParams {
  name: string;
}

export interface UpdateCategoryParams extends CreateCategoryParams {
  id: number;
}
