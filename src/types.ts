import { SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

export interface ReactChildren {
  children?: ReactNode;
}

export type MaybeNull<T> = T | null;

export type ColorType =
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

export type MuiSx = { sx?: SxProps<Theme> };

export type ParsedQueryParams = Record<string, string | string[]>;

export interface HookWithQueryParams {
  updateExternalStates?: () => void;
  getQueryParamsWithExternalChanges?: (
    queryParams: ParsedQueryParams,
  ) => ParsedQueryParams;
  withQueryParams?: boolean;
  isYearly?: boolean;
}
