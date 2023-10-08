import { UseFormReturn } from "react-hook-form";

export type FormValues<T extends UseFormReturn<any>> = T extends UseFormReturn<
  infer U
>
  ? U
  : never;
