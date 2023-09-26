import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import * as AppState from '../../state/app.state';
import * as ProductAction from './product.actions';

import { Product } from '../product';



export interface State extends AppState.State {
    products: ProductState;
}

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

const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
    getProductFeatureState,
    state => state.showProductCode
);

export const getCurrentProductId = createSelector(
    getProductFeatureState,
    state => state.currentProductId
);

export const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state, currentProductId) => 
    {
        if( currentProductId === 0 )
        {
            return{
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0
            };
        }
        else
        {
            return currentProductId ? state.products.find( p => p.id === currentProductId ) : null;
        }
    }
);

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);

export const getError = createSelector(
    getProductFeatureState,
    state => state.error
);

export const productReducer = createReducer<ProductState>(
    initialState,
    on(ProductAction.toggleProductCode, (state): ProductState => {

        return {
            ...state,
            showProductCode: !state.showProductCode
        };
    }),

    on(ProductAction.setCurrentProduct, (state, action): ProductState => {
        return {
            ...state,
            currentProductId: action.currentProductId
        };
    }),

    on(ProductAction.clearCurrentProduct, (state): ProductState => {
        return {
            ...state,
            currentProductId: null
        };
    }),

    on(ProductAction.initializeCurrentProduct, (state): ProductState => {
        return {
            ...state,
            currentProductId: 0
        };
    }),

    on(ProductAction.loadProductsSuccess, (state, action): ProductState => {
        return {
            ...state,
            products: action.products,
            error: ''
        };
    }),

    on(ProductAction.loadProductsFailure, (state, action): ProductState => {
        return {
            ...state,
            products: [],
            error: action.error
        };
    }),

    on(ProductAction.updateProductSuccess, (state, action): ProductState => {

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
    on(ProductAction.updateProductFailure, (state, action): ProductState => {
        return {
            ...state,
            error: action.error
        };
    }),

    on(ProductAction.createProductSuccess, (state, action): ProductState => {
        return{
            ...state,
            products: [ ...state.products, action.product ],
            currentProductId: action.product.id,
            error: ''
        };
    }),

    on(ProductAction.createProductFailure, (state, action): ProductState => {
        return{
            ...state,
            error: action.error
        };
    }),

    on(ProductAction.deleteProductSuccess, (state, action): ProductState => {
        const DeletedProduct = state.products.filter( product => action.productId !== product.id );

        return{
            ...state,
            products: DeletedProduct,
            currentProductId: null,
            error: ''
        };
    }),

    
    on(ProductAction.deleteProductFailure, (state, action): ProductState => {
        return{
            ...state,
            error: action.error
        };
    }),

);