// Assets
import { supabase } from "../supabase";

// Types
import { THTTPResponse } from "../types";
import { TTop } from "../types/top.type";

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

  getAllByPlayer: async (playerId: string): Promise<THTTPResponse> => {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("playerId", playerId);

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

  add: async (data: Partial<TTop>): Promise<THTTPResponse> => {
    try {
      const { data: response, error } = await supabase
        .from(TABLE)
        .insert([data])
        .select();

      if (!response || error)
        return {
          hasSuccess: false,
        };

      return {
        hasSuccess: true,
        data: response[0].id,
      };
    } catch (error) {
      console.error("🚀 ~ error:", error);
      return {
        hasSuccess: false,
      };
    }
  },

  remove: async (id: string): Promise<THTTPResponse> => {
    try {
      const { error } = await supabase.from(TABLE).delete().eq("id", id);

      if (error)
        return {
          hasSuccess: false,
        };

      return {
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
