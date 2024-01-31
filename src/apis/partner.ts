import { client } from "@/utils/client";
import { TPartner, TNewPartner } from "types/partner";
import { TListResponse } from "types/http";

export const getPartners = async (deps: string | object) => {
  const response = await client.url("/partners").query(deps).get();
  return response as TListResponse<TPartner>;
};

export const createPartner = async (newPartner: TNewPartner) => {
  const response = await client.url("/partners").post(newPartner);
  return response as TPartner;
};
