// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse } from "../types";

const TABLE = "decks";

export const DECK_API = {
  getAll: async (): Promise<THTTPResponse> => {
    try {
      const { data, error } = await supabase.from(TABLE).select("*");

      if (!data || error)
        return {
          hasSuccess: false,
        };

      return {
        data,
        hasSuccess: true,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },
};
