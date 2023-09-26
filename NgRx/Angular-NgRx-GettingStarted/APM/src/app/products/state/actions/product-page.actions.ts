import { createAction, props } from "@ngrx/store";
import { Product } from "../../product";

export const toggleProductCode = createAction(
    '[Product Page] Toggle Product Code'
);

export const setCurrentProduct = createAction(
    '[Product Page] Set Current Product',
    props< { currentProductId: number } >()
);

export const clearCurrentProduct = createAction(
    '[Product Page] Clear Current Product'
);

export const initializeCurrentProduct = createAction(
    '[Product Page] Initialize Current Product'
);

// ---- Load Action -----
export const loadProducts = createAction(
    '[Product Page] Load'
);

// ---- Update Action -----
export const updateProduct = createAction(
    '[Product Page] Update Product',
    props<{ product: Product }>()
);

// ---- Create Action -----
export const createProduct = createAction(
    '[Product Page] Create Product',
    props<{ product: Product }>()
);

// ---- Delete Action -----
export const deleteProduct = createAction(
    '[Product Page] Delete Product',
    props<{ productId: number }>()
);