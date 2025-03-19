// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse } from "../types";

const TABLE = "tops";

export const TOP_API = {
  getAll: async (): Promise<THTTPResponse> => {
    try {
      const {
        data,
        error,
        count: totalRecords,
      } = await supabase.from(TABLE).select("*", { count: "exact" });

      if (!data || error)
        return {
          hasSuccess: false,
        };

      return {
        data,
        hasSuccess: true,
        totalRecords: totalRecords && totalRecords,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },
};
