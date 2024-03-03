"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

type AppSelector = <TSelected>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected;

export const useAppSelector: AppSelector = useSelector;

export const useAppDispatch: () => AppDispatch = useDispatch;
