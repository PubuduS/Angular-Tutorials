import { createReducer, on } from '@ngrx/store';

import { ProductAPIActions, ProductPageActions} from './actions';

import { Product } from '../product';

export interface ProductState {
    showProductCode: boolean;
    currentProductId: number | null;
    products: Product[];
    error: string;
}

const initialState: ProductState =
{
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: ''
}

export const productReducer = createReducer<ProductState>(
    initialState,
    on(ProductPageActions.toggleProductCode, (state): ProductState => {

        return {
            ...state,
            showProductCode: !state.showProductCode
        };
    }),

    on(ProductPageActions.setCurrentProduct, (state, action): ProductState => {
        return {
            ...state,
            currentProductId: action.currentProductId
        };
    }),

    on(ProductPageActions.clearCurrentProduct, (state): ProductState => {
        return {
            ...state,
            currentProductId: null
        };
    }),

    on(ProductPageActions.initializeCurrentProduct, (state): ProductState => {
        return {
            ...state,
            currentProductId: 0
        };
    }),

    on(ProductAPIActions.loadProductsSuccess, (state, action): ProductState => {
        return {
            ...state,
            products: action.products,
            error: ''
        };
    }),

    on(ProductAPIActions.loadProductsFailure, (state, action): ProductState => {
        return {
            ...state,
            products: [],
            error: action.error
        };
    }),

    on(ProductAPIActions.updateProductSuccess, (state, action): ProductState => {

        // Here we create a new array UpdatedProduct.
        // We copy the old items + updated new item resulting a immutable array
        const UpdatedProducts = state.products.map(
            item => action.product.id === item.id ? action.product : item
        );

        // Here we copy the old state
        // Replace products with newly updated products.
        // Replace productId
        // Clear any remaining previous errors.
        return {
            ...state,
            products: UpdatedProducts,
            currentProductId: action.product.id,
            error: ''
        };
    }),

    // Copy the state
    // Update the error message.
    on(ProductAPIActions.updateProductFailure, (state, action): ProductState => {
        return {
            ...state,
            error: action.error
        };
    }),

    on(ProductAPIActions.createProductSuccess, (state, action): ProductState => {
        return{
            ...state,
            products: [ ...state.products, action.product ],
            currentProductId: action.product.id,
            error: ''
        };
    }),

    on(ProductAPIActions.createProductFailure, (state, action): ProductState => {
        return{
            ...state,
            error: action.error
        };
    }),

    on(ProductAPIActions.deleteProductSuccess, (state, action): ProductState => {
        const DeletedProduct = state.products.filter( product => action.productId !== product.id );

        return{
            ...state,
            products: DeletedProduct,
            currentProductId: null,
            error: ''
        };
    }),

    
    on(ProductAPIActions.deleteProductFailure, (state, action): ProductState => {
        return{
            ...state,
            error: action.error
        };
    }),

);