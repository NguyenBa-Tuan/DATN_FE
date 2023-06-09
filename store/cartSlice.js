import { STRAPI_API_TOKEN } from "@/utils/urls";
import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

export const cartSlice = createSlice({
	name: "cart",
	initialState: {
		cartItems: [],
		categories: [],
		cartId: "",
		token: STRAPI_API_TOKEN,
		user: null,
		listFavorite: [],
	},
	reducers: {
		getToCart: (state, action) => {
			state.cartItems = action.payload;
		},
		addToCart: (state, action) => {
			const item = state.cartItems.find(
				(p) =>
					p.id === action.payload.id && p.size === action.payload.size
			);
			if (item) {
				item.count++;
				item.attributes.price = item.oneQuantityPrice * item.count;
			} else {
				state.cartItems.push({ ...action.payload, count: 1 });
			}
		},
		updateCart: (state, action) => {
			state.cartItems = state.cartItems.map((p) => {
				if (p.id === action.payload.id) {
					if (action.payload.key === "quantity") {
						p.attributes.price *= action.payload.val;
					}
					return { ...p, [action.payload.key]: action.payload.val };
				}
				return p;
			});
		},
		removeFromCart: (state, action) => {
			const cart = state.cartItems;
			let data = [];
			cart.map((p) => {
				if (
					!(
						p.id == action.payload.id &&
						(p.size == action.payload.size ||
							p.size == action.payload.selectedSize)
					)
				) {
					data.push(p);
				}
			});
			state.cartItems = data;
		},
		setListCategories: (state, action) => {
			state.categories = action.payload;
		},
		setCardId: (state, action) => {
			state.cartId = action.payload;
		},
		setUser: (state, action) => {
			state.user = action.payload;
		},
		setListFavorites: (state, action) => {
			state.listFavorite = action.payload;
		},
		updateListFavorites: (state, action) => {
			const item = state.listFavorite.find(
				(p) => p.attributes.productId === action.payload
			);
			if (item) {
				const data = state.listFavorite.filter((p) => {
					return p.attributes.productId !== action.payload;
				});
				state.listFavorite = data;
			} else {
				const data = {
					attributes: { productId: action.payload },
				};
				state.listFavorite.push(data);
			}
		},
	},
});

// Action creators are generated for each case reducer function
export const {
	getToCart,
	addToCart,
	updateCart,
	removeFromCart,
	setListCategories,
	setCardId,
	setUser,
	setListFavorites,
	updateListFavorites,
} = cartSlice.actions;

export default cartSlice.reducer;
